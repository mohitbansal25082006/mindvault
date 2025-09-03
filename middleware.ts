import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Public routes
  const publicRoutes = ["/", "/api/auth"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Protected routes
  const protectedRoutes = ["/dashboard", "/documents", "/chat", "/search", "/settings"]
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // If trying to access protected route without auth
  if (isProtectedRoute && !req.auth) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  
  // If authenticated and trying to access auth pages, redirect to dashboard
  if (req.auth && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}