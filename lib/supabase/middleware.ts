import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const isProtected = request.nextUrl.pathname.startsWith('/admin') || 
                        (request.nextUrl.pathname.startsWith('/account') && 
                         !request.nextUrl.pathname.startsWith('/account/login') && 
                         !request.nextUrl.pathname.startsWith('/account/register') &&
                         !request.nextUrl.pathname.startsWith('/account/forgot-password') &&
                         !request.nextUrl.pathname.startsWith('/account/reset-password'))
    
    if (isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = '/account/login'
      url.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search)
      return NextResponse.redirect(url)
    }
  }

  // Also check admin separation
  if (user && request.nextUrl.pathname.startsWith('/admin')) {
    // If not admin, block access
    const { data: roleData } = await supabase.rpc('is_admin', { user_id: user.id })
    // In our DB, is_admin() takes a single uuid and returns a boolean.
    // Wait, the DB function signature might just take no args and use auth.uid().
    // Let's use the profile to check if they have admin role. But actually RLS handles data access.
    // Let's safely check if they are super admin or editor.
    const { data: profile } = await supabase.from('profiles').select('roles(name)').eq('id', user.id).single()
    const roleName = (profile?.roles as any)?.name
    if (roleName !== 'Super Admin' && roleName !== 'Editor') {
      const url = request.nextUrl.clone()
      url.pathname = '/account/profile'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
