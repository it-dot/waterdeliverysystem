import { createAdminClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database.types'

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentWithRelations = Payment & {
  orders: (Database['public']['Tables']['orders']['Row'] & {
    profiles: { full_name: string | null } | null
  }) | null
}

export async function getPayments(status?: string) {
  const supabase = await createAdminClient()

  let query = supabase
    .from('payments')
    .select('*, orders(*, profiles(full_name))')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch payments', error)
    return { data: null, error }
  }

  return { data: data as unknown as PaymentWithRelations[], error: null }
}
