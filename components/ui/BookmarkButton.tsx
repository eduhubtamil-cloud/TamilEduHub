'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'

export function BookmarkButton({ 
  contentId, 
  contentType, 
  initialIsBookmarked = false 
}: { 
  contentId: string
  contentType: 'article' | 'resource' | 'question_paper'
  initialIsBookmarked?: boolean
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  const toggleBookmark = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call our API route
      // const res = await fetch('/api/bookmarks', { method: isBookmarked ? 'DELETE' : 'POST', body: JSON.stringify({ contentId, contentType }) })
      // if (res.ok) setIsBookmarked(!isBookmarked)
      
      // Simulate network request for MVP
      await new Promise(r => setTimeout(r, 500))
      setIsBookmarked(!isBookmarked)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleBookmark}
      disabled={isLoading}
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-blue-600 text-blue-600" : "text-slate-500"}`} />
    </Button>
  )
}
