import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { question, answer, category, isPriority } = data;

    if (!question || !answer || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // @ts-ignore
    const updated = await prisma.aIKnowledgeBase.update({
      where: { id },
      data: { question, answer, category, isPriority: isPriority ?? true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating knowledge base entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // @ts-ignore
    await prisma.aIKnowledgeBase.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting knowledge base entry:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
