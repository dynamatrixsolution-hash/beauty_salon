import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // @ts-ignore
    const knowledgeBase = await prisma.aIKnowledgeBase.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(knowledgeBase);
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { question, answer, category, isPriority } = data;

    if (!question || !answer || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // @ts-ignore
    const newEntry = await prisma.aIKnowledgeBase.create({
      data: {
        question,
        answer,
        category,
        isPriority: isPriority ?? true,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge base entry:', error);
    return NextResponse.json({ error: 'Failed to create knowledge base entry' }, { status: 500 });
  }
}
