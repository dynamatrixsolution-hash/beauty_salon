import React from 'react';
import prisma from '@/lib/db';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';

function getSettledValue<T>(
  label: string,
  result: PromiseSettledResult<T[]>
): T[] {
  if (result.status === 'fulfilled') {
    return result.value;
  }

  console.warn(`Failed to load home page ${label}; rendering an empty section.`);
  return [];
}

export default async function HomePage() {
  // Fetch data in parallel for fast server rendering
  const [servicesResult, productsResult, stylistsResult, blogPostsResult, reviewsResult] = await Promise.allSettled([
    prisma.service.findMany({
      where: { featured: true },
      take: 6,
    }),
    prisma.product.findMany({
      where: { featured: true },
      take: 3,
    }),
    prisma.staff.findMany({
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

  const services = getSettledValue('services', servicesResult);
  const products = getSettledValue('products', productsResult);
  const stylists = getSettledValue('stylists', stylistsResult);
  const blogPosts = getSettledValue('blog posts', blogPostsResult);
  const reviews = getSettledValue('reviews', reviewsResult);

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
