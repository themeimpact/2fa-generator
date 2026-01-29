import { NextRequest, NextResponse } from 'next/server'
import { generateTOTP, getRemainingSeconds } from '@/lib/totp/totp'
import { validateSecret } from '@/lib/utils/validation'
import type { Algorithm, Digits, Period } from '@/types/totp'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const digits = (parseInt(searchParams.get('digits') || '6') || 6) as Digits
  const period = (parseInt(searchParams.get('period') || '30') || 30) as Period
  const algorithm = (searchParams.get('algorithm') || 'SHA1') as Algorithm

  if (!secret) {
    return NextResponse.json(
      { error: 'Missing required parameter: secret' },
      { status: 400 }
    )
  }

  const validation = validateSecret(secret)
  if (!validation.isValid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    )
  }

  try {
    const otp = await generateTOTP({
      secret: validation.normalizedSecret!,
      digits,
      period,
      algorithm,
    })

    const remainingSeconds = getRemainingSeconds(period)

    return NextResponse.json({
      otp,
      digits,
      period,
      algorithm,
      remainingSeconds,
      warning: '⚠️ Use at your own risk. This API is provided for convenience only.',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate OTP' },
      { status: 500 }
    )
  }
}
