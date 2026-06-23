'use client';

import React from 'react';
import { Award, Sparkles, Quote, Star, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamClientProps {
  founder: any;
  heads: any[];
  specialists: any[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

const lineVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: '100%', opacity: 1, transition: { duration: 1, ease: 'easeInOut' as const } }
};

export default function TeamClient({ founder, heads, specialists }: TeamClientProps) {
  return (
    <div className="bg-brand-beige min-h-screen pt-28 sm:pt-32 pb-32 overflow-x-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-brand-pink-light rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute top-96 right-10 w-72 h-72 bg-brand-rosegold/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />

      {/* Page Header */}
      <section className="pb-16 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest bg-white/50 backdrop-blur-sm border border-brand-pink-accent/20 px-5 py-2 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4" />
            Our Artisans
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl font-light text-brand-charcoal mt-8 tracking-tight">
            Meet the <span className="font-normal italic text-rose-gold-gradient relative">
              Specialists
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-rosegold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          </h1>
          <p className="text-brand-charcoal/60 text-base sm:text-lg leading-relaxed mt-6 max-w-2xl font-light">
            Behind every transformation is a dedicated artist. Discover the passion, expertise, and grace of the Glow & Grace family.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center relative w-full pt-4">
          
          {/* LEVEL 1: Founder / CEO */}
          {founder && (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={itemVariants}
              className="w-full max-w-4xl flex flex-col items-center relative z-20"
            >
              <article className="w-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_40px_-15px_rgba(206,177,159,0.3)] relative group">
                <div className="w-full md:w-5/12 relative min-h-[400px] md:min-h-full overflow-hidden">
                  <div className="absolute inset-0 bg-brand-charcoal/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
                  <img
                    src={founder.image || '/salonlogo.png'}
                    alt={founder.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                </div>

                <div className="w-full md:w-7/12 p-10 sm:p-14 flex flex-col justify-center relative">
                  <Quote className="absolute top-10 right-10 w-24 h-24 text-brand-rosegold/5 -rotate-12 pointer-events-none" />
                  
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-brand-rosegold-dark font-bold mb-2">
                      {founder.role}
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl text-brand-charcoal">
                      {founder.name}
                    </h2>
                  </div>

                  <div className="relative pl-6 border-l-2 border-brand-rosegold/30">
                    <p className="text-lg sm:text-xl text-brand-charcoal/80 leading-relaxed font-serif italic text-pretty">
                      {founder.specialization}
                    </p>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-6 pt-8 border-t border-brand-charcoal/5">
                    {founder.experience && (
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-charcoal/50 uppercase tracking-widest">
                        <Award className="w-4 h-4 text-brand-rosegold-dark" />
                        <span>{founder.experience}</span>
                      </div>
                    )}
                    {founder.certifications && (
                      <p className="text-xs leading-5 text-brand-charcoal/50 font-medium max-w-xs">
                        <span className="font-bold text-brand-charcoal/70">Certified:</span>{' '}
                        {founder.certifications}
                      </p>
                    )}
                  </div>
                </div>
              </article>

              {/* Vertical Organic Line Connector */}
              {(heads.length > 0 || specialists.length > 0) && (
                <div className="relative w-px h-24 sm:h-32 my-4 flex justify-center">
                  <motion.div 
                    variants={lineVariants}
                    className="absolute top-0 w-px bg-gradient-to-b from-brand-rosegold-dark via-brand-rosegold to-transparent origin-top"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-brand-rosegold bg-brand-beige" />
                </div>
              )}
            </motion.div>
          )}

          {/* LEVEL 2: Management / Head Stylists */}
          {heads.length > 0 && (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="w-full flex flex-col items-center relative z-10"
            >
              {/* Horizontal curved connector if multiple heads */}
              {heads.length > 1 && (
                <div className="w-full max-w-2xl relative h-12 -mt-12 mb-4 hidden md:block">
                  <svg className="w-full h-full text-brand-rosegold/30" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d="M50 0 L50 10 Q50 20 25 20 L0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M50 0 L50 10 Q50 20 75 20 L100 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>
              )}

              <div className={`grid grid-cols-1 md:grid-cols-${Math.min(heads.length, 3)} gap-8 lg:gap-12 w-full max-w-6xl`}>
                {heads.map((head) => (
                  <motion.article 
                    variants={itemVariants}
                    key={head.id} 
                    className="group relative bg-white/50 backdrop-blur-md border border-white/60 rounded-[2rem] p-3 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(206,177,159,0.4)] transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-brand-pink-light/40">
                      <div className="absolute inset-0 bg-brand-charcoal/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                      <img
                        src={head.image || '/salonlogo.png'}
                        alt={head.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      
                      {/* Floating Contact Badges */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                        <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-brand-charcoal flex items-center justify-center hover:bg-brand-rosegold hover:text-white transition-colors shadow-lg cursor-pointer">
                          <Star className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-brand-charcoal flex items-center justify-center hover:bg-brand-rosegold hover:text-white transition-colors shadow-lg cursor-pointer">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-8 pb-6 px-4 flex flex-col items-center text-center relative">
                      <div className="absolute -top-6 bg-white border border-brand-pink-accent/20 px-5 py-1.5 rounded-full shadow-sm z-20">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-brand-rosegold-dark">
                          {head.role}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl text-brand-charcoal group-hover:text-brand-rosegold-dark transition-colors">{head.name}</h3>
                      <p className="text-xs text-brand-charcoal/50 font-medium uppercase tracking-wider mt-2 max-w-[200px] leading-relaxed">
                        {head.specialization}
                      </p>
                      {head.experience && (
                        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-brand-charcoal/40 mt-5 border-t border-brand-charcoal/5 pt-4 w-full">
                          <Award className="w-3.5 h-3.5 text-brand-rosegold shrink-0" />
                          <span>{head.experience}</span>
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Vertical Line Connector to Level 3 */}
              {specialists.length > 0 && (
                <div className="relative w-px h-24 sm:h-32 my-8 flex justify-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="absolute top-0 w-px bg-gradient-to-b from-brand-rosegold/30 to-brand-rosegold/10 origin-top"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* LEVEL 3: Specialists / Artists */}
          {specialists.length > 0 && (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
              className="w-full flex flex-col items-center relative z-10"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-4 mb-16">
                <div className="w-12 h-px bg-brand-rosegold/30" />
                <h3 className="font-serif text-3xl text-brand-charcoal italic font-light">The Artists</h3>
                <div className="w-12 h-px bg-brand-rosegold/30" />
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 w-full max-w-7xl">
                {specialists.map((specialist) => (
                  <motion.article 
                    variants={itemVariants}
                    key={specialist.id} 
                    className="group flex flex-col items-center text-center"
                  >
                    <div className="relative w-40 h-40 mb-6">
                      {/* Animated dashed ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90 group-hover:rotate-90 transition-transform duration-1000 ease-in-out" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-rosegold/30" strokeDasharray="4 4" />
                      </svg>
                      
                      <div className="absolute inset-2 rounded-full overflow-hidden bg-brand-pink-light/30">
                        <div className="absolute inset-0 bg-brand-charcoal/20 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-700" />
                        <img
                          src={specialist.image || '/salonlogo.png'}
                          alt={specialist.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>
                    
                    <h4 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-rosegold transition-colors">{specialist.name}</h4>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-rosegold-dark mt-2">
                      {specialist.role}
                    </p>
                    <p className="text-xs text-brand-charcoal/50 mt-3 font-light leading-relaxed max-w-[200px]">
                      {specialist.specialization}
                    </p>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </div>
  );
}
