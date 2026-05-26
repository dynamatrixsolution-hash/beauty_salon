import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    // Save as general inquiry to prevent database complexity
    await prisma.inquiry.create({
      data: {
        customerName: 'Newsletter Subscriber',
        customerEmail: email,
        customerPhone: '',
        type: 'general',
        details: 'Signed up for the newsletter / discount circle in footer.',
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Failed to register subscription' }, { status: 500 });
  }
}
