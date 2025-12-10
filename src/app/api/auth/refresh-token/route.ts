import { clearRefreshTokenCookie, setRefreshTokenCookie } from '@/lib/auth-cookies'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const refreshToken = body?.refreshToken as string | undefined

  if (!refreshToken) {
    return new Response(JSON.stringify({ message: 'Missing refresh token' }), { status: 400 })
  }

  return setRefreshTokenCookie(refreshToken)
}

export async function DELETE() {
  return clearRefreshTokenCookie()
}
