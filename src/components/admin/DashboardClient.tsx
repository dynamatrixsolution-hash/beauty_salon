'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  Loader2,
  Power,
  Sliders,
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
  const [salonOverride, setSalonOverride] = useState<'auto' | 'open' | 'closed'>('auto');
  const [autoOpenHour, setAutoOpenHour] = useState(10);
  const [autoCloseHour, setAutoCloseHour] = useState(20);
  const [loadingSetting, setLoadingSetting] = useState(true);
  const [updatingSetting, setUpdatingSetting] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          setSalonOverride(data.value);
          setAutoOpenHour(data.autoOpenHour ?? 10);
          setAutoCloseHour(data.autoCloseHour ?? 20);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoadingSetting(false);
      }
    };
    fetchSetting();
  }, []);

  const handleOverrideChange = async (value: 'auto' | 'open' | 'closed') => {
    setUpdatingSetting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      if (data.success) {
        setSalonOverride(data.value);
      } else {
        alert(data.error || 'Failed to update status override');
      }
    } catch (error) {
      console.error('Failed to update status override:', error);
    } finally {
      setUpdatingSetting(false);
    }
  };

  const handleHoursChange = async (openHr: number, closeHr: number) => {
    setUpdatingSetting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoOpenHour: openHr, autoCloseHour: closeHr }),
      });
      const data = await res.json();
      if (data.success) {
        setAutoOpenHour(data.autoOpenHour);
        setAutoCloseHour(data.autoCloseHour);
      } else {
        alert(data.error || 'Failed to update hours');
      }
    } catch (error) {
      console.error('Failed to update hours:', error);
    } finally {
      setUpdatingSetting(false);
    }
  };

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
      color: 'from-white/[0.06] to-white/[0.01]',
      iconColor: 'text-brand-rosegold',
    },
    {
      label: 'Pending Bookings',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'from-brand-rosegold/15 to-brand-rosegold/3',
      iconColor: 'text-brand-rosegold-dark',
    },
    {
      label: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'from-brand-gold/15 to-brand-gold/3',
      iconColor: 'text-brand-gold',
    },
    {
      label: 'Published Posts',
      value: stats.publishedPosts,
      icon: FileText,
      color: 'from-brand-pink-accent/15 to-brand-pink-accent/3',
      iconColor: 'text-brand-pink-accent',
    },
  ];

  return (
    <div className="space-y-8 pb-36">
      {/* Welcome Header */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-white via-brand-pink-accent to-brand-rosegold bg-clip-text text-transparent tracking-wide font-serif">
          Welcome back ✨
        </h1>
        <p className="text-white/40 text-sm mt-1 font-sans">{today}</p>
      </motion.div>

      {/* ─── Salon Status Override Panel ────────────────────────── */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-6 shadow-xl space-y-4 overflow-hidden animate-pulse-slow"
      >
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-brand-rosegold/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Salon Status Override Panel (Now UP / At the Top) */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-brand-rosegold/10 rounded-2xl text-brand-rosegold border border-brand-rosegold/20 shrink-0 shadow-inner">
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-serif text-lg font-medium tracking-wide">
                Salon Status Override
              </h2>
              <p className="text-white/40 text-xs font-sans mt-1 leading-relaxed max-w-xl font-light">
                Manually force the salon to display as Open or Closed on the public website, bypassing the automatic timing schedule when needed.
              </p>
            </div>
          </div>

          {loadingSetting ? (
            <div className="flex items-center gap-2 text-white/40 text-sm font-sans shrink-0">
              <Loader2 className="w-4 h-4 animate-spin text-brand-rosegold" />
              Loading settings...
            </div>
          ) : (
            <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/[0.05] relative shrink-0 shadow-lg">
              {updatingSetting && (
                <div className="absolute inset-0 bg-brand-charcoal-dark/65 rounded-2xl flex items-center justify-center z-10 backdrop-blur-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-rosegold" />
                </div>
              )}
              {[
                { value: 'auto', label: 'Auto (Schedule)' },
                { value: 'open', label: 'Force Open' },
                { value: 'closed', label: 'Force Closed' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOverrideChange(option.value as any)}
                  className={`px-4.5 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    salonOverride === option.value
                      ? 'bg-gradient-to-r from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark shadow-md font-extrabold transform scale-[1.02]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.02] font-semibold'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Help Description */}
        {!loadingSetting && (
          <div className="flex items-center gap-2 pl-0 lg:pl-[58px] -mt-2 relative z-10">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${salonOverride === 'closed' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${salonOverride === 'closed' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <p className="text-[10px] font-bold text-brand-rosegold/80 uppercase tracking-[0.18em] font-sans">
              {salonOverride === 'auto' && (
                <>Automatic schedule active • ({autoOpenHour % 12 || 12}:00 {autoOpenHour >= 12 ? 'PM' : 'AM'} - {autoCloseHour % 12 || 12}:00 {autoCloseHour >= 12 ? 'PM' : 'AM'} NPT)</>
              )}
              {salonOverride === 'open' && (
                <>Forced OPEN active • (shown as OPEN online 24/7)</>
              )}
              {salonOverride === 'closed' && (
                <>Forced CLOSED active • (shown as CLOSED online 24/7)</>
              )}
            </p>
          </div>
        )}

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-white/[0.06] via-white/[0.02] to-transparent w-full relative z-10" />

        {/* 2. Automatic Hours Configurator (Now DOWN / At the Bottom) */}
        {!loadingSetting && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-2 relative z-10">
            <div className="flex-1 flex items-start gap-3.5">
              <div className="p-3 bg-white/[0.04] rounded-2xl text-white/50 border border-white/[0.05] shrink-0 shadow-inner">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider font-sans">
                  Automatic Schedule Settings
                </h3>
                <p className="text-white/30 text-[11px] font-sans mt-0.5 font-light leading-relaxed max-w-md">
                  Configure the default operating time span. These hours dictate public open/close status when the switcher is set to "Auto".
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04] shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs font-medium font-sans">Open:</span>
                <select
                  value={autoOpenHour}
                  onChange={(e) => handleHoursChange(parseInt(e.target.value), autoCloseHour)}
                  className="bg-brand-charcoal border border-white/[0.08] text-white/85 rounded-xl text-xs font-semibold py-1.5 px-3.5 focus:outline-none focus:border-brand-rosegold/50 focus:ring-1 focus:ring-brand-rosegold/20 hover:border-white/20 transition-all cursor-pointer shadow-sm"
                >
                  {Array.from({ length: 24 }).map((_, h) => {
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const displayHr = h % 12 || 12;
                    return (
                      <option key={h} value={h} className="bg-brand-charcoal text-white font-medium">
                        {String(displayHr).padStart(2, '0')}:00 {ampm}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-px h-6 bg-white/[0.06]" />

              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs font-medium font-sans">Close:</span>
                <select
                  value={autoCloseHour}
                  onChange={(e) => handleHoursChange(autoOpenHour, parseInt(e.target.value))}
                  className="bg-brand-charcoal border border-white/[0.08] text-white/85 rounded-xl text-xs font-semibold py-1.5 px-3.5 focus:outline-none focus:border-brand-rosegold/50 focus:ring-1 focus:ring-brand-rosegold/20 hover:border-white/20 transition-all cursor-pointer shadow-sm"
                >
                  {Array.from({ length: 24 }).map((_, h) => {
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const displayHr = h % 12 || 12;
                    return (
                      <option key={h} value={h} className="bg-brand-charcoal text-white font-medium">
                        {String(displayHr).padStart(2, '0')}:00 {ampm}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        )}
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
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 border border-white/[0.06] hover:border-brand-rosegold/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-rosegold/5 transition-all duration-300 shadow-md`}
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
