import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 1. Fetch Transformations (Public)
export async function GET() {
  try {
    const transformations = await prisma.transformation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: transformations });
  } catch (error) {
    console.error('Failed to fetch transformations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Create Transformation (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, category, desc, beforeImg, afterImg, beforeLabel, afterLabel } = await req.json();

    if (!title || !category || !desc || !beforeImg || !afterImg) {
      return NextResponse.json({ error: 'Missing required transformation fields' }, { status: 400 });
    }

    const newTransformation = await prisma.transformation.create({
      data: {
        title,
        category,
        desc,
        beforeImg,
        afterImg,
        beforeLabel: beforeLabel || 'Before',
        afterLabel: afterLabel || 'After',
      },
    });

    return NextResponse.json({ success: true, data: newTransformation });
  } catch (error) {
    console.error('Failed to create transformation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 3. Update Transformation (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, category, desc, beforeImg, afterImg, beforeLabel, afterLabel } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Transformation ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (desc) updateData.desc = desc;
    if (beforeImg) updateData.beforeImg = beforeImg;
    if (afterImg) updateData.afterImg = afterImg;
    if (beforeLabel !== undefined) updateData.beforeLabel = beforeLabel;
    if (afterLabel !== undefined) updateData.afterLabel = afterLabel;

    const updatedTransformation = await prisma.transformation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedTransformation });
  } catch (error) {
    console.error('Failed to update transformation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 4. Delete Transformation (Admin Only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Transformation ID is required' }, { status: 400 });
    }

    await prisma.transformation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Transformation deleted successfully' });
  } catch (error) {
    console.error('Failed to delete transformation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
