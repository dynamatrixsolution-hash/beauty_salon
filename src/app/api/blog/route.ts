import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper to generate a slug from blog post title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Fetch Blog Posts (public gets published only, admin gets all)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'admin';

    const posts = await prisma.blogPost.findMany({
      where: isAdmin ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Create Blog Post (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, excerpt, category, author, image, published } = await req.json();

    if (!title || !content || !excerpt || !category || !author || !image) {
      return NextResponse.json({ error: 'Missing required blog post fields' }, { status: 400 });
    }

    const slug = generateSlug(title);

    // Check if slug is unique
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A blog post with a similar title already exists.' }, { status: 400 });
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        author,
        image,
        published: !!published,
      },
    });

    return NextResponse.json({ success: true, data: newPost });
  } catch (error) {
    console.error('Failed to create blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 3. Update Blog Post (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, content, excerpt, category, author, image, published } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
    }
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (category) updateData.category = category;
    if (author) updateData.author = author;
    if (image) updateData.image = image;
    if (published !== undefined) updateData.published = !!published;

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 4. Delete Blog Post (Admin Only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
