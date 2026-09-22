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

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s\u0B80-\u0BFF-]/g, '').trim() || 'Document'
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
  let title = 'Document'

  try {
    if (resourceId) {
      const { data: resource, error } = await (supabase.from('resources') as any)
        .select('title, file_url')
        .eq('id', resourceId)
        .single()

      if (error || !resource || !resource.file_url) {
        return new NextResponse('Resource not found or has no download link', { status: 404 })
      }
      fileUrl = resource.file_url
      title = resource.title || title

      // Non-blocking download count update
      try {
        await (supabase.rpc as any)('increment_download_count', { table_name: 'resources', record_id: resourceId })
      } catch {
        // Continue even if RPC fails
      }
    } else if (qpId) {
      const { data: qp, error } = await (supabase.from('question_papers') as any)
        .select('title, pdf_url')
        .eq('id', qpId)
        .single()

      if (error || !qp || !qp.pdf_url) {
        return new NextResponse('Question paper not found or has no PDF link', { status: 404 })
      }
      fileUrl = qp.pdf_url
      title = qp.title || title

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

  const driveId = getGoogleDriveFileId(fileUrl)
  const filename = `${sanitizeFilename(title)}.pdf`

  // If it's a Google Drive file, proxy the direct binary download stream so the user's browser
  // receives the real PDF file directly without hitting Google's third-party cookie / 403 errors!
  if (driveId) {
    try {
      const streamUrl = `https://drive.usercontent.google.com/download?id=${driveId}&export=download`
      const gRes = await fetch(streamUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      })

      if (gRes.ok && gRes.body) {
        const headers = new Headers()
        headers.set('Content-Type', 'application/pdf')
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`)
        const contentLength = gRes.headers.get('content-length')
        if (contentLength) {
          headers.set('Content-Length', contentLength)
        }

        return new NextResponse(gRes.body as any, {
          status: 200,
          headers
        })
      }
    } catch (streamErr) {
      console.warn('Proxy download stream error, falling back to direct share URL:', streamErr)
    }

    // Fallback if proxy stream failed: Redirect to official Google Drive viewer
    return NextResponse.redirect(`https://drive.google.com/file/d/${driveId}/view?usp=sharing`)
  }

  // Non-Google Drive file
  return NextResponse.redirect(fileUrl)
}
