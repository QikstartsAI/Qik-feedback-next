import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './components/feedback/Footer';

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/qik.svg" />
      <body className={inter.className}>
        {children}
        <Footer/>
      </body>
    </html>
  )
}
