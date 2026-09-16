import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | TamilEduHub',
    default: 'TamilEduHub - Educational Resources',
  },
  description: 'Download study materials, question papers, and educational resources.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased`}>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_ID} />
      </body>
    </html>
  )
}
