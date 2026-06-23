import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/db';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Team | Glow & Grace Studio',
  description:
    'Meet the salon specialists, stylists, therapists, and artists behind Glow & Grace Studio.',
};

export default async function TeamPage() {
  const teamMembers = await prisma.staff.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });

  // Organize team into hierarchy
  const founder = teamMembers.find(m => m.role.includes('Founder') || m.role.includes('CEO'));
  const heads = teamMembers.filter(m => m.role.includes('Head') && m.id !== founder?.id);
  const specialists = teamMembers.filter(
    m => !m.role.includes('Founder') && !m.role.includes('CEO') && !m.role.includes('Head') && m.id !== founder?.id
  );

  return (
    <TeamClient 
      founder={founder}
      heads={heads}
      specialists={specialists}
    />
  );
}
