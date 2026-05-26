import React from 'react';
import prisma from '@/lib/db';
import ServicesClient from '@/components/services/ServicesClient';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { title: 'asc' },
  });

  return <ServicesClient initialServices={services} />;
}
