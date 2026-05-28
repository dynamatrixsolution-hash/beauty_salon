import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, Check, ArrowLeft, HelpCircle } from 'lucide-react';
import prisma from '@/lib/db';
import ServiceInquiryForm from '@/components/services/ServiceInquiryForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

type ServiceFaq = {
  question: string;
  answer: string;
};

function normalizeFaqs(value: unknown): ServiceFaq[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((faq) => {
      if (!faq || typeof faq !== 'object') {
        return null;
      }

      const item = faq as Record<string, unknown>;
      const question = typeof item.question === 'string' ? item.question : item.q;
      const answer = typeof item.answer === 'string' ? item.answer : item.a;

      if (typeof question !== 'string' || typeof answer !== 'string') {
        return null;
      }

      return {
        question: question.trim(),
        answer: answer.trim(),
      };
    })
    .filter((faq): faq is ServiceFaq => !!faq?.question && !!faq.answer);
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!service) {
    notFound();
  }

  // Parse benefits
  const benefitsList = service.benefits
    ? service.benefits.split('\n').filter((b: string) => b.trim() !== '')
    : [];

  // Parse FAQs
  let faqsList: ServiceFaq[] = [];
  try {
    faqsList = normalizeFaqs(service.faqs ? JSON.parse(service.faqs) : []);
  } catch (e) {
    console.error('Failed to parse service FAQs:', e);
  }

  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal/60 hover:text-brand-rosegold-dark mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Treatment Menu
        </Link>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-rosegold-dark">
                Signature {service.category.name} Ritual
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal leading-tight">
                {service.title}
              </h1>
            </div>

            {/* Primary Visual */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-brand-pink-accent/20">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-xl font-medium text-brand-charcoal border-b border-brand-pink-accent/20 pb-2">
                About the Ritual
              </h2>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">
                {service.description}
              </p>
            </div>

            {/* Benefits */}
            {benefitsList.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-serif text-xl font-medium text-brand-charcoal border-b border-brand-pink-accent/20 pb-2">
                  Treatment Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefitsList.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex gap-3 text-xs text-brand-charcoal/80 leading-relaxed items-start">
                      <div className="w-5 h-5 rounded-full bg-brand-pink-medium/60 text-brand-rosegold-dark flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqsList.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-serif text-xl font-medium text-brand-charcoal border-b border-brand-pink-accent/20 pb-2">
                  Frequently Asked Questions
                </h2>
                <div className="flex flex-col gap-4">
                  {faqsList.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-white/40 rounded-xl border border-brand-pink-accent/15 flex flex-col gap-2 text-left"
                    >
                      <h4 className="text-xs sm:text-sm font-semibold text-brand-charcoal flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-rosegold shrink-0" />
                        {faq.question}
                      </h4>
                      <p className="text-xs text-brand-charcoal/70 leading-relaxed font-light pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Sticky Panel Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6">
            {/* Booking Highlight */}
            <div className="bg-brand-charcoal text-brand-beige p-8 rounded-2xl shadow-md flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-rosegold/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center pb-4 border-b border-brand-beige/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-brand-beige/50 font-semibold">Treatment Duration</span>
                  <span className="font-serif text-base sm:text-lg text-white flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4.5 h-4.5 text-brand-rosegold" />
                    {service.duration} Minutes
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase tracking-wider text-brand-beige/50 font-semibold">Investment</span>
                  <span className="font-serif text-lg sm:text-2xl text-brand-rosegold font-bold mt-0.5">
                    NPR {service.pricing.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link href={`/book?service=${service.id}`} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink-accent to-brand-rosegold hover:from-brand-rosegold hover:to-brand-rosegold-dark text-brand-charcoal-dark font-semibold py-3.5 rounded-xl text-sm shadow-md transition-all duration-300 cursor-pointer">
                  <Calendar className="w-4 h-4" />
                  Instant Appointment Booking
                </button>
              </Link>
            </div>

            {/* Inquiry Form */}
            <ServiceInquiryForm serviceId={service.id} serviceTitle={service.title} />
          </div>

        </div>

      </div>
    </div>
  );
}
