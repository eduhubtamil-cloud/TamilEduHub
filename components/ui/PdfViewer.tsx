'use client'

import { useState } from 'react'
import { FileText, Loader2, Maximize2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfViewerProps {
  url: string
  title: string
}

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

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const driveId = getGoogleDriveFileId(url)
  const embedUrl = driveId
    ? `https://drive.google.com/file/d/${driveId}/preview`
    : `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`

  const openUrl = driveId
    ? `https://drive.google.com/file/d/${driveId}/view?usp=sharing`
    : url

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 md:p-8 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4 text-white">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
              <a href={openUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1.5" /> Open in New Tab
              </a>
            </Button>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white" onClick={() => setIsExpanded(false)}>
              Close Preview
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full bg-white rounded-lg overflow-hidden relative shadow-2xl">
          <iframe 
            src={embedUrl} 
            className="absolute inset-0 w-full h-full border-0"
            title={`Preview of ${title}`}
            allow="autoplay"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center px-4 py-3 bg-slate-100/80 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <FileText className="h-4 w-4 text-blue-600" /> Document Preview
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 text-xs text-slate-600 hover:text-blue-600">
            <a href={openUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" /> Open Tab
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(true)} className="h-8 gap-1.5 text-xs text-slate-600 hover:text-blue-600">
            <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
          </Button>
        </div>
      </div>
      
      <div className="relative w-full flex-1 min-h-[550px] bg-slate-100">
        <iframe 
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          title={`Preview of ${title}`}
          allow="autoplay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 -z-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2 text-blue-600" />
          <p className="text-sm font-medium">Loading document preview...</p>
        </div>
      </div>
    </div>
  )
}
