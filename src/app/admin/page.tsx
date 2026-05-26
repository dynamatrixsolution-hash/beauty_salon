import React from 'react';
import prisma from '@/lib/db';
import DashboardClient from '@/components/admin/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalInquiries,
    pendingInquiries,
    publishedPosts,
    recentAppointments,
    recentInquiries,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'pending' } }),
    prisma.appointment.count({ where: { status: 'confirmed' } }),
    prisma.appointment.count({ where: { status: 'completed' } }),
    prisma.appointment.count({ where: { status: 'cancelled' } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'pending' } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const stats = {
    totalAppointments,
    pendingAppointments,
    totalInquiries,
    pendingInquiries,
    publishedPosts,
  };

  const chartData = [
    { name: 'Pending', count: pendingAppointments, fill: '#f59e0b' },
    { name: 'Confirmed', count: confirmedAppointments, fill: '#10b981' },
    { name: 'Completed', count: completedAppointments, fill: '#3b82f6' },
    { name: 'Cancelled', count: cancelledAppointments, fill: '#f43f5e' },
  ];

  return (
    <DashboardClient
      stats={stats}
      chartData={chartData}
      recentAppointments={recentAppointments.map((a) => ({
        ...a,
        dateTime: a.dateTime.toISOString(),
        createdAt: a.createdAt.toISOString(),
      }))}
      recentInquiries={recentInquiries.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
      }))}
    />
  );
}
