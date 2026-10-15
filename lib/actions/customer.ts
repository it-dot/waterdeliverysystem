'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/services/auth/auth.service'
import { cache } from 'react'

export const getCustomerDashboardStats = cache(async () => {
  const authRes = await getAuthUser()
  const user = authRes.data?.user
  if (!user) return { data: null, error: 'Unauthorized' }

  const adminClient = await createAdminClient()

  // Fetch active orders, active schedules, and pending invoices simultaneously in parallel
  const [
    { data: activeOrders },
    { data: activeSchedules },
    { data: pendingInvoices }
  ] = await Promise.all([
    // 1. Get active orders with assigned rider details
    adminClient
      .from('orders')
      .select('id, status, total_amount, created_at, delivery_address, order_items(products(name)), deliveries(id, status, rider_id, profiles:rider_id(full_name, phone))')
      .eq('customer_id', user.id)
      .in('status', ['pending', 'processing', 'in-transit'])
      .order('created_at', { ascending: false })
      .limit(10),

    // 2. Get active schedules
    adminClient
      .from('schedules')
      .select('id, frequency, next_delivery_date, status')
      .eq('customer_id', user.id)
      .eq('status', 'active')
      .limit(10),

    // 3. Get pending invoices
    adminClient
      .from('invoices')
      .select('id, total_amount, due_date, status')
      .eq('customer_id', user.id)
      .in('status', ['draft', 'sent', 'overdue'])
      .limit(10)
  ])

  return {
    data: {
      activeOrders: activeOrders || [],
      activeSchedules: activeSchedules || [],
      pendingInvoices: pendingInvoices || []
    }
  }
})

export async function getCustomerOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  const adminClient = await createAdminClient()

  const { data, error } = await adminClient
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      created_at,
      payment_status,
      delivery_address,
      deliveries (
        id,
        status,
        rider_id,
        profiles:rider_id (
          full_name,
          phone
        )
      ),
      order_items (
        quantity,
        price_at_time,
        products ( name )
      )
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getCustomerInvoices() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  const adminClient = await createAdminClient()

  const { data, error } = await adminClient
    .from('invoices')
    .select(`
      *,
      orders (
        id,
        order_items (
          quantity,
          price_at_time,
          products ( name )
        )
      )
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getCustomerProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  const adminClient = await createAdminClient()

  const { data, error } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
