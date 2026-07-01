import { NextResponse, type NextRequest } from "next/server"

const TOKEN_COOKIE = "toprankr-token"

const PROTECTED_PATHS = [
  "/dashboard",
  "/search",
  "/candidate",
  "/compare",
  "/analytics",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get(TOKEN_COOKIE)?.value

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/search/:path*",
    "/candidate/:path*",
    "/compare/:path*",
    "/analytics/:path*",
  ],
}
