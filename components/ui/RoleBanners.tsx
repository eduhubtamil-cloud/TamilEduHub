'use client'

import { MessageCircle, Send, BookOpen, Presentation } from 'lucide-react'

interface CommunityLink {
  id: string
  platform: string
  url: string
}

interface RoleBannersProps {
  links: CommunityLink[]
  dict: Record<string, string>
}

export function RoleBanners({ links, dict }: RoleBannersProps) {
  const whatsappLink = links.find(l => l.platform.includes('whatsapp'))
  const telegramLink = links.find(l => l.platform.includes('telegram'))

  const handleTrackClick = (linkId: string, platform: string, url: string, role: string) => {
    // Fire and forget tracking
    fetch('/api/track-community-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        link_id: linkId, 
        platform, 
        page_location: `homepage_role_${role}`
      })
    }).catch(err => console.error('Failed to track click', err))
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full mt-10">
      
      {/* Student Banner */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl p-8 border border-blue-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-sm">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{dict.studentsBannerTitle || 'For Students'}</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {dict.studentsBannerDesc || 'Join our student community for daily study materials, exam tips, and question papers.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {whatsappLink && (
            <button 
              onClick={() => handleTrackClick(whatsappLink.id, whatsappLink.platform, whatsappLink.url, 'student')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </button>
          )}
          {telegramLink && (
            <button 
              onClick={() => handleTrackClick(telegramLink.id, telegramLink.platform, telegramLink.url, 'student')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              <Send className="h-5 w-5" />
              Telegram
            </button>
          )}
        </div>
      </div>

      {/* Teacher Banner */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 border border-orange-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="bg-orange-500 text-white w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-sm">
            <Presentation className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{dict.teachersBannerTitle || 'For Teachers'}</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {dict.teachersBannerDesc || 'Join our exclusive WhatsApp and Telegram groups for teachers to share materials and collaborate.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {whatsappLink && (
            <button 
              onClick={() => handleTrackClick(whatsappLink.id, whatsappLink.platform, whatsappLink.url, 'teacher')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </button>
          )}
          {telegramLink && (
            <button 
              onClick={() => handleTrackClick(telegramLink.id, telegramLink.platform, telegramLink.url, 'teacher')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              <Send className="h-5 w-5" />
              Telegram
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
