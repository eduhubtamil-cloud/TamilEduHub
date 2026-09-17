import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Default to profile if no specific next parameter is provided
  const next = requestUrl.searchParams.get('next') || '/account/profile'

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Create a response that redirects to the intended destination
      const redirectUrl = new URL(next, requestUrl.origin)
      
      // Ensure we don't redirect to external URLs for security
      if (redirectUrl.origin !== requestUrl.origin) {
        return NextResponse.redirect(new URL('/', requestUrl.origin))
      }
      
      return NextResponse.redirect(redirectUrl)
    }
    
    console.error('OAuth exchange error:', error)
  }

  // Return to login with error if there's no code or if the exchange failed
  return NextResponse.redirect(
    new URL('/account/login?error=Authentication%20failed', requestUrl.origin)
  )
}
