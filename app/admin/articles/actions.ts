'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createArticle(formData: FormData) {
  const supabase = await createClient()
  
  // Basic user check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Parse form data
  const title = formData.get('title') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const category_id = formData.get('category_id') as string || null
  const file = formData.get('image') as File | null

  if (!title || !content) {
    throw new Error('Missing required fields')
  }

  let featuredImageUrl = null

  // 1. Upload Featured Image to Supabase Storage
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `article-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('articles')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      throw new Error('Failed to upload Featured Image')
    }

    const { data: publicUrlData } = supabase.storage.from('articles').getPublicUrl(fileName)
    featuredImageUrl = publicUrlData.publicUrl
  }

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

  // 2. Insert into articles table
  const { error: insertError } = await (supabase.from('articles') as any)
    .insert({
      title,
      slug,
      excerpt,
      content,
      category_id,
      author_id: user.id,
      featured_image: featuredImageUrl,
      status: 'published',
      published_at: new Date().toISOString()
    })

  if (insertError) {
    console.error('Insert Error:', insertError)
    throw new Error('Failed to insert article record')
  }

  // 3. Revalidate and redirect
  revalidatePath('/admin/articles')
  revalidatePath('/articles')
  redirect('/admin/articles')
}
