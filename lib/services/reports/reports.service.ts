'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function getSalesReport(timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily') {
  const supabase = await createAdminClient()

  const now = new Date()
  let startDate = new Date()
  if (timeframe === 'daily') {
    startDate.setHours(0, 0, 0, 0)
  } else if (timeframe === 'weekly') {
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    startDate.setDate(diff)
    startDate.setHours(0, 0, 0, 0)
  } else if (timeframe === 'monthly') {
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)
  } else if (timeframe === 'yearly') {
    startDate.setMonth(0, 1)
    startDate.setHours(0, 0, 0, 0)
  }
  const startDateStr = startDate.toISOString()

  // Total revenue & orders by status concurrently in parallel
  const [{ data: payments }, { data: orders }] = await Promise.all([
    supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('status', 'success')
      .gte('created_at', startDateStr),
    supabase
      .from('orders')
      .select('id, status, total_amount, created_at')
      .gte('created_at', startDateStr)
  ])

  const totalRevenue = orders?.filter((o: any) => o.status === 'delivered').reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) || 0
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter((o: any) => o.status === 'pending').length || 0
  const completedOrders = orders?.filter((o: any) => o.status === 'delivered').length || 0
  const cancelledOrders = orders?.filter((o: any) => o.status === 'cancelled').length || 0

  // Period metrics
  const periodOrders = orders?.length || 0
  const periodRevenue = orders?.filter((o: any) => o.status === 'delivered').reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) || 0

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    periodOrders,
    periodRevenue,
    orders: orders || [],
    payments: payments || [],
  }
}

export async function getDeliveryReport(timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily') {
  const supabase = await createAdminClient()

  const now = new Date()
  let startDate = new Date()
  if (timeframe === 'daily') {
    startDate.setHours(0, 0, 0, 0)
  } else if (timeframe === 'weekly') {
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    startDate.setDate(diff)
    startDate.setHours(0, 0, 0, 0)
  } else if (timeframe === 'monthly') {
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)
  } else if (timeframe === 'yearly') {
    startDate.setMonth(0, 1)
    startDate.setHours(0, 0, 0, 0)
  }
  const startDateStr = startDate.toISOString()

  const { data: deliveries } = await supabase
    .from('deliveries')
    .select('id, status, created_at, completed_at, rider_id, profiles:rider_id(full_name)')
    .gte('created_at', startDateStr)

  const totalDeliveries = deliveries?.length || 0
  const completedDeliveries = deliveries?.filter((d: any) => d.status === 'delivered').length || 0
  const inTransit = deliveries?.filter((d: any) => d.status === 'in-transit').length || 0
  const failed = deliveries?.filter((d: any) => d.status === 'failed').length || 0

  return {
    totalDeliveries,
    completedDeliveries,
    inTransit,
    failed,
    successRate: totalDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 100) : 0,
    deliveries: deliveries || [],
  }
}

export async function getInventoryReport() {
  const supabase = await createAdminClient()

  const { data: inventory } = await supabase
    .from('inventory')
    .select('id, stock_level, low_stock_threshold, last_restocked_at, products:product_id(name, price)')

  const totalItems = inventory?.length || 0
  const lowStock = inventory?.filter((i: any) => i.stock_level <= i.low_stock_threshold && i.stock_level > 0).length || 0
  const outOfStock = inventory?.filter((i: any) => i.stock_level === 0).length || 0
  const totalStockValue = inventory?.reduce((sum: number, i: any) => {
    const price = (i.products as any)?.price || 0
    return sum + (i.stock_level * price)
  }, 0) || 0

  return {
    totalItems,
    lowStock,
    outOfStock,
    totalStockValue,
    inventory: inventory || [],
  }
}
