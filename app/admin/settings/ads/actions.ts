'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAd(formData: FormData) {
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const ad_code = formData.get('ad_code') as string
  const is_active = formData.get('is_active') === 'on'

  const supabase = await createClient()

  const { error } = await (supabase
    .from('advertisements') as any)
    .insert({ name, location, ad_code, is_active })

  if (error) {
    console.error('Error creating ad:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/settings/ads')
  revalidatePath('/', 'layout') // Revalidate all pages to show/hide ads
  return { success: true }
}

export async function updateAd(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const ad_code = formData.get('ad_code') as string
  const is_active = formData.get('is_active') === 'on'

  const supabase = await createClient()

  const { error } = await (supabase
    .from('advertisements') as any)
    .update({ name, location, ad_code, is_active })
    .eq('id', id)

  if (error) {
    console.error('Error updating ad:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/settings/ads')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteAd(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()

  const { error } = await (supabase
    .from('advertisements') as any)
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/settings/ads')
  revalidatePath('/', 'layout')
  return { success: true }
}
