import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve both old subscribers (saved as customerName: 'Newsletter Subscriber')
    // and new subscribers (saved with type: 'newsletter')
    const subscribers = await prisma.inquiry.findMany({
      where: {
        OR: [
          { type: 'newsletter' },
          { customerName: 'Newsletter Subscriber' },
          { details: { contains: 'newsletter' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
