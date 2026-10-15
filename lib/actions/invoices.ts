'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function generateInvoiceNumber(): string {
  const prefix = 'INV'
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${date}-${rand}`
}

export async function autoCreateInvoiceForOrder(supabase: any, order_id: string) {
  // Check if invoice already exists
  const { data: existing } = await supabase
    .from('invoices')
    .select('id')
    .eq('order_id', order_id)
    .maybeSingle()

  if (existing) return { success: true } // Already has an invoice

  const { data: order } = await supabase
    .from('orders')
    .select('customer_id, subtotal, delivery_fee, total_amount')
    .eq('id', order_id)
    .single()

  if (order) {
    await supabase.from('invoices').insert({
      order_id,
      customer_id: order.customer_id,
      invoice_number: generateInvoiceNumber(),
      status: 'paid',
      subtotal: order.subtotal,
      delivery_fee: order.delivery_fee,
      total_amount: order.total_amount,
      due_date: new Date().toISOString(),
      notes: 'Auto-generated invoice from completed payment',
    })
  }
}

export async function createInvoice(formData: FormData) {
  const supabase = await createAdminClient()

  const order_id = formData.get('order_id') as string
  const customer_id = formData.get('customer_id') as string
  const due_date = formData.get('due_date') as string
  const notes = formData.get('notes') as string

  if (!customer_id) {
    return { error: 'Customer is required.' }
  }

  let subtotal = 0
  let delivery_fee = 0
  let total_amount = 0

  // If linked to an order, pull amounts from it
  if (order_id) {
    const { data: order } = await supabase
      .from('orders')
      .select('subtotal, delivery_fee, total_amount')
      .eq('id', order_id)
      .single()

    if (order) {
      subtotal = order.subtotal
      delivery_fee = order.delivery_fee
      total_amount = order.total_amount
    }
  } else {
    // Manual amounts
    subtotal = Number(formData.get('subtotal')) || 0
    delivery_fee = Number(formData.get('delivery_fee')) || 0
    total_amount = subtotal + delivery_fee
  }

  const { error } = await supabase.from('invoices').insert({
    order_id: order_id || null,
    customer_id,
    invoice_number: generateInvoiceNumber(),
    status: 'draft',
    subtotal,
    delivery_fee,
    total_amount,
    due_date: due_date || null,
    notes: notes || null,
  })

  if (error) {
    console.error('Create invoice error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/invoices')
  return { success: true }
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId)

  if (error) {
    console.error('Update invoice status error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/invoices')
  return { success: true }
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)

  if (error) {
    console.error('Delete invoice error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/invoices')
  return { success: true }
}
