'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { deductInventoryForOrder } from './inventory'
import { autoCreateInvoiceForOrder } from './invoices'

export async function createDelivery(formData: FormData) {
  const supabase = await createAdminClient()

  const order_id = formData.get('order_id') as string
  const rider_id = formData.get('rider_id') as string
  const scheduled_date = formData.get('scheduled_date') as string
  const notes = formData.get('notes') as string

  if (!order_id) {
    return { error: 'Order is required.' }
  }

  const { error } = await supabase.from('deliveries').insert({
    order_id,
    rider_id: rider_id || null,
    scheduled_date: scheduled_date || null,
    notes: notes || null,
    status: 'assigned',
  })

  if (error) {
    console.error('Create delivery error:', error)
    return { error: error.message }
  }

  // Also update the order status to processing
  await supabase
    .from('orders')
    .update({ status: 'processing' })
    .eq('id', order_id)

  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function updateDeliveryStatus(deliveryId: string, status: string) {
  const supabase = await createAdminClient()

  const { data: delivery, error: fetchError } = await supabase
    .from('deliveries')
    .select('order_id')
    .eq('id', deliveryId)
    .single()

  if (fetchError || !delivery) {
    return { error: 'Delivery not found.' }
  }

  const updates: Record<string, unknown> = { status }
  if (status === 'delivered') {
    updates.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('deliveries')
    .update(updates)
    .eq('id', deliveryId)

  if (error) {
    console.error('Update delivery error:', error)
    return { error: error.message }
  }

  // Sync order status
  const orderStatusMap: Record<string, string> = {
    'assigned': 'processing',
    'in-transit': 'in-transit',
    'delivered': 'delivered',
    'failed': 'cancelled',
  }
  if (orderStatusMap[status]) {
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
      
      // Check if a payment exists
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

  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/payments')
  revalidatePath('/admin/dashboard')
  revalidatePath('/customer/dashboard')
  revalidatePath('/customer/orders')
  return { success: true }
}

export async function deleteDelivery(deliveryId: string) {
  const supabase = await createAdminClient()
  
  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', deliveryId)

  if (error) {
    console.error('Delete delivery error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function bulkUpdateDeliveryStatus(deliveryIds: string[], status: string) {
  const supabase = await createAdminClient()

  for (const id of deliveryIds) {
    const updates: Record<string, unknown> = { status }
    if (status === 'delivered') {
      updates.completed_at = new Date().toISOString()
    }
    await supabase.from('deliveries').update(updates).eq('id', id)
    
    // Sync order
    const { data: delivery } = await supabase.from('deliveries').select('order_id').eq('id', id).single()
    if (delivery) {
      const orderStatusMap: Record<string, string> = {
        'assigned': 'processing',
        'in-transit': 'in-transit',
        'delivered': 'delivered',
        'failed': 'cancelled',
      }
      if (orderStatusMap[status]) {
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

  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/payments')
  revalidatePath('/admin/dashboard')
  revalidatePath('/rider/deliveries')
  revalidatePath('/rider/dashboard')
  return { success: true }
}

export async function bulkDeleteDeliveries(deliveryIds: string[]) {
  const supabase = await createAdminClient()
  
  for (const id of deliveryIds) {
    await supabase.from('deliveries').delete().eq('id', id)
  }

  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
