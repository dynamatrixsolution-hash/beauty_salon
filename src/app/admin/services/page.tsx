'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors, Plus, Pencil, Trash2, X, Loader2, Star, Clock, Save, GripVertical, Settings2
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageUploadField from '@/components/admin/ImageUploadField';

const emptyServiceForm = {
  title: '', description: '', duration: '', pricing: '', categoryId: '', benefits: '', image: '', featured: false, isActive: true, tags: ''
};

const emptyCategoryForm = { name: '', order: 0 };

function SortableServiceItem({ service, onEdit, onDelete }: { service: any; onEdit: any; onDelete: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] mb-2 group">
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
        </h4>
        <div className="flex items-center gap-4 text-white/40 text-xs mt-1">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{service.duration} mins</span>
          <span>NPR {service.pricing.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onEdit(service)} className="p-2 bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => onDelete(service.id)} className="p-2 bg-rose-500/10 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [saving, setSaving] = useState(false);
  
  const [itemToDelete, setItemToDelete] = useState<{ type: 'service' | 'category'; id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = async () => {
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
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const handleDragEnd = async (event: any, categoryId: string) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const categoryServices = services.filter(s => s.categoryId === categoryId);
      const oldIndex = categoryServices.findIndex(s => s.id === active.id);
      const newIndex = categoryServices.findIndex(s => s.id === over.id);
      
      const newOrdered = arrayMove(categoryServices, oldIndex, newIndex);
      
      // Optimistic UI update
      setServices(prev => prev.map(s => {
        if (s.categoryId === categoryId) {
          return newOrdered.find(n => n.id === s.id) || s;
        }
        return s;
      }));

      // In real implementation we'd send new orders to API
      // await fetch('/api/services/reorder', { method: 'POST', body: JSON.stringify(newOrdered.map(s => s.id)) });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...serviceForm,
        id: editingId,
        tags: serviceForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/services', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        setShowServiceForm(false);
        setEditingId(null);
      } else alert(data.error);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-rosegold animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-white">Services Menu</h1>
          <p className="text-white/40 text-sm mt-1">Manage categories and services with drag-and-drop</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCategoriesModal(true)} className="flex items-center gap-2 bg-white/5 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
            <Settings2 className="w-4 h-4" /> Manage Categories
          </button>
          <button onClick={() => { setServiceForm({ ...emptyServiceForm, categoryId: categories[0]?.id || '' }); setEditingId(null); setShowServiceForm(true); }} className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </motion.div>

      {/* Services List Grouped by Category */}
      <div className="space-y-8">
        {categories.map((cat, idx) => {
          const catServices = services.filter(s => s.categoryId === cat.id);
          return (
            <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }} className="bg-brand-charcoal/50 rounded-2xl border border-white/[0.04] p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
                <h3 className="text-lg font-serif font-medium text-white">{cat.name}</h3>
                <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/40">{catServices.length} items</span>
              </div>
              
              {catServices.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">No services in this category</p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, cat.id)}>
                  <SortableContext items={catServices.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {catServices.map(service => (
                      <SortableServiceItem 
                        key={service.id} service={service} 
                        onEdit={(s: any) => { setServiceForm({...s, tags: s.tags?.join(', ') || ''}); setEditingId(s.id); setShowServiceForm(true); }}
                        onDelete={(id: string) => setItemToDelete({type: 'service', id})}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Service Form Modal */}
      <AnimatePresence>
        {showServiceForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-brand-charcoal w-full max-w-2xl rounded-2xl border border-white/[0.08] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="font-serif text-lg text-white">{editingId ? 'Edit Service' : 'New Service'}</h2>
                <button onClick={() => setShowServiceForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleServiceSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Title *</label>
                    <input type="text" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Category *</label>
                    <select value={serviceForm.categoryId} onChange={e => setServiceForm({...serviceForm, categoryId: e.target.value})} required className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm">
                      <option value="">Select a category</option>
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-brand-charcoal">{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Duration (mins) *</label>
                    <input type="number" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} required className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Pricing (NPR) *</label>
                    <input type="number" value={serviceForm.pricing} onChange={e => setServiceForm({...serviceForm, pricing: e.target.value})} required className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-2">Description *</label>
                  <textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required rows={3} className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm resize-none" />
                </div>
                <ImageUploadField label="Image" value={serviceForm.image} onChange={url => setServiceForm({...serviceForm, image: url})} onUploadingChange={() => {}} required />
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={serviceForm.featured} onChange={e => setServiceForm({...serviceForm, featured: e.target.checked})} className="rounded bg-white/5 text-brand-rosegold" />
                    <span className="text-sm text-white/60">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={serviceForm.isActive} onChange={e => setServiceForm({...serviceForm, isActive: e.target.checked})} className="rounded bg-white/5 text-brand-rosegold" />
                    <span className="text-sm text-white/60">Active (Visible)</span>
                  </label>
                </div>
                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button type="submit" disabled={saving} className="bg-brand-rosegold text-brand-charcoal-dark px-6 py-2 rounded-xl font-semibold">{saving ? 'Saving...' : 'Save Service'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
