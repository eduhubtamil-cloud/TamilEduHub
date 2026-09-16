'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, MessageCircle, Send } from 'lucide-react'

interface SocialShareButtonsProps {
  title: string
  description?: string
}

export function SocialShareButtons({ title, description }: SocialShareButtonsProps) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  if (!url) return null

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const text = encodeURIComponent(`${title}\n\n${description || ''}\n\n`)

  const links = {
    whatsapp: `https://wa.me/?text=${text}${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
      } catch (error) {
        console.log('Error sharing', error)
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
        <Share2 className="h-4 w-4" /> Share with friends
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="bg-[#25D366] text-white hover:bg-[#128C7E] hover:text-white border-0" asChild>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
          </a>
        </Button>
        <Button variant="outline" size="sm" className="bg-[#0088cc] text-white hover:bg-[#0077b5] hover:text-white border-0" asChild>
          <a href={links.telegram} target="_blank" rel="noopener noreferrer">
            <Send className="h-4 w-4 mr-2" /> Telegram
          </a>
        </Button>
        <Button variant="outline" size="sm" className="bg-[#1877F2] text-white hover:bg-[#165ed0] hover:text-white border-0" asChild>
          <a href={links.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </Button>
        
        {typeof window !== 'undefined' && 'share' in navigator && (
          <Button variant="outline" size="sm" onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        )}
      </div>
    </div>
  )
}
