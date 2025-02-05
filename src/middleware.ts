import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicPaths = ['/login', '/register'];

  try {
    // If it's a public path, allow access
    console.log("middleware is running")
    if (publicPaths.includes(path)) {
      return NextResponse.next();
    }
    console.log("token:  ", token)

    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify the token
    await verifyToken(token);

    return NextResponse.next();
  } catch  {
    // Token is invalid or expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    
    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0) // Set to past date to delete
    });

    return response;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
   
  ]
}