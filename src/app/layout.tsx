import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'

const siteUrl = 'https://2fa.themeimpact.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '2FA Generator | Secure Client-Side TOTP Tool',
    template: '%s | 2FA Generator',
  },
  description:
    'Free, secure client-side TOTP generator. Generate 2FA codes without sending your secret to any server. RFC 6238 compliant, works with Google Authenticator, Authy & more.',
  keywords: [
    '2FA',
    'TOTP',
    'authenticator',
    'OTP',
    'two-factor authentication',
    'Google Authenticator',
    'Authy',
    'RFC 6238',
    'client-side',
    'secure',
    'online generator',
  ],
  authors: [{ name: 'ThemeImpact', url: 'https://themeimpact.com' }],
  creator: 'ThemeImpact',
  publisher: 'ThemeImpact',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: '2FA Generator',
    title: '2FA Generator | Secure Client-Side TOTP Tool',
    description:
      'Free, secure client-side TOTP generator. Your secret never leaves your browser. RFC 6238 compliant.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '2FA Generator - Secure TOTP Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2FA Generator | Secure Client-Side TOTP Tool',
    description:
      'Free, secure client-side TOTP generator. Your secret never leaves your browser.',
    images: ['/og-image.png'],
    creator: '@themeimpact',
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="scanlines grid-bg min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  )
}
