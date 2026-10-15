'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
  const supabase = await createAdminClient()

  const customer_id = formData.get('customer_id') as string
  const delivery_address = formData.get('delivery_address') as string
  const payment_method = formData.get('payment_method') as string
  const quantity = Number(formData.get('quantity')) || 1
  const product_id = formData.get('product_id') as string

  if (!customer_id || !delivery_address || !product_id) {
    return { error: 'Customer, Product, and Delivery Address are required.' }
  }

  // Fetch product to get actual price
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('price')
    .eq('id', product_id)
    .single()

  if (productError || !product) {
    return { error: 'Invalid product selected.' }
  }

  const price_per_unit = product.price

  const subtotal = quantity * price_per_unit
  const delivery_fee = 20
  const total_amount = subtotal + delivery_fee



  const { data: order, error } = await supabase.from('orders').insert({
    customer_id,
    delivery_address,
    payment_method: payment_method as 'cash' | 'gcash' | 'card',
    subtotal,
    delivery_fee,
    total_amount,
    status: 'pending',
    payment_status: 'pending',
  }).select().single()

  if (error || !order) {
    console.error('Create order error:', error)
    return { error: error?.message || 'Failed to create order' }
  }

  // Insert Order Item
  const { error: itemError } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_id,
    quantity,
    price_at_time: price_per_unit
  })

  if (itemError) {
    console.error('Create order item error:', itemError)
    // We should ideally rollback here, but for now just log it
  }

  // Auto-assign a rider and create delivery record
  const { data: riders } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'rider')

  let assignedRiderId = null
  if (riders && riders.length > 0) {
    const randomIndex = Math.floor(Math.random() * riders.length)
    assignedRiderId = riders[randomIndex].id
  }

  await supabase.from('deliveries').insert({
    order_id: order.id,
    rider_id: assignedRiderId,
    status: 'assigned',
  })

  // Update order status to processing since it's assigned
  await supabase
    .from('orders')
    .update({ status: 'processing' })
    .eq('id', order.id)

  // Auto-create a pending payment record
  await supabase.from('payments').insert({
    order_id: order.id,
    amount: total_amount,
    provider: payment_method as 'cash' | 'paymongo',
    status: 'pending',
  })

  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/deliveries')
  return { success: true, orderId: order.id }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Update order status error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/deliveries')
  return { success: true }
}

export async function deleteOrder(orderId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    console.error('Delete order error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function getPendingOrders() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('orders')
    .select('id, delivery_address, total_amount')
    .in('status', ['pending', 'processing'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get pending orders error:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function bulkUpdateOrderStatus(orderIds: string[], status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from('orders').update({ status }).in('id', orderIds)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/deliveries')
  return { success: true }
}

export async function bulkDeleteOrders(orderIds: string[]) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from('orders').delete().in('id', orderIds)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
