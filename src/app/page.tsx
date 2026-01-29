import { TOTPGenerator } from '@/components/totp-generator'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <TOTPGenerator />
    </main>
  )
}
