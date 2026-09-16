'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!name || !email || !subject || !message) {
    return { error: 'All fields are required.' }
  }

  const supabase = await createClient()

  const { error } = await (supabase
    .from('contact_messages') as any)
    .insert({
      name,
      email,
      subject,
      message,
    })

  if (error) {
    console.error('Contact submission error:', error)
    return { error: 'Failed to send message. Please try again later.' }
  }

  return { success: true }
}
