import React from 'react';
import prisma from '@/lib/db';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data in parallel for fast server rendering
  const [services, products, stylists, blogPosts, reviews] = await Promise.all([
    prisma.service.findMany({
      where: { featured: true },
      take: 6,
    }),
    prisma.product.findMany({
      where: { featured: true },
      take: 3,
    }),
    prisma.stylist.findMany({
      where: { featured: true },
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.review.findMany({
      where: { status: 'approved' },
      take: 5,
    }),
  ]);

  return (
    <HomeClient
      services={services}
      products={products}
      stylists={stylists}
      blogPosts={blogPosts}
      reviews={reviews}
    />
  );
}
