'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Eye,
  EyeOff,
  Save,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = ['Skincare', 'Haircare', 'Bridal', 'Wellness', 'Trends'];

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Skincare',
  author: 'Glow & Grace Team',
  image: '',
  published: false,
};

export default function AdminBlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      // For admin, we need all posts including unpublished
      // The API returns only published posts for non-admin, but we have session
      const res = await fetch('/api/blog');
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchPosts();
  }, [session]);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (post: any) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      image: post.image,
      published: post.published,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch('/api/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        await fetchPosts();
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
      } else {
        alert(data.error || 'Failed to save blog post');
      }
    } catch (error) {
      console.error('Failed to save blog post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete blog post:', error);
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
            Blog Posts
          </h1>
          <p className="text-white/40 text-sm mt-1 font-sans">
            Manage beauty journal articles
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </motion.div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 font-sans">No blog posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Image thumbnail */}
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-white/[0.02] shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-rosegold bg-brand-rosegold/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        post.published
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {post.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="text-white font-serif text-sm font-semibold truncate">
                    {post.title}
                  </h3>
                  <p className="text-white/40 text-xs font-sans mt-0.5">
                    by {post.author} •{' '}
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {post.published && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/[0.05] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                      title="View"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openEditForm(post)}
                    className="p-2 rounded-lg bg-white/[0.05] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === post.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
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
              className="bg-brand-charcoal w-full max-w-3xl rounded-2xl border border-white/[0.08] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="font-serif text-lg font-semibold text-white">
                  {editingId ? 'Edit Post' : 'New Post'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                    placeholder="e.g. 10 Tips for Glowing Skin This Monsoon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    required
                    rows={2}
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors resize-none"
                    placeholder="Brief summary for the blog listing..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Content (Markdown) *
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                    rows={12}
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors resize-none font-mono"
                    placeholder="Write your article content in markdown..."
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
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Cover Image URL *
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-rosegold focus:ring-brand-rosegold cursor-pointer"
                  />
                  <span className="text-sm text-white/60 font-sans">
                    Publish immediately
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
                    {editingId ? 'Update Post' : 'Create Post'}
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
