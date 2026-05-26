import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'src', 'data', 'email_templates.json');

async function readTemplates() {
  const filePath = getFilePath();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeTemplates(templates: any[]) {
  const filePath = getFilePath();
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(templates, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write templates:', error);
    return false;
  }
}

// 1. Get All Templates (Admin Only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await readTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Save/Update All Templates (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templates } = await req.json();
    if (!Array.isArray(templates)) {
      return NextResponse.json({ error: 'Templates must be an array' }, { status: 400 });
    }

    const success = await writeTemplates(templates);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save templates' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('Failed to update templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
