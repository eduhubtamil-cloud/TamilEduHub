'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createResource(formData: FormData) {
  const supabase = await createClient()
  
  // Basic user check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Parse form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const standard_id = formData.get('standard_id') as string
  const subject_id = formData.get('subject_id') as string
  const medium_id = formData.get('medium_id') as string || null
  const resource_type_id = formData.get('resource_type_id') as string || null
  const year = formData.get('year') as string ? parseInt(formData.get('year') as string) : null
  const file = formData.get('file') as File

  if (!title || !standard_id || !subject_id) {
    throw new Error('Missing required fields')
  }

  let fileUrl = null
  let fileSize = null

  // 1. Upload PDF to Supabase Storage (if provided)
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      throw new Error('Failed to upload PDF file')
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(fileName)
    fileUrl = publicUrlData.publicUrl
    fileSize = file.size // Store raw bytes as integer
  }

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

  // 2. Insert into resources table
  const { error: insertError } = await (supabase.from('resources') as any)
    .insert({
      title,
      slug,
      description,
      standard_id,
      subject_id,
      medium_id,
      resource_type_id,
      year,
      file_url: fileUrl,
      file_size: fileSize,
      author_id: user.id,
      status: 'published',
      published_at: new Date().toISOString()
    })

  if (insertError) {
    console.error('Insert Error:', insertError)
    throw new Error('Failed to insert resource record')
  }

  // 3. Revalidate and redirect
  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  redirect('/admin/resources')
}
