import React, { Suspense } from 'react';
import prisma from '@/lib/db';
import BookingWizard from '@/components/book/BookingWizard';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const services = await prisma.service.findMany({
    orderBy: { title: 'asc' },
  });

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-brand-beige">
        <div className="text-brand-rosegold-dark text-sm animate-pulse">Loading luxury reservation portal...</div>
      </div>
    }>
      <BookingWizard services={services} />
    </Suspense>
  );
}
