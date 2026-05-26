import React from 'react';
import prisma from '@/lib/db';
import ProductsClient from '@/components/products/ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { title: 'asc' },
  });

  return <ProductsClient products={products} />;
}
