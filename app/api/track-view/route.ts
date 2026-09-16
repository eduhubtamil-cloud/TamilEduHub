import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { id, type } = await request.json()
    
    if (!id || !type) {
      return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })
    }

    const validTypes = ['resources', 'question_papers', 'articles']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const supabase = await createClient()

    // Call the RPC function we created in SQL
    const { error } = await (supabase.rpc as any)('increment_view_count', {
      table_name: type,
      record_id: id
    })

    if (error) {
      console.error('RPC Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
