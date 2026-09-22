'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, roleId: string | null) {
  const supabase = await createClient()

  // Verify caller is admin
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Call the secure RPC
  const { error } = await (supabase.rpc as any)('set_user_role', {
    target_user_id: userId,
    new_role_id: roleId || null
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
