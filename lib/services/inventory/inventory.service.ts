import { createAdminClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database.types'

export type InventoryItem = Database['public']['Tables']['inventory']['Row']
export type InventoryWithProduct = InventoryItem & {
  products: Database['public']['Tables']['products']['Row'] | null
}

export async function getInventory() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('inventory')
    .select('*, products(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch inventory', error)
    return { data: null, error }
  }

  return { data: data as unknown as InventoryWithProduct[], error: null }
}
