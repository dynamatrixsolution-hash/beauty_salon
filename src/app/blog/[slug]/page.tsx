import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import BlogPostClient from '@/components/blog/BlogPostClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: 'Post Not Found | Glow & Grace Studio',
    };
  }

  return {
    title: `${post.title} | Glow & Grace Studio`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Fetch related posts (same category, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      category: post.category,
      id: { not: post.id },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <BlogPostClient
      post={{
        ...post,
        createdAt: post.createdAt.toISOString(),
      }}
      relatedPosts={relatedPosts.map((rp) => ({
        ...rp,
        createdAt: rp.createdAt.toISOString(),
      }))}
    />
  );
}
