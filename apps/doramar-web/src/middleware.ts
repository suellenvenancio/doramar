import { jwtDecode } from "jwt-decode"
import { type NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  { path: "/", whenAuthenticated: "next" },
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/create-account", whenAuthenticated: "redirect" },
  { path: "/forgot-password", whenAuthenticated: "next" },
] as const

const REDIRECT_WHEN_NOT_AUTH = "/login"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicRoute = publicRoutes.find((route) => route.path === path)
  const token = request.cookies.get("appToken")

  if (publicRoute && !token) {
    return NextResponse.next()
  }

  if (!publicRoute && !token) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTH
    return NextResponse.redirect(redirectUrl)
  }

  if (token) {
    try {
      const decoded = jwtDecode<{ exp: number }>(token.value)
      const isExpired = decoded.exp < Date.now() / 1000

      if (isExpired) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTH
        const response = NextResponse.redirect(redirectUrl)
        response.cookies.delete("appToken")
        return response
      }

      if (publicRoute?.whenAuthenticated === "redirect") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (e) {
      console.error(e)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTH

      const response = NextResponse.redirect(redirectUrl)
      response.cookies.delete("appToken")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
