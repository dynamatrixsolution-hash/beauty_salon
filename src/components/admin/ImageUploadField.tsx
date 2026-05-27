'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  required?: boolean;
  chooseLabel?: string;
  replaceLabel?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  onUploadingChange,
  required,
  chooseLabel = 'Choose image from device',
  replaceLabel = 'Replace image',
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!data.success) {
        alert(data.error || 'Failed to upload image');
        setPreview(value || null);
        return;
      }

      onChange(data.url);
      setPreview(data.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
      setPreview(value || null);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-white/50">
        <ImageIcon className="h-3.5 w-3.5" />
        {label}
        {required ? ' *' : ''}
      </label>
      <div className="space-y-3">
        {preview && (
          <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-white/[0.08]">
            <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />
          </div>
        )}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.15] bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition-colors hover:border-brand-rosegold/40 hover:bg-white/[0.05] hover:text-white/80">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-rosegold" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : preview ? replaceLabel : chooseLabel}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleSelect}
          />
        </label>
      </div>
    </div>
  );
}
