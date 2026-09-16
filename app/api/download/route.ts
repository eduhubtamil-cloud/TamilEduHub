import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resourceId = searchParams.get('resource_id')
  const qpId = searchParams.get('qp_id')
  
  if (!resourceId && !qpId) {
    return new NextResponse('Missing ID', { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let fileUrl = ''

  // Log download and get file URL
  if (resourceId) {
    const { data } = await supabase.from('resources').select('file_url, downloads').eq('id', resourceId).single()
    const resource = data as any
    if (!resource || !resource.file_url) return new NextResponse('Not found', { status: 404 })
    fileUrl = resource.file_url

    // Increment counter & log
    await Promise.all([
      (supabase.from('resources') as any).update({ downloads: (resource.downloads || 0) + 1 }).eq('id', resourceId),
      (supabase.from('downloads') as any).insert({ resource_id: resourceId, user_id: user?.id || null })
    ])
  } else if (qpId) {
    const { data } = await supabase.from('question_papers').select('pdf_url').eq('id', qpId).single()
    const qp = data as any
    if (!qp || !qp.pdf_url) return new NextResponse('Not found', { status: 404 })
    fileUrl = qp.pdf_url

    // Log download
    await (supabase.from('downloads') as any).insert({ question_paper_id: qpId, user_id: user?.id || null })
  }

  // Redirect user to the actual file
  return NextResponse.redirect(fileUrl)
}
