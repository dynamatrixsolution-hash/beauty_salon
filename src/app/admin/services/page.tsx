'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors, Plus, Pencil, Trash2, X, Loader2, Star, Clock, Save, GripVertical, Settings2,
  Search, Eye, EyeOff, ChevronDown, ChevronUp, Tag
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ConfirmModal from '@/components/ui/ConfirmModal';

const emptyCategoryForm = { name: '', order: 0 };

/* ─── Sortable Service Row ──────────────────────────────── */
function SortableServiceItem({ service, onEdit, onDelete, onToggleActive }: {
  service: any; onEdit: any; onDelete: any; onToggleActive: (id: string, isActive: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs} hour${hrs > 1 ? 's' : ''}`;
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] mb-2 group hover:bg-white/[0.05] transition-colors">
      <div {...attributes} {...listeners} className="cursor-grab text-white/30 hover:text-white/60">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
        {service.image && <img src={service.image} alt={service.title} className="w-full h-full object-cover" />}
        {service.featured && <div className="absolute top-1 left-1 text-brand-gold"><Star className="w-3 h-3 fill-current" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate flex items-center gap-2">
          {service.title}
          {!service.isActive && <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded">Inactive</span>}
          {service.featured && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Featured</span>}
        </h4>
        <div className="flex items-center gap-4 text-white/40 text-xs mt-1">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(service.duration)}</span>
          <span>NPR {service.pricing?.toLocaleString()}</span>
          {service.tags?.length > 0 && (
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{service.tags.length} tags</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggleActive(service.id, !service.isActive)}
          className={`p-2 rounded-lg transition-colors ${service.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
          title={service.isActive ? 'Deactivate' : 'Activate'}
        >
          {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button onClick={() => onEdit(service)} className="p-2 bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => onDelete(service.id)} className="p-2 bg-rose-500/10 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

/* ─── Categories Management Modal ───────────────────────── */
function CategoriesModal({ show, onClose, categories, onRefresh }: {
  show: boolean; onClose: () => void; categories: any[]; onRefresh: () => void;
}) {
  const [form, setForm] = useState(emptyCategoryForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch('/api/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        onRefresh();
        setForm(emptyCategoryForm);
        setEditingId(null);
      } else alert(data.error);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Services inside must be reassigned first.')) return;
    const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) onRefresh(); else alert(data.error);
  };

  if (!show) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-brand-charcoal w-full max-w-lg rounded-2xl border border-white/[0.08] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h2 className="font-serif text-lg text-white">Manage Categories</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Category List */}
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <div>
                  <span className="text-white text-sm font-medium">{cat.name}</span>
                  <span className="text-white/30 text-xs ml-2">({cat.services?.length || 0} services)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setForm({ name: cat.name, order: cat.order }); setEditingId(cat.id); }} className="p-1.5 text-white/40 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-rose-400 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          {/* Add / Edit Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 items-end pt-4 border-t border-white/[0.06]">
            <div className="flex-1">
              <label className="block text-xs text-white/50 mb-1">{editingId ? 'Edit' : 'New'} Category</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Category name" className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm" />
            </div>
            <div className="w-20">
              <label className="block text-xs text-white/50 mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm" />
            </div>
            <button type="submit" disabled={saving} className="bg-brand-rosegold text-brand-charcoal-dark px-4 py-2 rounded-xl text-sm font-semibold shrink-0">
              {saving ? '...' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setForm(emptyCategoryForm); setEditingId(null); }} className="text-white/40 hover:text-white p-2"><X className="w-4 h-4" /></button>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Admin Services Page ──────────────────────────── */
export default function AdminServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal States
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<{ type: 'service' | 'category'; id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Collapsible categories
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = useCallback(async () => {
    try {
      const [catsRes, servsRes] = await Promise.all([
        fetch('/api/categories'), fetch('/api/services')
      ]);
      const catsData = await catsRes.json();
      const servsData = await servsRes.json();
      if (catsData.success) setCategories(catsData.data);
      if (servsData.success) setServices(servsData.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (session) fetchData(); }, [session, fetchData]);

  const handleDragEnd = async (event: any, categoryId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const categoryServices = services.filter(s => s.categoryId === categoryId);
    const oldIndex = categoryServices.findIndex(s => s.id === active.id);
    const newIndex = categoryServices.findIndex(s => s.id === over.id);
    const newOrdered = arrayMove(categoryServices, oldIndex, newIndex);

    setServices(prev => {
      const others = prev.filter(s => s.categoryId !== categoryId);
      return [...others, ...newOrdered.map((s, i) => ({ ...s, order: i }))];
    });

    // Persist order
    for (let i = 0; i < newOrdered.length; i++) {
      await fetch('/api/services', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newOrdered[i].id, order: i })
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/services', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive })
      });
      const data = await res.json();
      if (data.success) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, isActive } : s));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const url = itemToDelete.type === 'service' ? `/api/services?id=${itemToDelete.id}` : `/api/categories?id=${itemToDelete.id}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        setItemToDelete(null);
      } else alert(data.error);
    } finally {
      setDeleting(false);
    }
  };

  const openEditForm = (service: any) => {
    router.push(`/admin/services/${service.id}/edit`);
  };

  const openNewForm = () => {
    router.push('/admin/services/new');
  };

  const toggleCollapse = (catId: string) => {
    setCollapsedCats(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId); else next.add(catId);
      return next;
    });
  };

  // Filter services
  const getFilteredServices = (categoryId: string) => {
    return services
      .filter(s => s.categoryId === categoryId)
      .filter(s => {
        if (filterStatus === 'active' && !s.isActive) return false;
        if (filterStatus === 'inactive' && s.isActive) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return s.title.toLowerCase().includes(term) || s.description?.toLowerCase().includes(term);
        }
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const featuredServices = services.filter(s => s.featured).length;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-rosegold animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-white flex items-center gap-2">
            <Scissors className="w-6 h-6 text-brand-rosegold" /> Service Management
          </h1>
          <p className="text-white/40 text-sm mt-1">Add, edit, organize, and manage all salon services</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCategoriesModal(true)} className="flex items-center gap-2 bg-white/5 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
            <Settings2 className="w-4 h-4" /> Categories
          </button>
          <button onClick={openNewForm} className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Services', value: totalServices, color: 'text-white' },
          { label: 'Active', value: activeServices, color: 'text-emerald-400' },
          { label: 'Inactive', value: totalServices - activeServices, color: 'text-rose-400' },
          { label: 'Featured', value: featuredServices, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
            <p className="text-white/40 text-xs">{stat.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text" placeholder="Search services..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-rosegold/40"
          />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="bg-white/5 border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm">
          <option value="all" className="bg-brand-charcoal">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id} className="bg-brand-charcoal">{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
          className="bg-white/5 border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm">
          <option value="all" className="bg-brand-charcoal">All Status</option>
          <option value="active" className="bg-brand-charcoal">Active Only</option>
          <option value="inactive" className="bg-brand-charcoal">Inactive Only</option>
        </select>
      </motion.div>

      {/* Services List Grouped by Category */}
      <div className="space-y-6">
        {categories
          .filter(cat => filterCategory === 'all' || cat.id === filterCategory)
          .map((cat, idx) => {
            const catServices = getFilteredServices(cat.id);
            const isCollapsed = collapsedCats.has(cat.id);

            return (
              <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} className="bg-brand-charcoal/50 rounded-2xl border border-white/[0.04] overflow-hidden">
                <button onClick={() => toggleCollapse(cat.id)} className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-serif font-medium text-white">{cat.name}</h3>
                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/40">{catServices.length} items</span>
                  </div>
                  {isCollapsed ? <ChevronDown className="w-5 h-5 text-white/30" /> : <ChevronUp className="w-5 h-5 text-white/30" />}
                </button>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6">
                      {catServices.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-4">No services found</p>
                      ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, cat.id)}>
                          <SortableContext items={catServices.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            {catServices.map(service => (
                              <SortableServiceItem
                                key={service.id} service={service}
                                onEdit={openEditForm}
                                onDelete={(id: string) => setItemToDelete({ type: 'service', id })}
                                onToggleActive={handleToggleActive}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </div>

      {/* Categories Modal */}
      <CategoriesModal show={showCategoriesModal} onClose={() => setShowCategoriesModal(false)} categories={categories} onRefresh={fetchData} />

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title={`Delete ${itemToDelete?.type}?`}
        message="Are you sure? This action cannot be undone."
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
