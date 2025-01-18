import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import dynamic from 'next/dynamic'
import { APIProvider } from '@vis.gl/react-google-maps'

const inter = Inter({ subsets: ['latin'] })

const DynamicFooter = dynamic(() => import('./components/feedback/Footer'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Qik feedback',
  description: 'Qik feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <link rel='icon' type='image/svg+xml' href='/qik.svg' />
      <body className={inter.className}>
        {children}
        <DynamicFooter />
      </body>
      <GoogleAnalytics gaId='G-CP0EYKVVVR' />
    </html>
  )
}




