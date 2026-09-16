'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function createStandard(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0

  if (!name) throw new Error('Name is required')

  const { error } = await (supabase.from('standards') as any).insert({
    name,
    slug: generateSlug(name),
    display_order
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to create standard')
  }

  revalidatePath('/admin/settings/standards')
  revalidatePath('/school')
}

export async function createSubject(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0

  if (!name) throw new Error('Name is required')

  const { error } = await (supabase.from('subjects') as any).insert({
    name,
    slug: generateSlug(name),
    display_order
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to create subject')
  }

  revalidatePath('/admin/settings/subjects')
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name) throw new Error('Name is required')

  const { error } = await (supabase.from('categories') as any).insert({
    name,
    slug: generateSlug(name),
    description
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to create category')
  }

  revalidatePath('/admin/settings/categories')
  revalidatePath('/articles')
}

export async function deleteRecord(table: string, id: string, redirectPath: string) {
  const supabase = await createClient()
  
  // Note: RLS will ensure only admins can delete
  const { error } = await supabase.from(table).delete().eq('id', id)
  
  if (error) {
    console.error(error)
    throw new Error(`Failed to delete from ${table}`)
  }

  revalidatePath(redirectPath)
}
