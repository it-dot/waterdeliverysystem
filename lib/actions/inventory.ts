'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addInventoryItem(formData: FormData) {
  const supabase = await createAdminClient()

  const name = formData.get('name') as string
  const price = Number(formData.get('price'))
  const stock_level = Number(formData.get('stock_level'))
  const low_stock_threshold = Number(formData.get('low_stock_threshold'))

  if (!name || isNaN(price)) {
    return { error: 'Valid Name and Price are required.' }
  }

  // 1. Create Product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({ name, price, description: '' })
    .select()
    .single()

  if (productError || !product) {
    console.error('Create product error:', productError)
    return { error: productError?.message || 'Failed to create product' }
  }

  // 2. Create Inventory Record
  const { error: invError } = await supabase.from('inventory').insert({
    product_id: product.id,
    stock_level: isNaN(stock_level) ? 0 : stock_level,
    low_stock_threshold: isNaN(low_stock_threshold) ? 10 : low_stock_threshold,
  })

  if (invError) {
    console.error('Create inventory error:', invError)
    return { error: invError.message }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function updateStock(inventoryId: string, newStockLevel: number) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('inventory')
    .update({
      stock_level: newStockLevel,
      last_restocked_at: new Date().toISOString(),
    })
    .eq('id', inventoryId)

  if (error) {
    console.error('Update stock error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function deleteInventoryItem(inventoryId: string, productId: string) {
  const supabase = await createAdminClient()

  // Delete inventory record first (child), then product (parent)
  const { error: invError } = await supabase
    .from('inventory')
    .delete()
    .eq('id', inventoryId)

  if (invError) {
    console.error('Delete inventory error:', invError)
    return { error: invError.message }
  }

  const { error: prodError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (prodError) {
    console.error('Delete product error:', prodError)
    return { error: prodError.message }
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function getProductsList() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select('id, name, price')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Get products error:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function deductInventoryForOrder(orderId: string) {
  const supabase = await createAdminClient()

  // Fetch the order items
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)

  if (itemsError || !orderItems || orderItems.length === 0) {
    console.error('Failed to fetch order items for inventory deduction', itemsError)
    return { error: 'Could not fetch order items.' }
  }

  // For each item, fetch current inventory and deduct
  for (const item of orderItems) {
    const { data: inv, error: invFetchError } = await supabase
      .from('inventory')
      .select('id, stock_level')
      .eq('product_id', item.product_id)
      .single()

    if (invFetchError || !inv) {
      console.error(`Failed to fetch inventory for product ${item.product_id}`, invFetchError)
      continue
    }

    const newStockLevel = Math.max(0, inv.stock_level - item.quantity)

    const { error: updateError } = await supabase
      .from('inventory')
      .update({ stock_level: newStockLevel })
      .eq('id', inv.id)

    if (updateError) {
      console.error(`Failed to update inventory for product ${item.product_id}`, updateError)
    }
  }
  
  revalidatePath('/admin/inventory')
  return { success: true }
}
