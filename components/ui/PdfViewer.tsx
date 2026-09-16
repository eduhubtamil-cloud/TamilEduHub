'use client'

import { useState } from 'react'
import { FileText, Loader2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfViewerProps {
  url: string
  title: string
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Browsers usually can render PDF in iframe.
  // Alternatively we could use Google Docs Viewer for broader mobile support:
  // https://docs.google.com/gview?url=${url}&embedded=true
  
  const embedUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 md:p-8">
        <div className="flex justify-between items-center mb-4 text-white">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white" onClick={() => setIsExpanded(false)}>
            Close Preview
          </Button>
        </div>
        <div className="flex-1 w-full bg-white rounded-lg overflow-hidden relative">
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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="h-4 w-4" /> Document Preview
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(true)} className="h-8 gap-2 text-slate-500">
          <Maximize2 className="h-4 w-4" /> Fullscreen
        </Button>
      </div>
      
      <div className="relative w-full rounded-lg border border-slate-200 overflow-hidden bg-slate-50" style={{ height: '500px' }}>
        <iframe 
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          title={`Preview of ${title}`}
        />
        {/* Loading placeholder underneath iframe */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 -z-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p className="text-sm">Loading PDF viewer...</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 text-center mt-1">Preview powered by Google Drive. If it doesn't load, please use the Download button.</p>
    </div>
  )
}
