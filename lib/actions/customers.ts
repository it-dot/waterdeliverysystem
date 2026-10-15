'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCustomer(formData: FormData) {
  const supabase = await createAdminClient()

  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!email || !full_name) {
    return { error: 'Email and Full Name are required.' }
  }

  // Use Supabase Admin API to create the auth user first
  // This satisfies the auth.users foreign key constraint on the profiles table
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true,
    password: 'password123', // Default password for new customers
    user_metadata: { full_name }
  })

  if (authError) {
    console.error('Create auth user error:', authError)
    // If the user already exists, we could try to fetch them, but for this prototype, just return error
    return { error: authError.message }
  }

  const userId = authData.user.id

  const { error } = await supabase.from('profiles').insert({
    id: userId,
    full_name,
    email,
    phone: phone || null,
    address: address || null,
    role: 'customer',
  })

  if (error) {
    console.error('Add customer error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/customers')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function deleteCustomer(customerId: string) {
  const supabase = await createAdminClient()

  // Delete the auth user, which will cascade delete the profile record
  const { error } = await supabase.auth.admin.deleteUser(customerId)

  if (error) {
    console.error('Delete customer error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/customers')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function toggleCustomerStatus(customerId: string, deactivate: boolean) {
  const supabase = await createAdminClient()

  // Ban or unban the user based on the deactivate flag
  const { error } = await supabase.auth.admin.updateUserById(customerId, {
    ban_duration: deactivate ? '876000h' : 'none' // 100 years or none
  })

  if (error) {
    console.error('Toggle customer status error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/customers')
  return { success: true }
}

export async function getCustomerList() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'customer')
    .order('full_name', { ascending: true })

  if (error) {
    console.error('Get customer list error:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function getRiders() {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'rider')
    .order('full_name', { ascending: true })

  if (error) {
    console.error('Get riders error:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
