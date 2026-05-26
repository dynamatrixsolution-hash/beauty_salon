import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 1. Fetch Stylists (Public)
export async function GET() {
  try {
    const stylists = await prisma.stylist.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ success: true, data: stylists });
  } catch (error) {
    console.error('Failed to fetch stylists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Create Stylist (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, specialization, experience, certifications, socials, image, featured } = await req.json();

    if (!name || !specialization || !experience || !certifications || !image) {
      return NextResponse.json({ error: 'Missing required stylist fields' }, { status: 400 });
    }

    const newStylist = await prisma.stylist.create({
      data: {
        name,
        specialization,
        experience,
        certifications,
        socials: socials || '',
        image,
        featured: !!featured,
      },
    });

    return NextResponse.json({ success: true, data: newStylist });
  } catch (error) {
    console.error('Failed to create stylist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 3. Update Stylist (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, specialization, experience, certifications, socials, image, featured } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Stylist ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (specialization) updateData.specialization = specialization;
    if (experience) updateData.experience = experience;
    if (certifications !== undefined) updateData.certifications = certifications;
    if (socials !== undefined) updateData.socials = socials;
    if (image) updateData.image = image;
    if (featured !== undefined) updateData.featured = !!featured;

    const updatedStylist = await prisma.stylist.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedStylist });
  } catch (error) {
    console.error('Failed to update stylist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 4. Delete Stylist (Admin Only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Stylist ID is required' }, { status: 400 });
    }

    await prisma.stylist.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Stylist deleted successfully' });
  } catch (error) {
    console.error('Failed to delete stylist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
