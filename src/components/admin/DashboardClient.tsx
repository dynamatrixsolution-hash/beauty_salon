'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DashboardClientProps {
  stats: {
    totalAppointments: number;
    pendingAppointments: number;
    totalInquiries: number;
    pendingInquiries: number;
    publishedPosts: number;
  };
  chartData: { name: string; count: number; fill: string }[];
  recentAppointments: any[];
  recentInquiries: any[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

const typeColors: Record<string, string> = {
  service: 'bg-blue-500/15 text-blue-400',
  product: 'bg-purple-500/15 text-purple-400',
  bridal: 'bg-pink-500/15 text-pink-400',
  general: 'bg-gray-500/15 text-gray-400',
  collab: 'bg-cyan-500/15 text-cyan-400',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardClient({
  stats,
  chartData,
  recentAppointments,
  recentInquiries,
}: DashboardClientProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats.totalAppointments,
      icon: CalendarCheck,
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Pending Bookings',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Published Posts',
      value: stats.publishedPosts,
      icon: FileText,
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
          Welcome back ✨
        </h1>
        <p className="text-white/40 text-sm mt-1 font-sans">{today}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 border border-white/[0.06]`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider font-sans">
                    {card.label}
                  </p>
                  <p className="text-3xl font-serif font-bold text-white mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl bg-white/[0.06] ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Chart */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-brand-rosegold" />
            <h2 className="text-white font-serif text-lg font-semibold">
              Appointment Overview
            </h2>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2A2424',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Appointments */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-brand-rosegold" />
            <h2 className="text-white font-serif text-lg font-semibold">
              Recent Bookings
            </h2>
          </div>
          <div className="space-y-3">
            {recentAppointments.length === 0 ? (
              <p className="text-white/30 text-sm font-sans text-center py-8">
                No appointments yet
              </p>
            ) : (
              recentAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate font-sans">
                      {apt.customerName}
                    </p>
                    <p className="text-white/40 text-xs font-sans mt-0.5">
                      {apt.serviceTitle} •{' '}
                      {new Date(apt.dateTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      statusColors[apt.status] || statusColors.pending
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Inquiries */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-4 h-4 text-brand-rosegold" />
          <h2 className="text-white font-serif text-lg font-semibold">
            Recent Inquiries
          </h2>
        </div>
        <div className="space-y-3">
          {recentInquiries.length === 0 ? (
            <p className="text-white/30 text-sm font-sans text-center py-8">
              No inquiries yet
            </p>
          ) : (
            recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate font-sans">
                    {inq.customerName}
                  </p>
                  <p className="text-white/40 text-xs font-sans mt-0.5 truncate">
                    {inq.details?.substring(0, 60)}
                    {inq.details?.length > 60 ? '...' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      typeColors[inq.type] || typeColors.general
                    }`}
                  >
                    {inq.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      statusColors[inq.status] || statusColors.pending
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
