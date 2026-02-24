import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://backend.watchshopbd.com';

/**
 * Server-side proxy for login to avoid CORS blocking /sanctum/csrf-cookie.
 * Fetches CSRF cookie then POSTs to backend /api/customer/login and returns the response.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const cookieStore = [];

    // 1) Get CSRF cookie (no CORS on server)
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

    // 2) POST login with Cookie and X-XSRF-TOKEN
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookies ? { Cookie: cookies } : {}),
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
    };
    const loginRes = await fetch(`${BACKEND}/api/customer/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await loginRes.json().catch(() => ({}));
    const res = NextResponse.json(data, { status: loginRes.status });
    const loginSetCookie = loginRes.headers.get('set-cookie');
    if (loginSetCookie) {
      res.headers.set('Set-Cookie', loginSetCookie);
    }
    return res;
  } catch (err) {
    return NextResponse.json(
      { message: err?.message || 'Proxy error' },
      { status: 500 }
    );
  }
}
