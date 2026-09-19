import { createClient } from '@/lib/supabase/server'
import { RoleBanners } from './RoleBanners'
import { getDictionary } from '@/lib/i18n'

export async function RoleBannersWrapper() {
  const supabase = await createClient()
  const dict = await getDictionary()
  
  const { data } = await (supabase.from('community_links') as any)
    .select('id, platform, url, label')
    .eq('is_enabled', true)
    .order('display_order', { ascending: true })

  const links = data || []
  
  if (links.length === 0) return null

  return <RoleBanners links={links} dict={dict} />
}
