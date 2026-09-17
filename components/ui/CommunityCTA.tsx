'use client'

import { MessageCircle, Send, Play, Compass, BookOpen } from 'lucide-react'

interface CommunityLink {
  id: string
  platform: string
  url: string
  label: string
  description?: string
  qr_code_url?: string
}

interface CommunityCTAProps {
  links: CommunityLink[]
  location: string
  compact?: boolean
  variant?: 'default' | 'compact' | 'icon'
  dict: Record<string, string>
}

export function CommunityCTA({ links, location, compact = false, variant = 'default', dict }: CommunityCTAProps) {
  const handleTrackClick = (linkId: string, platform: string, url: string) => {
    let utmSource, utmMedium, utmCampaign, deviceCategory;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      utmSource = urlParams.get('utm_source') || null;
      utmMedium = urlParams.get('utm_medium') || null;
      utmCampaign = urlParams.get('utm_campaign') || null;
      
      const ua = navigator.userAgent;
      if (/mobile/i.test(ua)) deviceCategory = 'mobile';
      else if (/tablet/i.test(ua)) deviceCategory = 'tablet';
      else deviceCategory = 'desktop';
    } catch (e) {}

    // Fire and forget tracking
    fetch('/api/track-community-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        link_id: linkId, 
        platform, 
        page_location: location,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        device_category: deviceCategory
      })
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
    return 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
  }

  const effectiveVariant = variant === 'default' && compact ? 'compact' : variant

  if (effectiveVariant === 'icon') {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        {links.map((link) => {
          const isWhatsApp = link.platform.includes('whatsapp')
          const isTelegram = link.platform.includes('telegram')
          const isPlay = link.platform.includes('google_play')
          
          let iconColor = 'text-slate-600'
          if (isWhatsApp) iconColor = 'text-[#25D366] group-hover:text-[#128C7E]'
          if (isTelegram) iconColor = 'text-[#0088cc] group-hover:text-[#0077b5]'
          if (isPlay) iconColor = 'text-slate-700 group-hover:text-black'

          const label = isWhatsApp && dict.joinWhatsApp ? dict.joinWhatsApp :
                        isTelegram && dict.joinTelegram ? dict.joinTelegram :
                        isPlay && dict.googlePlay ? dict.googlePlay : link.label;

          return (
            <button
              key={link.id}
              onClick={() => handleTrackClick(link.id, link.platform, link.url)}
              className="group flex items-center justify-center h-[38px] w-[38px] rounded-full transition-colors border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title={label}
              aria-label={label}
            >
              {getIcon(link.platform, `h-[18px] w-[18px] transition-colors ${iconColor}`)}
            </button>
          )
        })}
      </div>
    )
  }

  if (effectiveVariant === 'compact') {
    return (
      <div className="flex flex-col gap-3">
        {links.map((link) => {
          const label = link.platform.includes('whatsapp') ? dict.joinWhatsApp :
                        link.platform.includes('telegram') ? dict.joinTelegram :
                        link.platform.includes('google_play') ? dict.googlePlay : link.label;
          return (
            <button
              key={link.id}
              onClick={() => handleTrackClick(link.id, link.platform, link.url)}
              className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors border ${getColors(link.platform)}`}
            >
              {getIcon(link.platform, "h-4 w-4")}
              {label || link.label}
            </button>
          )
        })}
      </div>
    )
  }

  const getLabel = (platform: string, defaultLabel: string) => {
    if (platform.includes('whatsapp') && dict.joinWhatsApp) return dict.joinWhatsApp
    if (platform.includes('telegram') && dict.joinTelegram) return dict.joinTelegram
    if (platform.includes('google_play') && dict.googlePlay) return dict.googlePlay
    return defaultLabel
  }

  const getDescription = (platform: string, defaultDesc: string = '') => {
    if (platform.includes('whatsapp') && dict.whatsappDesc) return dict.whatsappDesc
    if (platform.includes('telegram') && dict.telegramDesc) return dict.telegramDesc
    if (platform.includes('google_play') && dict.googlePlayDesc) return dict.googlePlayDesc
    return defaultDesc
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-900 to-indigo-900 rounded-[2rem] overflow-hidden shadow-2xl">
      {/* Background decorations - strictly behind content and reduced opacity */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <Compass className="absolute -top-10 -left-10 w-64 h-64 text-white" />
        <BookOpen className="absolute -bottom-10 -right-10 w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 w-full p-4 sm:p-8 md:p-12 lg:p-16">
        {/* Content Container (White Card) */}
        <div className="bg-white rounded-2xl w-full max-w-[1100px] mx-auto px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 shadow-xl flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 text-center">
            {dict.joinOurCommunity}
          </h2>
          <p className="text-base md:text-lg text-slate-600 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
            {dict.joinOurCommunityDesc}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTrackClick(link.id, link.platform, link.url)}
                className={`flex flex-col items-center justify-start py-6 px-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full h-full text-center group ${getColors(link.platform)}`}
              >
                <div className="flex-shrink-0 mb-4 bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {getIcon(link.platform, "h-8 w-8 shrink-0")}
                </div>
                <div className="font-bold text-lg md:text-xl mb-2 leading-tight">
                  {getLabel(link.platform, link.label)}
                </div>
                {(link.description || getDescription(link.platform)) && (
                  <div className="text-sm opacity-90 leading-relaxed px-2">
                    {getDescription(link.platform, link.description)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
