import { createAdminClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database.types'

export type Customer = Database['public']['Tables']['profiles']['Row'] & {
  // Add derived fields for UI convenience
  totalOrders?: number
  status?: 'Active' | 'Deactivated'
}

export async function getCustomers() {
  const supabase = await createAdminClient()

  // In a real application, you might join with orders to get totalOrders.
  // We filter by role = 'customer' assuming the profile table uses roles.
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch customers', error)
    return { data: null, error }
  }

  // Fetch auth users to check if they are banned
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  })

  const authUsersMap = new Map(
    authData?.users.map((u: any) => [u.id, u.banned_until]) || []
  )

  // To match the UI requirements, let's pretend we calculated total orders
  const customersWithStats = data.map((customer: any) => {
    const isBanned = !!authUsersMap.get(customer.id)
    return {
      ...customer,
      totalOrders: 0, // In reality, this would come from a join or RPC call
      status: isBanned ? 'Deactivated' : 'Active',
    }
  })

  return { data: customersWithStats, error: null }
}
