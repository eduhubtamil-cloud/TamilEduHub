'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCommunityLink(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const url = formData.get('url') as string
  const label = formData.get('label') as string
  const description = formData.get('description') as string
  const qr_code_url = formData.get('qr_code_url') as string
  const is_enabled = formData.get('is_enabled') === 'on'
  const display_order = parseInt(formData.get('display_order') as string) || 0

  const { error } = await (supabase.from('community_links') as any)
    .update({ 
      url, 
      label, 
      description, 
      qr_code_url,
      is_enabled, 
      display_order,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Failed to update community link')
  }

  revalidatePath('/admin/settings/community-links')
  revalidatePath('/')
}
