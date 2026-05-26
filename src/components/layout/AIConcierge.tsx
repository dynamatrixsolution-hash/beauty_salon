'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles, X, Send, Mic, ShieldCheck, ChevronDown,
  Wand2, MessageCircle, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  type?: 'ai' | 'trusted' | 'fallback';
  source?: string;
  category?: string;
}

// ─── Quick chips shown below welcome message ──────────────────────────────────

const QUICK_CHIPS = [
  { label: 'Bridal Packages 💍', query: 'Do you provide full bridal packages?' },
  { label: 'Facial Treatments ✨', query: 'Which facial is best for glowing skin?' },
  { label: 'Hair Services 💇‍♀️', query: 'Do you provide hair coloring?' },
  { label: 'Pricing 💰', query: 'What is the price of bridal makeup?' },
];

// ─── Typing dot animation ─────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex justify-start items-end gap-2.5"
    >
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ECC8C5] to-[#D9A7A0] flex items-center justify-center shrink-0 mb-1 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      {/* Bubble */}
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(236,200,197,0.35)',
          boxShadow: '0 4px 16px rgba(217,167,160,0.12)',
        }}
      >
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#C58B82]/70 inline-block"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.75, delay, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── A single chat bubble ─────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const isTrusted = msg.type === 'trusted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-end gap-2.5 max-w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 shadow-sm ${
            isTrusted
              ? 'bg-gradient-to-br from-[#C5A059] to-[#E6C280]'
              : 'bg-gradient-to-br from-[#ECC8C5] to-[#D9A7A0]'
          }`}
        >
          {isTrusted ? (
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-white" />
          )}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Badge for trusted answers */}
        {isTrusted && (
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A059] px-1">
            <ShieldCheck className="w-2.5 h-2.5" />
            Verified Answer
          </span>
        )}

        {/* Category chip for trusted */}
        {isTrusted && msg.category && (
          <span className="text-[9px] uppercase tracking-widest font-bold text-[#C5A059]/60 px-1">
            {msg.category}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={`text-[13px] leading-relaxed px-4 py-2.5 ${
            isUser
              ? 'rounded-2xl rounded-br-sm text-white'
              : isTrusted
              ? 'rounded-2xl rounded-bl-sm text-[#2A2424]'
              : 'rounded-2xl rounded-bl-sm text-[#2A2424]'
          }`}
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #D9A7A0 0%, #C58B82 100%)',
                  boxShadow: '0 4px 16px rgba(197,139,130,0.30)',
                }
              : isTrusted
              ? {
                  background: 'rgba(255,253,245,0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(197,160,89,0.30)',
                  boxShadow: '0 4px 20px rgba(197,160,89,0.12)',
                }
              : {
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(236,200,197,0.35)',
                  boxShadow: '0 4px 16px rgba(217,167,160,0.12)',
                }
          }
        >
          {msg.content}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: 'Welcome to Glow & Grace ✨ How may I help you today?',
      type: 'ai',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const isAdminPath = pathname?.startsWith('/admin');

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNewMsg(false);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsTyping(true);

      try {
        const res = await fetch('/api/concierge/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text.trim() }),
        });

        const data = await res.json();

        setIsTyping(false);
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content:
            data.answer ||
            "I'm sorry, I couldn't get a response. Please try again! ✨",
          type: data.type || 'fallback',
          source: data.source,
          category: data.category,
        };
        setMessages((prev) => [...prev, aiMsg]);

        // Show notification dot if chat is closed
        if (!isOpen) setHasNewMsg(true);
      } catch {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'ai',
            content:
              'Something went wrong on my end ✨ Please try again shortly!',
            type: 'fallback',
          },
        ]);
      }
    },
    [isTyping, isOpen]
  );

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        content: 'Welcome to Glow & Grace ✨ How may I help you today?',
        type: 'ai',
      },
    ]);
  };

  if (isAdminPath) return null;

  const showChips =
    messages.length <= 2 &&
    messages[messages.length - 1]?.role === 'ai' &&
    !isTyping;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans pointer-events-none">
      {/* ── Chat Window ─────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.92, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="pointer-events-auto w-[350px] flex flex-col overflow-hidden"
            style={{
              height: '500px',
              background: 'rgba(253,251,247,0.78)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(236,200,197,0.40)',
              boxShadow:
                '0 24px 60px rgba(42,36,36,0.14), 0 8px 24px rgba(217,167,160,0.18), inset 0 0 0 0.5px rgba(255,255,255,0.6)',
              borderRadius: '20px',
            }}
          >
            {/* ── Header ───────────────────────────── */}
            <div
              className="h-[62px] px-4 flex items-center justify-between shrink-0"
              style={{
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(236,200,197,0.25)',
              }}
            >
              <div className="flex items-center gap-2.5">
                {/* Glow orb */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 relative"
                  style={{
                    background:
                      'linear-gradient(135deg, #ECC8C5 0%, #D9A7A0 60%, #C58B82 100%)',
                    boxShadow:
                      '0 0 16px rgba(217,167,160,0.55), 0 2px 8px rgba(197,139,130,0.30)',
                  }}
                >
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                  {/* Pulse ring */}
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'rgba(236,200,197,0.35)' }}
                  />
                </div>

                <div className="flex flex-col leading-tight">
                  <span
                    className="text-[13.5px] font-semibold tracking-wide"
                    style={{
                      background:
                        'linear-gradient(135deg, #C58B82 0%, #D9A7A0 50%, #ECC8C5 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Glow AI Concierge ✨
                  </span>
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-emerald-600/70">
                    ● Hybrid System Online
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset */}
                <button
                  onClick={handleReset}
                  title="Restart conversation"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#2A2424]/30 hover:text-[#2A2424]/60 hover:bg-[#2A2424]/5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#2A2424]/30 hover:text-[#2A2424]/60 hover:bg-[#2A2424]/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages Area ─────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5 scroll-smooth">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}

              {/* Quick chip suggestions */}
              <AnimatePresence>
                {showChips && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-2 pl-9 mt-1"
                  >
                    <p className="text-[10px] text-[#2A2424]/40 font-semibold uppercase tracking-widest">
                      Quick Questions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip.label}
                          onClick={() => handleSend(chip.query)}
                          className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#2A2424]/75 transition-all cursor-pointer"
                          style={{
                            background: 'rgba(255,255,255,0.70)',
                            border: '1px solid rgba(236,200,197,0.50)',
                            boxShadow: '0 2px 8px rgba(217,167,160,0.10)',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background =
                              'rgba(236,200,197,0.35)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background =
                              'rgba(255,255,255,0.70)';
                          }}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ────────────────────────── */}
            <div
              className="p-3 shrink-0 flex flex-col gap-2"
              style={{
                background: 'rgba(255,255,255,0.60)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderTop: '1px solid rgba(236,200,197,0.22)',
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about services, pricing..."
                    disabled={isTyping}
                    className="w-full text-[13px] text-[#2A2424] placeholder:text-[#2A2424]/35 pr-10 pl-4 py-2.5 rounded-full focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(217,167,160,0.35)',
                      boxShadow: 'inset 0 1px 4px rgba(42,36,36,0.05)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(217,167,160,0.70)';
                      e.currentTarget.style.boxShadow =
                        'inset 0 1px 4px rgba(42,36,36,0.05), 0 0 0 3px rgba(236,200,197,0.20)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(217,167,160,0.35)';
                      e.currentTarget.style.boxShadow =
                        'inset 0 1px 4px rgba(42,36,36,0.05)';
                    }}
                  />
                  <button
                    type="button"
                    title="Voice input (coming soon)"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9A7A0]/60 hover:text-[#D9A7A0] transition-colors cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      'linear-gradient(135deg, #D9A7A0 0%, #C58B82 100%)',
                    boxShadow: '0 4px 16px rgba(197,139,130,0.35)',
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.boxShadow =
                        '0 6px 20px rgba(197,139,130,0.50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(197,139,130,0.35)';
                  }}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>

              {/* Powered-by line */}
              <p className="text-center text-[9px] text-[#2A2424]/25 tracking-widest uppercase font-medium">
                Powered by Glow & Grace Hybrid AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Toggle Button ───────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className="pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full text-white cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #D9A7A0 0%, #C58B82 100%)',
          boxShadow:
            '0 8px 28px rgba(197,139,130,0.45), 0 2px 8px rgba(197,139,130,0.25)',
          border: '1.5px solid rgba(255,255,255,0.25)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open Glow AI Concierge'}
      >
        {/* Outer ping ring (only when closed) */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-50"
            style={{ background: 'rgba(236,200,197,0.6)' }}
          />
        )}

        {/* Notification dot */}
        <AnimatePresence>
          {hasNewMsg && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white z-10"
            />
          )}
        </AnimatePresence>

        {/* Icon swap */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
