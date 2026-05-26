import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 1. Fetch Products (Public)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { title: 'asc' },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Create Product (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, brand, description, ingredients, instructions, recommendation, category, image, featured } = await req.json();

    if (!title || !brand || !description || !category || !image) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        brand,
        description,
        ingredients: ingredients || '',
        instructions: instructions || '',
        recommendation: recommendation || '',
        category,
        image,
        featured: !!featured,
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 3. Update Product (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, brand, description, ingredients, instructions, recommendation, category, image, featured } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (brand) updateData.brand = brand;
    if (description) updateData.description = description;
    if (ingredients !== undefined) updateData.ingredients = ingredients;
    if (instructions !== undefined) updateData.instructions = instructions;
    if (recommendation !== undefined) updateData.recommendation = recommendation;
    if (category) updateData.category = category;
    if (image) updateData.image = image;
    if (featured !== undefined) updateData.featured = !!featured;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 4. Delete Product (Admin Only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
