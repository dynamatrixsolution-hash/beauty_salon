import React from 'react';
import type { Metadata } from 'next';
import { Award, Sparkles } from 'lucide-react';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Team | Glow & Grace Studio',
  description:
    'Meet the salon specialists, stylists, therapists, and artists behind Glow & Grace Studio.',
};

export default async function TeamPage() {
  const teamMembers = await prisma.staff.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });

  return (
    <div className="bg-brand-beige min-h-screen pt-28 sm:pt-32">
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Our Team
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-brand-charcoal mt-4">
              Meet the specialists behind your glow.
            </h1>
            <p className="text-brand-charcoal/70 text-sm sm:text-base leading-7 mt-5 max-w-2xl">
              Every team member added from the admin panel appears here, with featured specialists
              shown first.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {teamMembers.length === 0 ? (
            <div className="border border-brand-pink-accent/25 bg-white/70 rounded-lg px-6 py-14 text-center">
              <p className="font-serif text-2xl text-brand-charcoal">No team members yet</p>
              <p className="text-sm text-brand-charcoal/60 mt-2">
                Add team members from the admin panel to publish them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {teamMembers.map((member) => (
                  <article
                    key={member.id}
                    className="bg-white/85 border border-brand-pink-accent/25 rounded-lg overflow-hidden flex flex-col shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-brand-pink-light/40 overflow-hidden">
                      <img
                        src={member.image || '/salonlogo.png'}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                      {member.featured && (
                        <div className="absolute top-3 left-3 bg-brand-rosegold text-brand-charcoal-dark text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col gap-5 flex-grow">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-brand-rosegold-dark font-semibold">
                          {member.role}
                        </p>
                        <h2 className="font-serif text-2xl text-brand-charcoal mt-1">
                          {member.name}
                        </h2>
                        {member.specialization && (
                          <p className="text-sm text-brand-charcoal/70 mt-2">
                            {member.specialization}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-brand-charcoal/65">
                        {member.experience && (
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>{member.experience} Experience</span>
                          </div>
                        )}
                        {member.certifications && (
                          <p className="text-xs leading-6">
                            <span className="font-semibold text-brand-charcoal">Certifications:</span>{' '}
                            {member.certifications}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
