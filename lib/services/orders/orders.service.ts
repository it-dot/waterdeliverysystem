import { createAdminClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database.types'

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderWithCustomer = Order & {
  profiles: { full_name: string | null } | null
}

import { cache } from 'react'

export const getRecentOrders = cache(async (limit: number = 5) => {
  const supabase = await createAdminClient()

  // Select only the columns needed to minimize JSON payload size
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at, profiles(full_name), order_items(products(name))')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch orders', error)
    return { data: null, error }
  }

  return { data: data as unknown as OrderWithCustomer[], error: null }
})

export const getDashboardStats = cache(async () => {
  const supabase = await createAdminClient()

  const now = new Date()

  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now)
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const startOfYear = new Date(now)
  startOfYear.setMonth(0, 1)
  startOfYear.setHours(0, 0, 0, 0)
  const startOfYearIso = startOfYear.toISOString()

  // Execute ALL 8 database queries simultaneously in parallel to eliminate waterfall latency
  const [
    totalOrdersRes,
    activeDeliveriesRes,
    totalCustomersRes,
    deliveredOrdersRes,
    inventoryRes,
    recentDeliveriesRes,
    recentOrdersRes,
    recentDeliveredOrdersRes
  ] = await Promise.all([
    // 1. Total Orders count (head query for speed)
    supabase.from('orders').select('*', { count: 'exact', head: true }),

    // 2. Active Deliveries count (head query)
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).in('status', ['assigned', 'in-transit']),

    // 3. Total Customers count (head query)
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),

    // 4. Revenue calculation
    supabase.from('orders').select('total_amount').eq('status', 'delivered'),

    // 5. Inventory Alerts
    supabase.from('inventory').select('stock_level, low_stock_threshold, products(name)'),

    // 6. Recent deliveries for period tabs
    supabase.from('deliveries').select('completed_at').eq('status', 'delivered').gte('completed_at', startOfYearIso),

    // 7. Recent orders for period tabs
    supabase.from('orders').select('created_at').gte('created_at', startOfYearIso),

    // 8. Recent delivered orders for revenue collections
    supabase.from('orders').select('total_amount, updated_at').eq('status', 'delivered').gte('updated_at', startOfYearIso)
  ])

  const totalOrders = totalOrdersRes.count || 0
  const activeDeliveries = activeDeliveriesRes.count || 0
  const totalCustomers = totalCustomersRes.count || 0
  const revenue = (deliveredOrdersRes.data || []).reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0)

  const inventoryAlerts = (inventoryRes.data || [])
    .filter((item: any) => item.stock_level <= item.low_stock_threshold)
    .map((item: any) => ({
      name: (item.products as any)?.name || 'Unknown',
      stock_level: item.stock_level,
      low_stock_threshold: item.low_stock_threshold
    }))

  const recentDeliveries = (recentDeliveriesRes.data || []) as any[]
  const recentOrders = (recentOrdersRes.data || []) as any[]
  const recentDeliveredOrders = (recentDeliveredOrdersRes.data || []) as any[]

  const getSummary = (startDate: Date) => {
    const iso = startDate.toISOString()
    return {
      deliveriesCompleted: recentDeliveries.filter((d: any) => d.completed_at && d.completed_at >= iso).length,
      newOrders: recentOrders.filter((o: any) => o.created_at && o.created_at >= iso).length,
      collections: recentDeliveredOrders.filter((o: any) => o.updated_at && o.updated_at >= iso).reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0)
    }
  }

  return {
    totalOrders,
    activeDeliveries,
    totalCustomers,
    revenue,
    inventoryAlerts,
    summaries: {
      daily: getSummary(startOfToday),
      weekly: getSummary(startOfWeek),
      monthly: getSummary(startOfMonth),
      yearly: getSummary(startOfYear),
    }
  }
})
