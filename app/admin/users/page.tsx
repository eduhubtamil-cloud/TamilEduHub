import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Users, ShieldCheck, UserCheck, UserX } from 'lucide-react'
import { UserRoleSelect } from '@/components/admin/UserRoleSelect'

export const metadata = {
  title: 'User Management - TamilEduHub CMS',
}

interface AdminUser {
  id: string
  email: string | null
  full_name: string | null
  role_id: string | null
  role_name: string | null
  created_at: string
}

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ q?: string; role?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q?.toLowerCase() || ''
  const roleFilter = searchParams.role || ''

  const supabase = await createClient()

  // 1. Fetch all roles
  const { data: rolesData } = await (supabase
    .from('roles') as any)
    .select('id, name')
    .order('name')
  const roles: { id: string; name: string }[] = rolesData || []

  // 2. Fetch all users via secure RPC
  let users: AdminUser[] = []
  const { data: rpcUsers, error: rpcError } = await (supabase.rpc as any)('get_admin_users')

  if (!rpcError && rpcUsers) {
    users = rpcUsers as AdminUser[]
  } else {
    // Fallback if RPC fails: query profiles
    const { data: profileUsers } = await supabase
      .from('profiles')
      .select('id, full_name, role_id, created_at, roles(id, name)')
      .order('created_at', { ascending: false })

    users = (profileUsers || []).map((p: any) => ({
      id: p.id,
      email: null,
      full_name: p.full_name,
      role_id: p.role_id,
      role_name: p.roles?.name || null,
      created_at: p.created_at,
    }))
  }

  // 3. Filter users
  const filteredUsers = users.filter((u) => {
    const matchQuery =
      !q ||
      u.email?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q)
    const matchRole = !roleFilter || u.role_name === roleFilter
    return matchQuery && matchRole
  })

  // 4. Stats
  const totalUsers = users.length
  const superAdmins = users.filter((u) => u.role_name === 'Super Admin').length
  const editors = users.filter((u) => u.role_name === 'Editor').length
  const regularUsers = users.filter((u) => !u.role_name || u.role_name === 'User').length

  const getRoleBadge = (roleName: string | null) => {
    switch (roleName) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Editor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Author':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">
            View registered users, monitor accounts, and manage administrative privileges.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              Super Admins
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{superAdmins}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Editors
            </CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{editors}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Regular Users
            </CardTitle>
            <UserX className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">{regularUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white">
        <CardContent className="pt-6">
          <form method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search by name or email..."
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>
            <select
              name="role"
              defaultValue={roleFilter}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
            <Button type="submit" variant="default" className="bg-slate-900 text-white hover:bg-slate-800">
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initials = (user.full_name || user.email || 'U')
                    .substring(0, 2)
                    .toUpperCase()

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {user.full_name || 'Anonymous User'}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-700">
                        {user.email || 'No email available'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRoleBadge(
                            user.role_name
                          )}`}
                        >
                          {user.role_name || 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(user.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end">
                          <UserRoleSelect
                            userId={user.id}
                            currentRoleId={user.role_id}
                            currentRoleName={user.role_name}
                            roles={roles}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
