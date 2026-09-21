'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBookmarkAction(contentId: string, contentType: 'article' | 'resource' | 'question_paper') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to bookmark')
  }

  // Check if bookmark exists
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('content_id', contentId)
    .eq('content_type', contentType)
    .single()

  if (existing) {
    // Remove bookmark
    await supabase.from('bookmarks').delete().eq('id', (existing as any).id)
    revalidatePath('/account/bookmarks')
    return { bookmarked: false }
  } else {
    // Add bookmark
    await (supabase.from('bookmarks') as any).insert({
      user_id: user.id,
      content_id: contentId,
      content_type: contentType
    })
    revalidatePath('/account/bookmarks')
    return { bookmarked: true }
  }
}

export async function checkBookmarkStatus(contentId: string, contentType: 'article' | 'resource' | 'question_paper') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('content_id', contentId)
    .eq('content_type', contentType)
    .maybeSingle()

  return !!existing
}
