'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { autoCreateInvoiceForOrder } from './invoices'

export async function recordPayment(formData: FormData) {
  const supabase = await createAdminClient()

  const order_id = formData.get('order_id') as string
  const amount = Number(formData.get('amount'))
  const provider = formData.get('provider') as string

  if (!order_id || isNaN(amount)) {
    return { error: 'Order ID and Amount are required.' }
  }

  const { error } = await supabase.from('payments').insert({
    order_id,
    amount,
    provider: provider as 'cash' | 'paymongo',
    status: 'success',
  })

  if (error) {
    console.error('Record payment error:', error)
    return { error: error.message }
  }

  // Update order payment status
  await supabase
    .from('orders')
    .update({ payment_status: 'success' })
    .eq('id', order_id)

  // Auto-generate invoice
  await autoCreateInvoiceForOrder(supabase, order_id)

  revalidatePath('/admin/payments')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/invoices')
  revalidatePath('/customer/invoices')
  return { success: true }
}
