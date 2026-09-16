'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  id: string
  type: 'resources' | 'question_papers' | 'articles'
}

export function ViewTracker({ id, type }: ViewTrackerProps) {
  useEffect(() => {
    // Fire and forget
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type })
    }).catch(err => console.error('Failed to track view', err))
  }, [id, type])

  return null
}
