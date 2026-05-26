'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          {/* Backdrop click-out */}
          <div className="absolute inset-0" onClick={isLoading ? undefined : onCancel} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm overflow-hidden bg-brand-charcoal border border-white/[0.08] rounded-3xl shadow-2xl z-10 font-sans"
          >
            {/* Close Button */}
            {!isLoading && (
              <button
                onClick={onCancel}
                className="absolute top-4.5 right-4.5 p-1 rounded-full bg-white/[0.02] border border-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="p-6 flex flex-col items-center text-center">
              {/* Glowing Icon Header */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4.5 shadow-inner ${
                  isDanger
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                }`}
              >
                {isDanger ? (
                  <Trash2 className="w-5.5 h-5.5" />
                ) : (
                  <AlertTriangle className="w-5.5 h-5.5" />
                )}
              </div>

              {/* Title & Message */}
              <h3 className="text-base font-semibold text-white tracking-wide mb-2">
                {title}
              </h3>
              <p className="text-white/60 text-xs leading-relaxed max-w-xs mb-6">
                {message}
              </p>

              {/* Bottom Buttons */}
              <div className="flex gap-2.5 w-full">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onConfirm}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md disabled:opacity-50 ${
                    isDanger
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-500 shadow-rose-500/10'
                      : 'bg-gradient-to-r from-brand-pink-accent to-brand-rosegold hover:from-brand-rosegold hover:to-brand-pink-accent text-brand-charcoal-dark shadow-brand-rosegold/10'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
