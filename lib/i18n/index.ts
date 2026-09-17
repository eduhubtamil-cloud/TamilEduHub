import { cookies } from 'next/headers'
import { en } from './en'
import { ta } from './ta'

export type Dictionary = typeof en

export async function getLanguage() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('tamileduhub-language')?.value
  
  if (lang === 'ta') return 'ta'
  return 'en'
}

export async function getDictionary(): Promise<Dictionary> {
  const lang = await getLanguage()
  return lang === 'ta' ? ta : en
}
