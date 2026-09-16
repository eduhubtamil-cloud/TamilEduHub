import { createClient } from '@/lib/supabase/server'
import { CommunityCTA } from './CommunityCTA'

interface CommunityLinksWrapperProps {
  location: string
  compact?: boolean
}

export async function CommunityLinksWrapper({ location, compact = false }: CommunityLinksWrapperProps) {
  const supabase = await createClient()
  
  const { data } = await (supabase.from('community_links') as any)
    .select('id, platform, url, label, description')
    .eq('is_enabled', true)
    .order('display_order', { ascending: true })

  const links = data || []
  
  if (links.length === 0) return null

  return <CommunityCTA links={links} location={location} compact={compact} />
}
