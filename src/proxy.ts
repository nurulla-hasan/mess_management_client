import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

/**
 * Next.js Proxy (formerly Middleware)
 * Handles Authentication, Role-based Redirects, and API Proxying.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl;

  // 1. API PROXY (Backend For Frontend)
  // Rewriting /api requests to the actual backend server
  if (pathname.startsWith('/api')) {
    const backendBase = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api/v1';
    
    // Construct the new URL by stripping '/api' and prepending the backend base
    const targetPath = pathname.replace(/^\/api/, '');
    const backendUrl = new URL(`${backendBase}${targetPath}${search}`);

    return NextResponse.rewrite(backendUrl);
  }

  // 2. AUTHENTICATION & REDIRECTS
  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // Define protected & auth-only routes
  const protectedPaths = ['/member', '/dashboard', '/bookings', '/clients', '/reports', '/calculator', '/maps', '/settings'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/verify-email';

  let response = NextResponse.next();

  // --- TOKEN REFRESH LOGIC ---
  if (accessToken) {
    try {
      const decoded: { exp: number; role?: string } = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token is expired or about to expire in 30 seconds
      if (decoded.exp < currentTime + 30) {
        console.log("Token expired or expiring soon, attempting refresh...");
        if (refreshToken) {
          const backendBase = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api/v1';
          const refreshRes = await fetch(`${backendBase}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newAccessToken = data?.data?.accessToken;
            
            if (newAccessToken) {
              accessToken = newAccessToken;
              // Set the new access token in cookies for the response
              response.cookies.set('accessToken', newAccessToken, {
                httpOnly: false, // Accessible by client if needed
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              });
              console.log("Token refreshed successfully");
            }
          } else {
            console.log("Refresh token failed, redirecting to login");
            // Refresh token failed, clear cookies and redirect to login
            response = NextResponse.redirect(new URL('/auth/login', origin));
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            return response;
          }
        } else {
          // No refresh token but access token expired
          console.log("Access token expired and no refresh token");
          accessToken = undefined;
        }
      }
    } catch (error) {
      console.error("Token decode failed:", error);
      accessToken = undefined;
    }
  }

  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !accessToken) {
    console.log(`Redirecting to login from protected route: ${pathname}`);
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based redirection for authenticated users
  if (accessToken) {
    try {
      const decoded: { role?: string } = jwtDecode(accessToken);
      
      // If user is on an auth page, redirect based on role
      if (isAuthPage) {
        console.log(`Authenticated user on auth page, redirecting based on role: ${decoded.role}`);
        if (decoded.role === 'member') {
          return NextResponse.redirect(new URL('/member', origin));
        } else if (decoded.role === 'admin') {
          return NextResponse.redirect(new URL('/', origin));
        } else {
          return NextResponse.redirect(new URL('/dashboard', origin));
        }
      }

      // Restrict members from accessing dashboard
      if (pathname.startsWith('/dashboard') && decoded.role === 'member') {
        return NextResponse.redirect(new URL('/member', origin));
      }

      // If user is on a protected route, ensure they have access (optional strict check)
      if (pathname.startsWith('/member') && decoded.role !== 'member') {
         return NextResponse.redirect(new URL('/', origin)); // Redirect non-members to home/admin
      }
      // If admin tries to access member area? Maybe allow or redirect.
      // For now, let's stick to basic protection.

    } catch {
       // Token invalid, clear and redirect
       const loginResponse = NextResponse.redirect(new URL('/auth/login', origin));
       loginResponse.cookies.delete('accessToken');
       return loginResponse;
    }
  }

  return response;
}

/**
 * Proxy Configuration
 * Matcher defines which paths should trigger the proxy.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};
