'use client'

import { useState } from 'react'
import { submitContactMessage } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)
    setSuccess(false)
    
    const result = await submitContactMessage(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(true)
    }
    
    setIsPending(false)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Have a question, feedback, or a takedown request? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Email</h3>
                    <p className="text-slate-600 text-sm mt-1">support@tamileduhub.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Address</h3>
                    <p className="text-slate-600 text-sm mt-1">Chennai, Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>We will review your message and reply via email.</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                  <p>Thank you for reaching out. We will get back to you shortly.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form action={onSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" required placeholder="John Doe" disabled={isPending} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" required placeholder="john@example.com" disabled={isPending} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" required placeholder="How can we help you?" disabled={isPending} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea 
                      id="message" 
                      name="message" 
                      required 
                      disabled={isPending}
                      placeholder="Type your message here..."
                      className="flex min-h-[150px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
