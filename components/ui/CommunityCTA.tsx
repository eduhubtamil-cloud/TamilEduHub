'use client'

import { MessageCircle, Send, Play } from 'lucide-react'

interface CommunityLink {
  id: string
  platform: string
  url: string
  label: string
  description?: string
}

interface CommunityCTAProps {
  links: CommunityLink[]
  location: string
  compact?: boolean
}

export function CommunityCTA({ links, location, compact = false }: CommunityCTAProps) {
  const handleTrackClick = (linkId: string, platform: string, url: string) => {
    // Fire and forget tracking
    fetch('/api/track-community-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link_id: linkId, platform, page_location: location })
    }).catch(err => console.error('Failed to track click', err))
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getIcon = (platform: string, className: string) => {
    if (platform.includes('whatsapp')) return <MessageCircle className={className} />
    if (platform.includes('telegram')) return <Send className={className} />
    if (platform.includes('google_play')) return <Play className={className} />
    return null
  }

  const getColors = (platform: string) => {
    if (platform.includes('whatsapp')) return 'bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent'
    if (platform.includes('telegram')) return 'bg-[#0088cc] hover:bg-[#0077b5] text-white border-transparent'
    if (platform.includes('google_play')) return 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
    return 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleTrackClick(link.id, link.platform, link.url)}
            className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors border ${getColors(link.platform)}`}
          >
            {getIcon(link.platform, "h-4 w-4")}
            {link.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Join Our Community</h2>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
        Stay updated with new resources, study materials, and educational announcements. Join thousands of students today.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleTrackClick(link.id, link.platform, link.url)}
            className={`flex flex-col items-center justify-center py-4 px-8 rounded-xl transition-transform hover:-translate-y-1 shadow-md ${getColors(link.platform)}`}
          >
            <div className="flex items-center gap-3 font-bold text-lg mb-1">
              {getIcon(link.platform, "h-6 w-6")}
              {link.label}
            </div>
            {link.description && (
              <span className="text-sm opacity-90 max-w-[200px] text-center">
                {link.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
