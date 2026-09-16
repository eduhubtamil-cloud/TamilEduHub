'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const fullName = formData.get('full_name') as string
  const avatarFile = formData.get('avatar') as File | null

  let avatarUrl = undefined

  // Handle avatar upload
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `user-${user.id}-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile)

    if (uploadError) {
      console.error('Avatar upload error:', uploadError)
      throw new Error('Failed to upload avatar')
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
    avatarUrl = publicUrlData.publicUrl
  }

  // Update profile record
  const updateData: any = {}
  if (fullName) updateData.full_name = fullName
  if (avatarUrl) updateData.avatar_url = avatarUrl

  if (Object.keys(updateData).length > 0) {
    const { error } = await (supabase
      .from('profiles') as any)
      .update(updateData)
      .eq('id', user.id)

    if (error) {
      console.error('Profile update error:', error)
      throw new Error('Failed to update profile')
    }
  }

  revalidatePath('/account/profile')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const newPassword = formData.get('new_password') as string
  
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error('Password update error:', error)
    throw new Error(error.message)
  }

  return { success: true }
}
