'use server'

import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getAuthUser = cache(async () => {
  try {
    const supabase = await createClient()
    return await supabase.auth.getUser()
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err
    }
    console.error('Supabase Auth error in getAuthUser:', err?.message || err)
    return { data: { user: null }, error: err }
  }
})

export const getCurrentUser = cache(async () => {
  try {
    const supabase = await createClient()

    const { data, error: authError } = await supabase.auth.getUser()
    const user = data?.user

    if (authError || !user) {
      return { data: null, error: authError?.message || 'Not authenticated' }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { data: null, error: profileError.message }
    }

    return {
      data: {
        id: user.id,
        email: user.email || profile?.email,
        full_name: profile?.full_name,
        phone: profile?.phone,
        address: profile?.address,
        role: profile?.role,
        created_at: profile?.created_at,
      },
      error: null
    }
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err
    }
    console.error('Supabase Auth error in getCurrentUser:', err?.message || err)
    return { data: null, error: err?.message || 'Failed to authenticate user' }
  }
})

