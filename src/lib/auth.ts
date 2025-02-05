import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
export interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}
const secret = process.env.JWT_SECRET || '';

export async function createToken(user: { id: string; email: string }) {
  try {
    console.log('token creating...')
    const alg = 'HS256';
    
    const token = await new SignJWT({ 
      id: user.id,
      email: user.email 
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(secret));
    console.log("token from lib: ", token)
    return token;
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Failed to create token');
  }
}

export async function verifyToken(token: string):Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
}

// Helper to get token from cookies
export async function getToken() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token');
  return token?.value;
}