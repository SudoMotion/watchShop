import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://backend.watchshopbd.com';

/**
 * Server-side proxy for register to avoid CORS blocking /sanctum/csrf-cookie.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const cookieStore = [];

    const csrfRes = await fetch(`${BACKEND}/sanctum/csrf-cookie`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      redirect: 'manual',
    });
    const setCookie = csrfRes.headers.get('set-cookie');
    if (setCookie) {
      cookieStore.push(setCookie);
    }
    const cookies = cookieStore.join('; ');
    let xsrfToken = null;
    const match = setCookie && setCookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      try {
        xsrfToken = decodeURIComponent(match[1]);
      } catch {
        xsrfToken = match[1];
      }
    }

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookies ? { Cookie: cookies } : {}),
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
    };
    const regRes = await fetch(`${BACKEND}/api/customer/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await regRes.json().catch(() => ({}));
    const res = NextResponse.json(data, { status: regRes.status });
    const regSetCookie = regRes.headers.get('set-cookie');
    if (regSetCookie) {
      res.headers.set('Set-Cookie', regSetCookie);
    }
    return res;
  } catch (err) {
    return NextResponse.json(
      { message: err?.message || 'Proxy error' },
      { status: 500 }
    );
  }
}
