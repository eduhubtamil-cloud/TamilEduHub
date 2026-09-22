'use client'

import { useState, useTransition } from 'react'
import { updateUserRole } from '@/app/admin/users/actions'

interface Role {
  id: string
  name: string
}

interface UserRoleSelectProps {
  userId: string
  currentRoleId: string | null
  currentRoleName: string | null
  roles: Role[]
}

export function UserRoleSelect({ userId, currentRoleId, currentRoleName, roles }: UserRoleSelectProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedRole, setSelectedRole] = useState(currentRoleId || '')
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoleId = e.target.value || null
    setSelectedRole(e.target.value)

    startTransition(async () => {
      const res = await updateUserRole(userId, newRoleId)
      if (res.success) {
        setMessage('Updated!')
        setTimeout(() => setMessage(null), 2500)
      } else {
        setMessage(`Error: ${res.error}`)
        setTimeout(() => setMessage(null), 4000)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedRole}
        onChange={handleChange}
        disabled={isPending}
        className="text-xs rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
      >
        <option value="">No Role (User)</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
      {isPending && <span className="text-xs text-slate-400 animate-pulse">Saving...</span>}
      {message && (
        <span className={`text-xs font-semibold ${message.startsWith('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
          {message}
        </span>
      )}
    </div>
  )
}
