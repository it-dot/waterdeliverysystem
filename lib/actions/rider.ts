'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/services/auth/auth.service'
import { cache } from 'react'
import { revalidatePath } from 'next/cache'
import { deductInventoryForOrder } from './inventory'
import { autoCreateInvoiceForOrder } from './invoices'

export const getRiderDashboardData = cache(async () => {
  const authRes = await getAuthUser()
  const user = authRes.data?.user
  if (!user) {
    return { data: { pending: [], completedCount: 0 }, error: 'Unauthorized' }
  }

  const adminClient = await createAdminClient()

  // Run pending deliveries and completed deliveries count simultaneously in parallel
  const [pendingRes, completedCountRes] = await Promise.all([
    adminClient
      .from('deliveries')
      .select('*, orders(id, delivery_address, total_amount, payment_method, profiles(full_name, phone), order_items(products(name)))')
      .in('status', ['assigned', 'in-transit'])
      .order('scheduled_date', { ascending: true })
      .eq('rider_id', user.id),

    adminClient
      .from('deliveries')
      .select('*', { count: 'exact', head: true })
      .in('status', ['delivered', 'failed'])
      .eq('rider_id', user.id)
  ])

  return {
    data: {
      pending: pendingRes.data || [],
      completedCount: completedCountRes.count || 0
    },
    error: pendingRes.error?.message || null
  }
})

export async function getRiderDeliveries(riderId?: string) {
  const adminClient = await createAdminClient()
  const supabase = await createClient()

  let targetRiderId = riderId
  if (!targetRiderId) {
    const { data: { user } } = await supabase.auth.getUser()
    targetRiderId = user?.id
  }

  if (!targetRiderId) {
    return { data: [], error: null }
  }

  let query = adminClient
    .from('deliveries')
    .select('*, orders(id, delivery_address, total_amount, payment_method, profiles(full_name, phone), order_items(products(name)))')
    .in('status', ['assigned', 'in-transit'])
    .order('scheduled_date', { ascending: true })
    .eq('rider_id', targetRiderId)

  const { data, error } = await query

  if (error) {
    console.error('Get rider deliveries error:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function getRiderCompletedDeliveries(riderId?: string) {
  const adminClient = await createAdminClient()
  const supabase = await createClient()

  let targetRiderId = riderId
  if (!targetRiderId) {
    const { data: { user } } = await supabase.auth.getUser()
    targetRiderId = user?.id
  }

  if (!targetRiderId) {
    return { data: [], error: null }
  }

  let query = adminClient
    .from('deliveries')
    .select('*, orders(id, delivery_address, total_amount, payment_method, profiles(full_name, phone), order_items(products(name)))')
    .in('status', ['delivered', 'failed'])
    .order('completed_at', { ascending: false })
    .eq('rider_id', targetRiderId)
    .limit(50)

  const { data, error } = await query

  if (error) {
    console.error('Get rider completed deliveries error:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function markDeliveryStatus(deliveryId: string, status: 'in-transit' | 'delivered' | 'failed') {
  const supabase = await createAdminClient()

  const updateData: Record<string, unknown> = { status }
  if (status === 'delivered' || status === 'failed') {
    updateData.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('deliveries')
    .update(updateData)
    .eq('id', deliveryId)

  if (error) {
    console.error('Mark delivery status error:', error)
    return { error: error.message }
  }

  // Sync order status
  const orderStatusMap: Record<string, string> = {
    'in-transit': 'in-transit',
    'delivered': 'delivered',
    'failed': 'cancelled',
  }
  
  if (orderStatusMap[status]) {
    const { data: delivery } = await supabase
      .from('deliveries')
      .select('order_id')
      .eq('id', deliveryId)
      .single()

    if (delivery) {
      await supabase
        .from('orders')
        .update({ status: orderStatusMap[status] })
        .eq('id', delivery.order_id)
        
      if (status === 'in-transit') {
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('order_id', delivery.order_id)
          .maybeSingle()
          
        if (!existingPayment) {
          const { data: orderDetails } = await supabase
            .from('orders')
            .select('total_amount, payment_method')
            .eq('id', delivery.order_id)
            .single()

          if (orderDetails) {
            await supabase.from('payments').insert({
              order_id: delivery.order_id,
              amount: orderDetails.total_amount,
              provider: orderDetails.payment_method,
              status: 'pending',
            })
          }
        }
      }

      if (status === 'delivered') {
        await deductInventoryForOrder(delivery.order_id)
        
        // Auto-update or create payment
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('order_id', delivery.order_id)
          .maybeSingle()

        if (existingPayment) {
          await supabase
            .from('payments')
            .update({ status: 'success' })
            .eq('id', existingPayment.id)
            .eq('status', 'pending')
            
          await autoCreateInvoiceForOrder(supabase, delivery.order_id)
        } else {
          const { data: orderDetails } = await supabase
            .from('orders')
            .select('total_amount, payment_method')
            .eq('id', delivery.order_id)
            .single()

          if (orderDetails) {
            await supabase.from('payments').insert({
              order_id: delivery.order_id,
              amount: orderDetails.total_amount,
              provider: orderDetails.payment_method,
              status: 'success',
            })
            await autoCreateInvoiceForOrder(supabase, delivery.order_id)
          }
        }
      } else if (status === 'failed') {
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('order_id', delivery.order_id)
          .maybeSingle()

        if (existingPayment) {
          await supabase
            .from('payments')
            .update({ status: 'failed' })
            .eq('id', existingPayment.id)
            .eq('status', 'pending')
        } else {
          const { data: orderDetails } = await supabase
            .from('orders')
            .select('total_amount, payment_method')
            .eq('id', delivery.order_id)
            .single()

          if (orderDetails) {
            await supabase.from('payments').insert({
              order_id: delivery.order_id,
              amount: orderDetails.total_amount,
              provider: orderDetails.payment_method,
              status: 'failed',
            })
          }
        }
      }
    }
  }

  revalidatePath('/rider/deliveries')
  revalidatePath('/rider/dashboard')
  revalidatePath('/rider/history')
  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  return { success: true }
}

export async function bulkMarkDeliveryStatus(deliveryIds: string[], status: 'in-transit' | 'delivered' | 'failed') {
  const supabase = await createAdminClient()

  for (const deliveryId of deliveryIds) {
    const updateData: Record<string, unknown> = { status }
    if (status === 'delivered' || status === 'failed') {
      updateData.completed_at = new Date().toISOString()
    }

    await supabase.from('deliveries').update(updateData).eq('id', deliveryId)

    const orderStatusMap: Record<string, string> = {
      'in-transit': 'in-transit',
      'delivered': 'delivered',
      'failed': 'cancelled',
    }
    
    if (orderStatusMap[status]) {
      const { data: delivery } = await supabase.from('deliveries').select('order_id').eq('id', deliveryId).single()
      if (delivery) {
        await supabase.from('orders').update({ status: orderStatusMap[status] }).eq('id', delivery.order_id)
        if (status === 'in-transit') {
          const { data: existingPayment } = await supabase
            .from('payments')
            .select('id')
            .eq('order_id', delivery.order_id)
            .maybeSingle()
            
          if (!existingPayment) {
            const { data: orderDetails } = await supabase
              .from('orders')
              .select('total_amount, payment_method')
              .eq('id', delivery.order_id)
              .single()

            if (orderDetails) {
              await supabase.from('payments').insert({
                order_id: delivery.order_id,
                amount: orderDetails.total_amount,
                provider: orderDetails.payment_method,
                status: 'pending',
              })
            }
          }
        }

        if (status === 'delivered') {
          await deductInventoryForOrder(delivery.order_id)
          
          const { data: existingPayment } = await supabase
            .from('payments')
            .select('id')
            .eq('order_id', delivery.order_id)
            .maybeSingle()

          if (existingPayment) {
            await supabase
              .from('payments')
              .update({ status: 'success' })
              .eq('id', existingPayment.id)
              .eq('status', 'pending')
              
            await autoCreateInvoiceForOrder(supabase, delivery.order_id)
          } else {
            const { data: orderDetails } = await supabase
              .from('orders')
              .select('total_amount, payment_method')
              .eq('id', delivery.order_id)
              .single()

            if (orderDetails) {
              await supabase.from('payments').insert({
                order_id: delivery.order_id,
                amount: orderDetails.total_amount,
                provider: orderDetails.payment_method,
                status: 'success',
              })
              await autoCreateInvoiceForOrder(supabase, delivery.order_id)
            }
          }
        } else if (status === 'failed') {
          const { data: existingPayment } = await supabase
            .from('payments')
            .select('id')
            .eq('order_id', delivery.order_id)
            .maybeSingle()

          if (existingPayment) {
            await supabase
              .from('payments')
              .update({ status: 'failed' })
              .eq('id', existingPayment.id)
              .eq('status', 'pending')
          } else {
            const { data: orderDetails } = await supabase
              .from('orders')
              .select('total_amount, payment_method')
              .eq('id', delivery.order_id)
              .single()

            if (orderDetails) {
              await supabase.from('payments').insert({
                order_id: delivery.order_id,
                amount: orderDetails.total_amount,
                provider: orderDetails.payment_method,
                status: 'failed',
              })
            }
          }
        }
      }
    }
  }

  revalidatePath('/rider/deliveries')
  revalidatePath('/rider/dashboard')
  revalidatePath('/rider/history')
  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  return { success: true }
}
