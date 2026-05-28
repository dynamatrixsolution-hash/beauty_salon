import React from 'react';
import prisma from '@/lib/db';
import ServicesClient from '@/components/services/ServicesClient';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: { category: true }
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
    })
  ]);

  return <ServicesClient initialServices={services} categories={categories} />;
}
