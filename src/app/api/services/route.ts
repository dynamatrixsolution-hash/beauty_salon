import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper to generate a slug from service title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Fetch Services (Public)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      const service = await prisma.service.findUnique({
        where: { id },
        include: { category: true }
      });
      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: service });
    }
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: { category: true }
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Create Service (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, duration, pricing, categoryId, benefits, faqs, featured, image, beforeAfterImage, tags, isActive } = await req.json();

    if (!title || !description || !duration || !categoryId || !image) {
      return NextResponse.json({ error: 'Missing required service fields' }, { status: 400 });
    }

    const slug = generateSlug(title);

    // Check if slug is unique
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A service with a similar title already exists.' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        duration: parseInt(duration),
        pricing: pricing ? parseFloat(pricing) : 0,
        categoryId,
        benefits: benefits || '',
        faqs: faqs || '[]',
        featured: !!featured,
        isActive: isActive !== undefined ? isActive : true,
        tags: tags || [],
        image,
        beforeAfterImage: beforeAfterImage || null,
      },
    });

    return NextResponse.json({ success: true, data: newService });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 3. Update Service (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, description, duration, pricing, categoryId, benefits, faqs, featured, image, beforeAfterImage, isActive, tags, order } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
    }
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (pricing !== undefined) updateData.pricing = parseFloat(pricing);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (faqs !== undefined) updateData.faqs = faqs;
    if (featured !== undefined) updateData.featured = !!featured;
    if (isActive !== undefined) updateData.isActive = !!isActive;
    if (tags !== undefined) updateData.tags = tags;
    if (order !== undefined) updateData.order = parseInt(order);
    if (image !== undefined) updateData.image = image;
    if (beforeAfterImage !== undefined) updateData.beforeAfterImage = beforeAfterImage;

    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 4. Delete Service (Admin Only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
