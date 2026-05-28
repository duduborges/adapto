import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { ContactFormData } from '@/types';
import { site } from '@/lib/site';

// Force the route to be dynamic so Next.js does not try to pre-collect it
// at build time (which would touch RESEND_API_KEY before envs are available).
export const dynamic = 'force-dynamic';

const FROM_EMAIL =
  process.env.RESEND_FROM || 'contact@resend.eduardoborges.dev.br';
const TO_EMAIL = process.env.CONTACT_TO || site.email;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c] as string),
  );

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
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[adapto] RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 },
      );
    }
    const resend = new Resend(apiKey);

    const name = esc(data.name);
    const email = esc(data.email);
    const company = esc(data.company);
    const message = esc(data.message).replace(/\n/g, '<br/>');

    /* ---- Notify Adapto ---- */
    const adminResult = await resend.emails.send({
      from: `Adapto Website <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `New conversation request — ${data.name} (${data.company})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2a2021;">
          <div style="background: #2a2021; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fefefe; margin: 0; font-size: 20px; letter-spacing: -0.01em;">
              New conversation request
            </h1>
            <p style="color: rgba(254,254,254,0.6); margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.18em;">
              Adapto Software House
            </p>
          </div>
          <div style="border: 1px solid #e6e1e1; border-top: none; padding: 28px; border-radius: 0 0 12px 12px; background: #fefefe;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; width: 110px; vertical-align: top;">Name</td>
                <td style="padding: 10px 0; color: #2a2021; font-size: 15px; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; vertical-align: top;">Email</td>
                <td style="padding: 10px 0; color: #2a2021; font-size: 15px;"><a href="mailto:${email}" style="color: #c35622; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; vertical-align: top;">Company</td>
                <td style="padding: 10px 0; color: #2a2021; font-size: 15px;">${company}</td>
              </tr>
              <tr>
                <td style="padding: 16px 0 6px; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; vertical-align: top;" colspan="2">Problem to solve</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 0 0 8px; color: #2a2021; font-size: 15px; line-height: 1.65;">${message}</td>
              </tr>
            </table>
            <p style="margin: 24px 0 0; padding-top: 16px; border-top: 1px solid #e6e1e1; color: #a89898; font-size: 12px;">
              Reply directly to this email to reach ${name}.
            </p>
          </div>
        </div>
      `,
    });

    if (adminResult.error) {
      console.error('[adapto] Resend admin send error:', adminResult.error);
      return NextResponse.json(
        { error: 'Failed to deliver message' },
        { status: 502 },
      );
    }

    /* ---- Send confirmation to the visitor ---- */
    try {
      await resend.emails.send({
        from: `Adapto <${FROM_EMAIL}>`,
        to: data.email,
        subject: 'Thanks — we received your message',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2a2021;">
            <div style="background: #2a2021; padding: 28px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fefefe; margin: 0; font-size: 22px; letter-spacing: -0.01em;">
                Hi ${name},
              </h1>
              <p style="color: rgba(254,254,254,0.7); margin: 12px 0 0; font-size: 16px; line-height: 1.55;">
                Thanks for reaching out — we got your message.
              </p>
            </div>
            <div style="border: 1px solid #e6e1e1; border-top: none; padding: 28px; border-radius: 0 0 12px 12px; background: #fefefe; font-size: 15px; line-height: 1.65; color: #2a2021;">
              <p style="margin: 0 0 14px;">
                One of the founders will reply within one business day. In the meantime, if it's easier, you can
                <a href="${site.bookingUrl}" style="color: #c35622; font-weight: 500;">book a 30-minute call</a> directly on our calendar.
              </p>
              <p style="margin: 0 0 14px;">
                A quick reminder of what you sent us:
              </p>
              <blockquote style="margin: 0 0 22px; padding: 14px 18px; border-left: 3px solid #c35622; background: #fdf5f0; color: #473838; border-radius: 0 6px 6px 0;">
                ${message}
              </blockquote>
              <p style="margin: 0; color: #5b4a4a; font-size: 14px;">
                — The Adapto team
              </p>
              <p style="margin: 18px 0 0; padding-top: 16px; border-top: 1px solid #e6e1e1; color: #a89898; font-size: 12px;">
                Vancouver, BC · Canada &nbsp;·&nbsp; <a href="https://adapto-sh.com" style="color: #a89898;">adapto-sh.com</a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (confirmErr) {
      // Confirmation failure shouldn't fail the request — the admin was already notified.
      console.error('[adapto] Resend confirmation send error:', confirmErr);
    }

    return NextResponse.json({ message: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('[adapto] contact form error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
