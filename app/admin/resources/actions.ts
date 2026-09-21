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
  const education_segment_id = formData.get('education_segment_id') as string || null
  const standard_id = formData.get('standard_id') as string || null
  const subject_id = formData.get('subject_id') as string || null
  const medium_id = formData.get('medium_id') as string || null
  const resource_type_id = formData.get('resource_type_id') as string || null
  const exam_type_id = formData.get('exam_type_id') as string || null
  const year = formData.get('year') as string ? parseInt(formData.get('year') as string) : null
  const file = formData.get('file') as File

  if (!title || !education_segment_id || !subject_id) {
    throw new Error('Missing required fields')
  }

  // Get segment name to check if competitive
  const { data: segment } = await (supabase.from('education_segments') as any).select('name').eq('id', education_segment_id).single()
  const segmentName = segment?.name?.toLowerCase() || ''
  const isCompetitive = segmentName.includes('competitive')
  const isSchool = segmentName.includes('school')

  if (isCompetitive && !exam_type_id) {
    throw new Error('Exam Type is required for Competitive Exam resources')
  } else if (isSchool && !standard_id) {
    throw new Error('Standard is required for School resources')
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
      education_segment_id,
      standard_id,
      subject_id,
      medium_id,
      resource_type_id,
      exam_type_id,
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

export async function updateResource(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const education_segment_id = formData.get('education_segment_id') as string || null
  const standard_id = formData.get('standard_id') as string || null
  const subject_id = formData.get('subject_id') as string || null
  const medium_id = formData.get('medium_id') as string || null
  const resource_type_id = formData.get('resource_type_id') as string || null
  const exam_type_id = formData.get('exam_type_id') as string || null
  const year = formData.get('year') as string ? parseInt(formData.get('year') as string) : null
  const file = formData.get('file') as File | null

  if (!id || !title || !education_segment_id || !subject_id) {
    throw new Error('Missing required fields')
  }

  // Get segment name to check if competitive
  const { data: segment } = await (supabase.from('education_segments') as any).select('name').eq('id', education_segment_id).single()
  const segmentName = segment?.name?.toLowerCase() || ''
  const isCompetitive = segmentName.includes('competitive')
  const isSchool = segmentName.includes('school')

  if (isCompetitive && !exam_type_id) {
    throw new Error('Exam Type is required for Competitive Exam resources')
  } else if (isSchool && !standard_id) {
    throw new Error('Standard is required for School resources')
  }

  const updates: any = {
    title,
    description,
    education_segment_id,
    standard_id,
    subject_id,
    medium_id,
    resource_type_id,
    exam_type_id,
    year,
  }

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, file)

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(fileName)
      updates.file_url = publicUrlData.publicUrl
      updates.file_size = file.size
    }
  }

  const { error } = await (supabase.from('resources') as any).update(updates).eq('id', id)
  if (error) throw new Error('Failed to update resource')

  revalidatePath('/admin/resources')
  revalidatePath(`/admin/resources/${id}/edit`)
  redirect('/admin/resources')
}

export async function deleteResource(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if resource exists
  const { data: resource, error: fetchError } = await supabase.from('resources').select('id').eq('id', id).single()
  
  if (fetchError) throw new Error('Resource not found')

  // Soft delete DB record
  const { error: deleteError } = await (supabase.from('resources') as any).update({ status: 'deleted' }).eq('id', id)
  if (deleteError) throw new Error('Failed to delete resource record')

  revalidatePath('/admin/resources')
  revalidatePath('/resources')
}

export async function updateResourceStatus(id: string, status: 'draft' | 'published' | 'archived') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updates: any = { status }
  if (status === 'published') {
    updates.published_at = new Date().toISOString()
  }

  const { error } = await (supabase.from('resources') as any).update(updates).eq('id', id)
  if (error) throw new Error('Failed to update status')

  revalidatePath('/admin/resources')
  revalidatePath('/resources')
}

export async function bulkPublishResources(ids: string[]) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Fetch the resources
  const { data: resources, error } = await (supabase.from('resources') as any).select('*, education_segments(slug)').in('id', ids)
  if (error || !resources) throw new Error('Failed to fetch resources')

  const invalidIds: string[] = []
  
  // Validate each resource using strict criteria based on audience
  resources.forEach((r: any) => {
    if (!r.title || !r.slug || !r.file_url || !r.education_segment_id || !r.subject_id) {
      invalidIds.push(r.id)
      return
    }

    const segmentSlug = r.education_segments?.slug

    if (segmentSlug === 'school') {
      if (!r.standard_id) {
        invalidIds.push(r.id)
      }
    } else if (segmentSlug === 'competitive-exams') {
      if (!r.exam_type_id) {
        invalidIds.push(r.id)
      }
    }
  })

  if (invalidIds.length > 0) {
    return { success: false, invalidIds, message: `${invalidIds.length} resource(s) are missing required metadata.` }
  }

  // Publish
  const { error: updateError } = await (supabase.from('resources') as any).update({ 
    status: 'published',
    published_at: new Date().toISOString()
  }).in('id', ids)

  if (updateError) throw new Error('Failed to publish resources')

  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  
  return { success: true, message: 'Resources published successfully.' }
}

export async function bulkCreateDraftResource(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: resource, error } = await (supabase.from('resources') as any).insert({
    title: data.title,
    slug: data.slug,
    file_url: data.file_url,
    file_size: data.file_size,
    author_id: user.id,
    status: 'draft'
  }).select('id').single();

  if (error) throw new Error(error.message);
  
  await (supabase.from('audit_logs') as any).insert({
    user_id: user.id,
    action: 'bulk_create_draft',
    entity_type: 'resource',
    entity_id: resource.id,
    details: { title: data.title }
  }).catch(() => {});

  return resource.id;
}

export async function bulkUpdateResources(ids: string[], updates: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await (supabase.from('resources') as any).update(updates).in('id', ids);
  if (error) throw new Error(error.message);

  await (supabase.from('audit_logs') as any).insert({
    user_id: user.id,
    action: 'bulk_update',
    entity_type: 'resource',
    details: { ids, updates }
  }).catch(() => {});

  revalidatePath('/admin/resources');
  return { success: true };
}
