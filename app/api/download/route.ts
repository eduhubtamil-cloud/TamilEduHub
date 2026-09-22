import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getGoogleDriveFileId(url: string): string | null {
  if (!url) return null
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) return fileMatch[1]
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch) return idMatch[1]
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (dMatch) return dMatch[1]
  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resourceId = searchParams.get('resource_id')
  const qpId = searchParams.get('qp_id')
  
  if (!resourceId && !qpId) {
    return new NextResponse('Missing ID', { status: 400 })
  }

  const supabase = await createClient()

  let fileUrl = ''

  try {
    if (resourceId) {
      const { data: resource, error } = await (supabase.from('resources') as any)
        .select('file_url')
        .eq('id', resourceId)
        .single()

      if (error || !resource || !resource.file_url) {
        return new NextResponse('Resource not found or has no download link', { status: 404 })
      }
      fileUrl = resource.file_url

      // Non-blocking download count update
      try {
        await (supabase.rpc as any)('increment_download_count', { table_name: 'resources', record_id: resourceId })
      } catch {
        // Continue even if RPC fails
      }
    } else if (qpId) {
      const { data: qp, error } = await (supabase.from('question_papers') as any)
        .select('pdf_url')
        .eq('id', qpId)
        .single()

      if (error || !qp || !qp.pdf_url) {
        return new NextResponse('Question paper not found or has no PDF link', { status: 404 })
      }
      fileUrl = qp.pdf_url

      // Non-blocking download count update
      try {
        await (supabase.rpc as any)('increment_download_count', { table_name: 'question_papers', record_id: qpId })
      } catch {
        // Continue even if RPC fails
      }
    }
  } catch (err: any) {
    console.error('Download route error:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }

  // Convert Google Drive links to direct download links
  const driveId = getGoogleDriveFileId(fileUrl)
  const downloadUrl = driveId
    ? `https://drive.google.com/uc?export=download&id=${driveId}`
    : fileUrl

  return NextResponse.redirect(downloadUrl)
}
