'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const next = formData.get('next') as string || '/account/profile'

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/account/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
  }

  redirect(next)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('fullName') as string,
      }
    }
  }
  const next = formData.get('next') as string || '/account/profile'

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/account/register?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
  }

  redirect(next)
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle(formData?: FormData) {
  const supabase = await createClient()
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://tamil-edu-hub.vercel.app' : 'http://localhost:3000')
  const next = formData?.get('next') as string || '/account/profile'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect(`/account/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://tamil-edu-hub.vercel.app' : 'http://localhost:3000')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/account/reset-password`,
  })

  if (error) {
    redirect(`/account/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/account/forgot-password?success=true')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/account/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/account/profile')
}
