// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('speech-ease-auth')

  const isAuthenticated = !!token

  const loginUrl = new URL('/login', request.url)
  const isLoginPage = request.nextUrl.pathname === '/login'

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|signup|_next|favicon.ico|api).*)'],
}
