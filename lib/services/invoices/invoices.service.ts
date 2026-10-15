import { createAdminClient } from '@/lib/supabase/server'

export async function getInvoices() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('invoices')
    .select('*, profiles:customer_id(full_name, email), orders:order_id(id, total_amount, status)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get invoices error:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
