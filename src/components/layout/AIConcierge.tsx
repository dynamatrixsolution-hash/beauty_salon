'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, Bot, Loader2, Mic, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  type?: 'ai' | 'trusted' | 'fallback';
}

const SUGGESTED_ACTIONS = [
  "Bridal Packages 💍",
  "Facial Treatments ✨",
  "Hair Services 💇‍♀️",
  "Pricing 💰"
];

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: 'Welcome to Glow & Grace ✨ How may I help you today?',
      type: 'ai'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isAdminPath = pathname?.startsWith('/admin');

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Handle message send
  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI / Knowledge Base response routing (UI Concept Mock)
    setTimeout(() => {
      setIsTyping(false);
      let aiMsg: Message;
      
      if (text.toLowerCase().includes('pricing') || text.includes('💰')) {
        // Mock matching an Admin predefined Q&A
        aiMsg = { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          type: 'trusted',
          content: "Our signature hair services start at NPR 2,500, and our royal bridal packages begin at NPR 25,000. All prices include premium imported products and taxes." 
        };
      } else {
        // Mock standard AI generated response
        aiMsg = { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          type: 'ai',
          content: "I recommend our 'Korean Glass Skin Facial' for a beautiful glow! Would you like me to share more details about the procedure or help you book?" 
        };
      }
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  if (isAdminPath) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans pointer-events-none">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto w-[340px] h-[480px] bg-white/70 backdrop-blur-xl border border-brand-pink-accent/40 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 px-4 bg-white/50 backdrop-blur-md border-b border-brand-pink-accent/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-pink-medium/50 flex items-center justify-center border border-brand-pink-accent/50">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-rose-gold-gradient tracking-wide">
                    Glow AI Concierge ✨
                  </span>
                  <span className="text-[10px] text-emerald-600/80 uppercase tracking-widest font-bold">
                    Hybrid System Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2 max-w-full`}
                >
                  {msg.role === 'ai' && (
                    <div className="flex flex-col gap-1 shrink-0 mb-1">
                      {msg.type === 'trusted' ? (
                        <div className="w-6 h-6 rounded-full bg-brand-gold/10 border border-brand-gold/40 flex items-center justify-center">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-brand-pink-light border border-brand-pink-accent/30 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-brand-rosegold-dark" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    {msg.type === 'trusted' && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold pl-1">
                        Trusted Answer
                      </span>
                    )}
                    <div 
                      className={`text-sm px-4 py-2.5 rounded-2xl leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-brand-rosegold to-brand-rosegold-dark text-white rounded-br-sm shadow-sm'
                          : msg.type === 'trusted' 
                            ? 'bg-brand-beige/90 backdrop-blur-sm border border-brand-gold/30 text-brand-charcoal rounded-bl-sm shadow-md'
                            : 'bg-white/80 backdrop-blur-sm border border-brand-pink-accent/30 text-brand-charcoal rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-pink-light border border-brand-pink-accent/30 flex items-center justify-center shrink-0 mb-1">
                    <Sparkles className="w-3 h-3 text-brand-rosegold-dark" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-brand-pink-accent/30 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-brand-rosegold-dark/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-rosegold-dark/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-rosegold-dark/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input Area */}
            <div className="p-3 bg-white/60 backdrop-blur-md border-t border-brand-pink-accent/20 flex flex-col gap-3 shrink-0">
              
              {/* Quick Actions (Only show if latest message is AI) */}
              <AnimatePresence>
                {messages[messages.length - 1]?.role === 'ai' && !isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
                  >
                    {SUGGESTED_ACTIONS.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action)}
                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-brand-pink-light/80 border border-brand-pink-accent/40 text-[11px] text-brand-charcoal font-medium hover:bg-brand-pink-medium hover:border-brand-rosegold transition-colors cursor-pointer"
                      >
                        {action}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Field */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask AI or check pricing..."
                    className="w-full bg-white/80 border border-brand-pink-accent/40 rounded-full pl-4 pr-10 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rosegold shadow-inner"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-rosegold/60 hover:text-brand-rosegold transition-colors cursor-pointer">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-full bg-brand-rosegold hover:bg-brand-rosegold-dark disabled:bg-brand-rosegold/50 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand-rosegold to-brand-rosegold-dark text-white shadow-xl cursor-pointer group border border-white/20"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-brand-rosegold/40 animate-ping opacity-75"></span>
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="sparkles"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
