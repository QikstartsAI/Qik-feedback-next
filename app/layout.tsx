import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './components/feedback/Footer';
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script';

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
      <Script id="google-tag-manager" strategy="afterInteractive">
        {
          `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PH5HXVSK');
          `
        }
      </Script>
      <link rel="icon" type="image/svg+xml" href="/qik.svg" />
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-CP0EYKVVVR" />
      <noscript
        dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PH5HXVSK"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
    />
    </html>
  )
}
