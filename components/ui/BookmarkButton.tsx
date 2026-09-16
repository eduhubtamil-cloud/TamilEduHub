'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { toggleBookmarkAction, checkBookmarkStatus } from '@/app/(public)/account/bookmarks/actions'

export function BookmarkButton({ 
  contentId, 
  contentType, 
}: { 
  contentId: string
  contentType: 'article' | 'resource' | 'question_paper'
}) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkBookmarkStatus(contentId).then((status) => {
      setIsBookmarked(status)
      setIsLoading(false)
    })
  }, [contentId])

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const result = await toggleBookmarkAction(contentId, contentType)
      setIsBookmarked(result.bookmarked)
    } catch (error) {
      console.error(error)
      alert("Please log in to bookmark this.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleToggle}
      disabled={isLoading}
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-blue-600 text-blue-600" : "text-slate-500"}`} />
    </Button>
  )
}
