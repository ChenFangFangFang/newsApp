import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ 
    message: 'Logged out successfully' 
  });

  // Clear all authentication-related cookies
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0)
  });

  // Optional: Clear other potential authentication cookies
  response.cookies.set('next-auth.csrf-token', '', { expires: new Date(0), path: '/' });
  response.cookies.set('next-auth.callback-url', '', { expires: new Date(0), path: '/' });
  response.cookies.set('next-auth.session-token', '', { expires: new Date(0), path: '/' });

  return response;
}