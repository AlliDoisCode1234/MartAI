import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/gate
 *
 * Server-side password validation for the login gate.
 * Validates against PHOO_BETA_PASSWORD (server-only, never exposed to client).
 * Sets an httpOnly cookie on success — cannot be manipulated via JS.
 */

const GATE_PASSWORD = process.env.PHOO_BETA_PASSWORD;
const COOKIE_NAME = 'phoo_login_gate';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function POST(request: NextRequest) {
  // TEMPORARILY DISABLED — gate is open for testing (Feb 2026)
  // To re-enable: remove this early return and uncomment the logic below
  return NextResponse.json({ success: true });

  /* GATE LOGIC — RE-ENABLE WHEN READY
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    if (!GATE_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    if (password !== GATE_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
  */
}
