import { createClient } from '@/lib/supabase/server'

export async function AdSlot({ location, className = '' }: { location: string, className?: string }) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('advertisements')
    .select('ad_code')
    .eq('location', location)
    .eq('is_active', true)
    .single()

  const ad = data as any

  if (!ad || !ad.ad_code) {
    return null
  }

  return (
    <div className={`w-full overflow-hidden flex justify-center ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: ad.ad_code }} />
    </div>
  )
}
