'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for UI Concept
const MOCK_KNOWLEDGE_BASE = [
  {
    id: '1',
    question: "What is the starting price for bridal makeup?",
    answer: "Our Royal Bridal Packages begin at NPR 25,000, which includes a pre-wedding consultation, premium styling, and draping.",
    category: "Bridal",
    isPriority: true,
  },
  {
    id: '2',
    question: "Where are you located?",
    answer: "We are located at 3rd Floor, Luxury Hub, Durbarmarg (Opposite to Royal Palace), Kathmandu, Nepal.",
    category: "General Info",
    isPriority: true,
  },
  {
    id: '3',
    question: "Do you offer Korean Glass Skin facials?",
    answer: "Yes, our Korean Glass Skin Facial is our signature treatment starting at NPR 4,500. It deeply hydrates and brightens the skin.",
    category: "Facial",
    isPriority: true,
  },
  {
    id: '4',
    question: "How long does hair coloring take?",
    answer: "Depending on the technique (Balayage, Highlights, Global), hair coloring usually takes between 2 to 4 hours.",
    category: "Hair",
    isPriority: false,
  }
];

const CATEGORIES = ["All", "Bridal", "Hair", "Facial", "Pricing", "General Info"];

export default function AIKnowledgeBaseAdmin() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = MOCK_KNOWLEDGE_BASE.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <h1 className="font-serif text-3xl text-brand-charcoal">AI Knowledge Base</h1>
          </div>
          <p className="text-sm text-brand-charcoal/60">
            Manage predefined Q&A pairs to override the AI Concierge for critical salon information.
          </p>
        </div>
        <button className="bg-brand-charcoal hover:bg-brand-charcoal-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0">
          <Plus className="w-4 h-4" />
          Add Q&A Pair
        </button>
      </div>

      {/* Concept Notice */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>UI Concept Mode:</strong> This interface is a production-ready concept for managing hybrid AI responses. Adding database persistence and live OpenAI/Gemini routing requires backend API key configuration.
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-pink-accent/20 p-6 flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-pink-medium text-brand-charcoal-dark border border-brand-rosegold'
                    : 'bg-brand-beige text-brand-charcoal/60 border border-transparent hover:bg-brand-pink-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40" />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-brand-beige/50 border border-brand-pink-accent/30 rounded-lg text-sm text-brand-charcoal focus:outline-none focus:border-brand-rosegold focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-pink-accent/20">
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 w-1/3">Question Trigger</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-brand-charcoal/50">Admin Answer (Override)</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 text-center">Priority</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-brand-charcoal/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-pink-accent/10">
              {filteredData.map((item) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={item.id} 
                  className="hover:bg-brand-beige/30 transition-colors"
                >
                  <td className="py-4 pr-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-brand-charcoal">{item.question}</span>
                      <span className="inline-flex w-max px-2 py-0.5 bg-brand-pink-light rounded text-[10px] uppercase font-bold text-brand-rosegold-dark tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="text-sm text-brand-charcoal/80 leading-relaxed max-w-xl">
                      {item.answer}
                    </p>
                  </td>
                  <td className="py-4 text-center">
                    {item.isPriority ? (
                      <div className="inline-flex items-center gap-1 bg-brand-gold/10 text-brand-gold px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-brand-gold/20">
                        <ShieldCheck className="w-3 h-3" /> Override AI
                      </div>
                    ) : (
                      <span className="text-[10px] uppercase text-brand-charcoal/40 font-semibold tracking-wider">Standard</span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-brand-charcoal/40 hover:text-brand-rosegold hover:bg-brand-pink-light rounded-lg transition-colors cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-brand-charcoal/40 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-brand-charcoal/50 text-sm">
                    No Q&A pairs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
