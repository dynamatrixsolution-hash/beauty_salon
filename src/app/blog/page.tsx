import React from 'react';
import prisma from '@/lib/db';
import BlogClient from '@/components/blog/BlogClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Beauty Journal | Glow & Grace Studio',
  description:
    'Discover expert beauty tips, skincare routines, haircare secrets, bridal inspiration, and wellness advice from the Glow & Grace Studio team.',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <BlogClient
      initialPosts={posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
      }))}
    />
  );
}
