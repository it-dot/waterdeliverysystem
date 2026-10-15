import { createAdminClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database.types'

export type Delivery = Database['public']['Tables']['deliveries']['Row']
export type DeliveryWithRelations = Delivery & {
  orders: Database['public']['Tables']['orders']['Row'] | null
  profiles: { full_name: string | null } | null
}

export async function getDeliveries() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('deliveries')
    .select('*, orders(*, profiles(full_name, phone), order_items(products(name))), profiles!deliveries_rider_id_fkey(full_name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch deliveries', error)
    return { data: null, error }
  }

  return { data: data as unknown as DeliveryWithRelations[], error: null }
}
