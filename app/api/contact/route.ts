import { NextResponse } from 'next/server';
import type { ContactFormData } from '@/types';

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    // Basic validation
    if (!data.name || !data.email || !data.company || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\S+@\S+$/i;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would typically send an email using a service like:
    // - SendGrid
    // - Resend
    // - Nodemailer
    // - AWS SES
    // etc.

    // For now, we'll just log the data and return success
    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Implement actual email sending
    // Example with Resend:
    // const { data: emailData, error } = await resend.emails.send({
    //   from: 'contact@adapto.com',
    //   to: 'eduardoborges.dev31@gmail.com',
    //   subject: `New Contact from ${data.name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${data.name}</p>
    //     <p><strong>Email:</strong> ${data.email}</p>
    //     <p><strong>Company:</strong> ${data.company}</p>
    //     <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${data.message}</p>
    //   `,
    // });

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
