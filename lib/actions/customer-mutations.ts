'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function customerPlaceOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to place an order.' }
  }

  const customer_id = user.id
  const product_id = formData.get('product_id') as string
  const delivery_address = formData.get('delivery_address') as string
  const payment_method = formData.get('payment_method') as string
  const quantity = Number(formData.get('quantity')) || 1
  
  if (!delivery_address || !product_id) {
    return { error: 'Product and Delivery Address are required.' }
  }

  // Use admin client for mutations to bypass complex RLS during MVP
  const adminClient = await createAdminClient()

  // 1. Fetch product to get actual price
  const { data: product, error: productError } = await adminClient
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

  // 2. Insert Order
  const { data: order, error: orderError } = await adminClient.from('orders').insert({
    customer_id,
    delivery_address,
    payment_method: payment_method as 'cash' | 'gcash' | 'card',
    subtotal,
    delivery_fee,
    total_amount,
    status: 'pending',
    payment_status: 'pending',
  }).select().single()

  if (orderError || !order) {
    return { error: orderError?.message || 'Failed to create order' }
  }

  // Update profile address so it remembers for next time
  await adminClient.from('profiles').update({ address: delivery_address }).eq('id', customer_id)

  // 3. Insert Order Item
  const { error: itemError } = await adminClient.from('order_items').insert({
    order_id: order.id,
    product_id,
    quantity,
    price_at_time: price_per_unit
  })

  // 4. Auto-assign a rider and create delivery record
  const { data: riders } = await adminClient
    .from('profiles')
    .select('id')
    .eq('role', 'rider')

  let assignedRiderId = null
  if (riders && riders.length > 0) {
    const randomIndex = Math.floor(Math.random() * riders.length)
    assignedRiderId = riders[randomIndex].id
  }

  await adminClient.from('deliveries').insert({
    order_id: order.id,
    rider_id: assignedRiderId,
    status: 'assigned',
  })

  // Update order status to processing since it's assigned
  await adminClient
    .from('orders')
    .update({ status: 'processing' })
    .eq('id', order.id)

  // Auto-create a pending payment record
  await adminClient.from('payments').insert({
    order_id: order.id,
    amount: total_amount,
    provider: payment_method as 'cash' | 'paymongo',
    status: 'pending',
  })

  revalidatePath('/customer/dashboard')
  revalidatePath('/customer/orders')
  revalidatePath('/admin/deliveries')
  revalidatePath('/admin/orders')
  return { success: true, orderId: order.id }
}
