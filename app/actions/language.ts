'use server'

import { cookies } from 'next/headers'

export async function setLanguage(lang: 'en' | 'ta') {
  const cookieStore = await cookies()
  cookieStore.set('tamileduhub-language', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })
}
