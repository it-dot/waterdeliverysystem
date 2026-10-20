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

  try {
    // 1. Fetch all orders for this customer
    const { data: orders } = await supabase
      .from('orders')
      .select('id')
      .eq('customer_id', customerId)

    const orderIds = (orders || []).map((o) => o.id)

    if (orderIds.length > 0) {
      // 2. Cascade delete dependent tables referencing these orders
      await supabase.from('payments').delete().in('order_id', orderIds)
      await supabase.from('invoices').delete().in('order_id', orderIds)
      await supabase.from('deliveries').delete().in('order_id', orderIds)
      await supabase.from('order_items').delete().in('order_id', orderIds)

      // 3. Delete the orders
      const { error: ordersErr } = await supabase
        .from('orders')
        .delete()
        .eq('customer_id', customerId)

      if (ordersErr) {
        console.error('Error deleting customer orders:', ordersErr)
        return { error: `Failed to remove orders: ${ordersErr.message}` }
      }
    }

    // 4. Delete invoices directly linked to customer (if any order-less invoices exist)
    await supabase.from('invoices').delete().eq('customer_id', customerId)

    // 5. Delete schedules for this customer
    await supabase.from('schedules').delete().eq('customer_id', customerId)

    // 6. If this user was assigned as a rider anywhere, nullify rider_id
    await supabase.from('deliveries').update({ rider_id: null }).eq('rider_id', customerId)

    // 7. Delete profile record
    const { error: profileErr } = await supabase
      .from('profiles')
      .delete()
      .eq('id', customerId)

    if (profileErr) {
      console.error('Error deleting profile:', profileErr)
      return { error: `Failed to remove profile: ${profileErr.message}` }
    }

    // 8. Delete auth user
    const { error: authErr } = await supabase.auth.admin.deleteUser(customerId)
    if (authErr && !authErr.message.includes('User not found')) {
      console.error('Delete auth user error:', authErr)
      return { error: authErr.message }
    }

    revalidatePath('/admin/customers')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/orders')
    revalidatePath('/admin/invoices')
    revalidatePath('/admin/schedules')
    revalidatePath('/admin/deliveries')
    return { success: true }
  } catch (err: unknown) {
    console.error('Unexpected error during customer deletion:', err)
    const message = err instanceof Error ? err.message : 'Failed to delete customer'
    return { error: message }
  }
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
