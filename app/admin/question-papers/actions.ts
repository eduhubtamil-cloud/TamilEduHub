'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createQuestionPaper(formData: FormData) {
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
  const exam_type = formData.get('exam_type') as string || null
  const year = formData.get('year') as string ? parseInt(formData.get('year') as string) : null
  const file = formData.get('file') as File
  const answerKeyFile = formData.get('answer_key') as File | null

  if (!title || !standard_id || !subject_id) {
    throw new Error('Missing required fields')
  }

  let pdfUrl = null
  let answerKeyUrl = null

  // 1. Upload Question Paper PDF to Supabase Storage (reusing resources bucket)
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `qp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      throw new Error('Failed to upload Question Paper PDF')
    }

    const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(fileName)
    pdfUrl = publicUrlData.publicUrl
  }

  // 1b. Upload Answer Key PDF (optional)
  if (answerKeyFile && answerKeyFile.size > 0) {
    const fileExt = answerKeyFile.name.split('.').pop()
    const fileName = `ak-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, answerKeyFile)

    if (uploadError) {
      console.error('Upload Error (Answer Key):', uploadError)
      throw new Error('Failed to upload Answer Key PDF')
    }

    const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(fileName)
    answerKeyUrl = publicUrlData.publicUrl
  }

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

  // 2. Insert into question_papers table
  const { error: insertError } = await (supabase.from('question_papers') as any)
    .insert({
      title,
      slug,
      description,
      standard_id,
      subject_id,
      medium_id,
      exam_type,
      year,
      pdf_url: pdfUrl,
      answer_key_url: answerKeyUrl,
      status: 'published',
      published_at: new Date().toISOString()
    })

  if (insertError) {
    console.error('Insert Error:', insertError)
    throw new Error('Failed to insert question paper record')
  }

  // 3. Revalidate and redirect
  revalidatePath('/admin/question-papers')
  revalidatePath('/question-papers')
  redirect('/admin/question-papers')
}
