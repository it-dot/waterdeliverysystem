'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSchedule(formData: FormData) {
  const supabase = await createAdminClient()

  const customer_id = formData.get('customer_id') as string
  const product_id = formData.get('product_id') as string
  const quantity = Number(formData.get('quantity')) || 1
  const frequency = formData.get('frequency') as string
  const next_delivery_date = formData.get('next_delivery_date') as string

  if (!customer_id || !product_id || !frequency || !next_delivery_date) {
    return { error: 'All fields are required.' }
  }

  const { error } = await supabase.from('schedules').insert({
    customer_id,
    product_id,
    quantity,
    frequency,
    next_delivery_date,
    status: 'active'
  })

  if (error) {
    console.error('Create schedule error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/schedules')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function updateScheduleStatus(scheduleId: string, status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('schedules')
    .update({ status })
    .eq('id', scheduleId)

  if (error) {
    console.error('Update schedule status error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/schedules')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function deleteSchedule(scheduleId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', scheduleId)

  if (error) {
    console.error('Delete schedule error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/schedules')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
