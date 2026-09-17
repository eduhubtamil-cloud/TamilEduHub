import { createClient } from '@/lib/supabase/server'
import { CommunityCTA } from './CommunityCTA'
import { getDictionary } from '@/lib/i18n'

interface CommunityLinksWrapperProps {
  location: string
  compact?: boolean
  variant?: 'default' | 'compact' | 'icon'
}

export async function CommunityLinksWrapper({ location, compact = false, variant = 'default' }: CommunityLinksWrapperProps) {
  const supabase = await createClient()
  const dict = await getDictionary()
  
  const { data } = await (supabase.from('community_links') as any)
    .select('id, platform, url, label, description, qr_code_url')
    .eq('is_enabled', true)
    .order('display_order', { ascending: true })

  const links = data || []
  
  if (links.length === 0) return null

  return <CommunityCTA links={links} location={location} compact={compact} variant={variant} dict={dict} />
}
