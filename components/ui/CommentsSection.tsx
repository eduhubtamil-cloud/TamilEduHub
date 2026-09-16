'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { User, MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CommentsSectionProps {
  contentId: string
  contentType: 'resource' | 'question_paper' | 'article'
}

export function CommentsSection({ contentId, contentType }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserAndComments = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data } = await (supabase.from('comments') as any)
        .select(`
          id, comment_text, created_at,
          profiles (full_name, avatar_url)
        `)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      
      if (data) setComments(data)
      setIsLoading(false)
    }

    fetchUserAndComments()
  }, [contentId, contentType, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)
    const { data, error } = await (supabase.from('comments') as any)
      .insert({
        content_id: contentId,
        content_type: contentType,
        user_id: user.id,
        comment_text: newComment.trim()
      })
      .select(`
        id, comment_text, created_at,
        profiles (full_name, avatar_url)
      `)
      .single()

    if (!error && data) {
      setComments([data, ...comments])
      setNewComment('')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" /> 
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
        {user ? (
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Leave a comment..."
              className="mb-4 min-h-[100px] bg-white"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-600 mb-4">You must be logged in to leave a comment.</p>
            <Button asChild>
              <Link href="/account/login">Log In to Comment</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-4">
              <div className="shrink-0 h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                {comment.profiles?.avatar_url ? (
                  <img src={comment.profiles.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-semibold text-slate-900">
                    {comment.profiles?.full_name || 'Anonymous User'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">{comment.comment_text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 py-8">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  )
}
