'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Star,
  Save,
} from 'lucide-react';

const CATEGORIES = ['skincare', 'haircare', 'makeup', 'spa', 'tools'];

const emptyForm = {
  title: '',
  brand: '',
  description: '',
  ingredients: '',
  instructions: '',
  recommendation: '',
  category: 'skincare',
  image: '',
  featured: false,
};

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchProducts();
  }, [session]);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product: any) => {
    setForm({
      title: product.title,
      brand: product.brand,
      description: product.description,
      ingredients: product.ingredients || '',
      instructions: product.instructions || '',
      recommendation: product.recommendation || '',
      category: product.category,
      image: product.image,
      featured: product.featured,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setDeleting(null);
    }
  };

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
            Products
          </h1>
          <p className="text-white/40 text-sm mt-1 font-sans">
            Manage beauty product catalog
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </motion.div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 font-sans">No products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                {product.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-gold/90 text-brand-charcoal-dark text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {product.category}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest font-sans">
                    {product.brand}
                  </p>
                  <h3 className="text-white font-serif text-base font-semibold mt-0.5">
                    {product.title}
                  </h3>
                  <p className="text-white/40 text-xs line-clamp-2 mt-1 font-sans">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => openEditForm(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors text-xs font-medium cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors text-xs font-medium cursor-pointer disabled:opacity-50"
                  >
                    {deleting === product.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-brand-charcoal w-full max-w-2xl rounded-2xl border border-white/[0.08] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="font-serif text-lg font-semibold text-white">
                  {editingId ? 'Edit Product' : 'New Product'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Ingredients
                  </label>
                  <textarea
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    rows={2}
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={form.instructions}
                    onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                    rows={2}
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Recommendation
                  </label>
                  <input
                    type="text"
                    value={form.recommendation}
                    onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-brand-charcoal">
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-rosegold focus:ring-brand-rosegold cursor-pointer"
                  />
                  <span className="text-sm text-white/60 font-sans">
                    Featured on homepage
                  </span>
                </label>

                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingId ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
