'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { toggleBookmarkAction, checkBookmarkStatus } from '@/app/(public)/account/bookmarks/actions'
import { useRouter, usePathname } from 'next/navigation'

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
    checkBookmarkStatus(contentId, contentType).then((status) => {
      setIsBookmarked(status)
      setIsLoading(false)
    })
  }, [contentId, contentType])

  const router = useRouter()
  const pathname = usePathname()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const result = await toggleBookmarkAction(contentId, contentType)
      setIsBookmarked(result.bookmarked)
    } catch (error) {
      console.error(error)
      router.push(`/account/login?next=${encodeURIComponent(pathname)}`)
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
