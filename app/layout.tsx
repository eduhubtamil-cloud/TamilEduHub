import type { Metadata } from 'next'
import { Inter, Noto_Sans_Tamil } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansTamil = Noto_Sans_Tamil({ subsets: ['tamil'], variable: '--font-noto-tamil', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: {
    template: '%s | TamilEduHub',
    default: 'TamilEduHub - Educational Resources',
  },
  description: 'Download study materials, question papers, and educational resources.',
}

import { getLanguage } from '@/lib/i18n'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lang = await getLanguage()
  
  return (
    <html lang={lang}>
      <body className={`${inter.variable} ${notoSansTamil.variable} font-sans min-h-screen bg-white text-slate-900 antialiased`}>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_ID} />
      </body>
    </html>
  )
}
