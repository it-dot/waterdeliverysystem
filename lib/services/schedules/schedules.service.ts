import { createAdminClient } from '@/lib/supabase/server'
// import { Database } from '@/lib/types/database.types'

export async function getSchedules() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('schedules')
    .select('*, profiles(full_name), products(name)')
    .order('next_delivery_date', { ascending: true })
  
  if (error) {
    console.error('Failed to fetch schedules', error)
    return { data: null, error }
  }

  return { data, error: null }
}
