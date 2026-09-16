import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { link_id, platform, page_location, utm_source, utm_medium, utm_campaign, device_category } = await request.json()
    
    if (!link_id || !platform || !page_location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await (supabase.from('community_clicks_analytics') as any).insert({
      link_id,
      platform,
      page_location,
      utm_source,
      utm_medium,
      utm_campaign,
      device_category
    })

    if (error) {
      console.error('Analytics Insert Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
