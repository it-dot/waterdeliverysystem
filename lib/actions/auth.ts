'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch user role to determine redirect
  const { data: { user } } = await supabase.auth.getUser()
  let redirectUrl = '/'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      redirectUrl = '/admin/dashboard'
    } else if (profile?.role === 'rider') {
      redirectUrl = '/rider/dashboard'
    } else if (profile?.role === 'customer') {
      redirectUrl = '/customer/dashboard'
    }
  }

  return { success: true, redirectUrl }
}

export async function resetPassword(email: string) {
  if (!email) {
    return { error: 'Email is required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!email || !password || !full_name) {
    return { error: 'Email, password, and full name are required.' }
  }

  const { createAdminClient } = await import('@/lib/supabase/server')
  const adminClient = await createAdminClient()

  // Use admin client to create user so we can auto-confirm email
  // This is necessary if email sending is not configured in Supabase
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      full_name,
    },
    email_confirm: true,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await adminClient.from('profiles').insert({
      id: data.user.id,
      full_name,
      email,
      phone: phone || null,
      address: address || null,
      role: 'customer',
    })
  }

  // After successful signup, redirect them to login as requested.
  redirect('/login')
}
