import { NextResponse } from 'next/server';
import type { ContactFormData } from '@/types';

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    if (!data.name || !data.email || !data.company || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/i;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    console.log('[adapto] contact form submission', {
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // TODO: wire up Resend (or similar) to actually deliver the email.
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('[adapto] contact form error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
