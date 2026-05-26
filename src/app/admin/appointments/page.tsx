'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  Loader2,
  Phone,
  Mail,
  User,
  Filter,
} from 'lucide-react';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

export default function AdminAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchAppointments();
  }, [session]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filtered =
    activeTab === 'all'
      ? appointments
      : appointments.filter((a) => a.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-rosegold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl font-semibold text-white">
            Appointments
          </h1>
          <p className="text-white/40 text-sm mt-1 font-sans">
            Manage customer bookings and schedules
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <CalendarCheck className="w-4 h-4" />
          <span>{appointments.length} total</span>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        <Filter className="w-4 h-4 text-white/30 shrink-0" />
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-brand-rosegold/15 text-brand-rosegold border border-brand-rosegold/25'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <CalendarCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 font-sans">No appointments found</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt, idx) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Customer Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-rosegold/30 to-brand-pink-accent/20 flex items-center justify-center text-brand-rosegold font-semibold text-sm shrink-0">
                      {apt.customerName?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate font-sans">
                        {apt.customerName}
                      </p>
                      <div className="flex items-center gap-3 text-white/40 text-xs mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {apt.customerEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {apt.customerPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service & Stylist */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 font-sans pl-[52px]">
                    <span>
                      <strong className="text-white/70">Service:</strong>{' '}
                      {apt.serviceTitle}
                    </span>
                    <span>
                      <strong className="text-white/70">Stylist:</strong>{' '}
                      {apt.stylistName}
                    </span>
                    <span>
                      <strong className="text-white/70">Date:</strong>{' '}
                      {new Date(apt.dateTime).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-white/30 text-xs font-sans pl-[52px] italic">
                      Note: {apt.notes}
                    </p>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 pl-[52px] lg:pl-0 shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
                      statusColors[apt.status] || statusColors.pending
                    }`}
                  >
                    {apt.status}
                  </span>

                  {apt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(apt.id, 'confirmed')}
                        disabled={updating === apt.id}
                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
                        title="Confirm"
                      >
                        {updating === apt.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                        disabled={updating === apt.id}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(apt.id, 'completed')}
                      disabled={updating === apt.id}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {updating === apt.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Complete'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
