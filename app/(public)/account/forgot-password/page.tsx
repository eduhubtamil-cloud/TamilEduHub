import Link from 'next/link'
import { requestPasswordReset } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Forgot Password - TamilEduHub',
  description: 'Reset your password',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, success?: string }>
}) {
  const searchParamsData = await searchParams;
  const error = searchParamsData.error;
  const success = searchParamsData.success === 'true';

  return (
    <div className="container mx-auto flex h-[calc(100vh-16rem)] w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-sm border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
              Check your email for a password reset link.
            </div>
          )}
          
          <form action={requestPasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm" type="submit">Send Reset Link</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center text-sm text-slate-500">
            Remember your password?{' '}
            <Link href="/account/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
