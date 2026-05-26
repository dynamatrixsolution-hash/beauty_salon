import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 1. Create a new Inquiry (Public)
export async function POST(req: Request) {
  try {
    const { name, email, phone, type, itemId, itemTitle, details } = await req.json();

    if (!name || !email || !type || !details) {
      return NextResponse.json(
        { error: 'Name, email, type, and details are required' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: phone || '',
        type,
        itemId: itemId || null,
        itemTitle: itemTitle || null,
        details,
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Fetch all Inquiries (Admin Only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 3. Update Inquiry Status (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Inquiry ID and status are required' }, { status: 400 });
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updatedInquiry });
  } catch (error) {
    console.error('Failed to update inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
