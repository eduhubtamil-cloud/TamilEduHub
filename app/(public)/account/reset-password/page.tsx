import { resetPassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Reset Password - TamilEduHub',
  description: 'Set a new password',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParamsData = await searchParams;
  const error = searchParamsData.error;

  return (
    <div className="container mx-auto flex h-[calc(100vh-16rem)] w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-sm border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <form action={resetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm" type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
