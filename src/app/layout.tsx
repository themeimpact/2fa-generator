import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: '2FA Generator | TOTP Client-Side Tool',
  description: 'Secure client-side TOTP generator. Your secret never leaves your browser.',
  keywords: ['2FA', 'TOTP', 'authenticator', 'OTP', 'two-factor'],
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
