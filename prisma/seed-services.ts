import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ServiceSeed {
  title: string;
  description: string;
  duration: number;
  pricing: number;
  benefits: string;
  faqs: string;
  featured: boolean;
  image: string;
  tags: string[];
}

interface CategorySeed {
  name: string;
  order: number;
  services: ServiceSeed[];
}

const categoriesWithServices: CategorySeed[] = [
  {
    name: 'Facial & Skin Care',
    order: 1,
    services: [
      {
        title: 'Facial',
        description: 'Revitalize your skin with our signature facial treatment. Deep cleansing, exfoliation, and hydration tailored to your skin type for a radiant, glowing complexion.',
        duration: 60,
        pricing: 2500,
        benefits: 'Deep pore cleansing\nImproved skin texture\nReduced fine lines\nBoosted hydration\nRelaxation and stress relief',
        faqs: JSON.stringify([
          { question: 'How often should I get a facial?', answer: 'We recommend once every 4-6 weeks for optimal results.' },
          { question: 'Is there any downtime?', answer: 'No downtime — you can resume normal activities immediately.' }
        ]),
        featured: true,
        image: '/images/services/facial.jpg',
        tags: ['facial', 'skincare', 'glow', 'relaxation'],
      },
      {
        title: 'Hydra Facial',
        description: 'A multi-step skin treatment that cleanses, exfoliates, extracts, and hydrates. Uses patented technology to deliver intense moisture and nourishment for a dewy finish.',
        duration: 75,
        pricing: 5000,
        benefits: 'Intense hydration\nPore minimizing\nRemoves dead skin cells\nReduces hyperpigmentation\nInstant glow',
        faqs: JSON.stringify([
          { question: 'What makes Hydra Facial different from a regular facial?', answer: 'Hydra Facial uses vortex technology for deeper cleansing and infusion of serums into the skin.' },
          { question: 'Is it suitable for sensitive skin?', answer: 'Yes, Hydra Facial is gentle and suitable for all skin types.' }
        ]),
        featured: true,
        image: '/images/services/hydra-facial.jpg',
        tags: ['hydrafacial', 'hydration', 'skincare', 'glow'],
      },
      {
        title: 'BB Glow',
        description: 'A semi-permanent foundation treatment that gives your skin a flawless, luminous finish. Evens out skin tone and provides a natural, makeup-free look that lasts.',
        duration: 90,
        pricing: 7000,
        benefits: 'Even skin tone\nSemi-permanent coverage\nReduced dark spots\nNatural glow finish\nMinimal maintenance',
        faqs: JSON.stringify([
          { question: 'How long does BB Glow last?', answer: 'Results typically last 4-6 months with proper skincare.' },
          { question: 'How many sessions are needed?', answer: '2-4 sessions are recommended for best results.' }
        ]),
        featured: false,
        image: '/images/services/bb-glow.jpg',
        tags: ['bbglow', 'skincare', 'flawless', 'semi-permanent'],
      },
      {
        title: 'Micro Needling',
        description: 'A minimally invasive treatment that stimulates collagen production through tiny needles. Addresses acne scars, wrinkles, and uneven texture for smoother, firmer skin.',
        duration: 60,
        pricing: 6000,
        benefits: 'Collagen stimulation\nReduced acne scars\nImproved skin texture\nMinimized pores\nAnti-aging benefits',
        faqs: JSON.stringify([
          { question: 'Does micro needling hurt?', answer: 'A numbing cream is applied beforehand, so discomfort is minimal.' },
          { question: 'What is the recovery time?', answer: 'Mild redness may last 24-48 hours. Full recovery in 3-5 days.' }
        ]),
        featured: false,
        image: '/images/services/micro-needling.jpg',
        tags: ['microneedling', 'collagen', 'skincare', 'anti-aging'],
      },
    ],
  },
  {
    name: 'Hair Services',
    order: 2,
    services: [
      {
        title: 'Hair Cut',
        description: 'Precision cuts tailored to your face shape, hair texture, and personal style. From classic trims to trendy transformations, our expert stylists deliver the perfect cut.',
        duration: 45,
        pricing: 800,
        benefits: 'Personalized styling\nClean, sharp finish\nExpert consultation\nSuitable for all hair types\nIncludes wash and blow dry',
        faqs: JSON.stringify([
          { question: 'Do I need an appointment?', answer: 'Walk-ins are welcome, but appointments are recommended to avoid wait times.' },
          { question: 'Does the price include washing?', answer: 'Yes, the haircut includes a complimentary wash and basic styling.' }
        ]),
        featured: true,
        image: '/images/services/hair-cut.jpg',
        tags: ['haircut', 'styling', 'hair'],
      },
      {
        title: 'Blow Dry',
        description: 'Professional blow dry styling for smooth, voluminous, and salon-perfect hair. Choose from sleek straight, bouncy curls, or elegant waves.',
        duration: 30,
        pricing: 600,
        benefits: 'Voluminous finish\nLong-lasting style\nSmooth and frizz-free\nHeat protection applied\nMultiple style options',
        faqs: JSON.stringify([
          { question: 'How long does the blow dry last?', answer: 'A professional blow dry can last 2-3 days with proper care.' },
          { question: 'Can I choose the style?', answer: 'Absolutely! Our stylists will help you pick the perfect look.' }
        ]),
        featured: false,
        image: '/images/services/blow-dry.jpg',
        tags: ['blowdry', 'styling', 'hair', 'volume'],
      },
      {
        title: 'Hair Treatment',
        description: 'Deep conditioning and restorative treatments to repair damaged hair. Nourish, strengthen, and revive your locks with our premium hair care products.',
        duration: 60,
        pricing: 3000,
        benefits: 'Deep nourishment\nDamage repair\nReduced breakage\nImproved shine\nSofter, manageable hair',
        faqs: JSON.stringify([
          { question: 'Which treatment is right for me?', answer: 'Our stylist will assess your hair condition and recommend the best treatment.' },
          { question: 'How often should I get a hair treatment?', answer: 'Every 4-6 weeks for best results, depending on hair condition.' }
        ]),
        featured: false,
        image: '/images/services/hair-treatment.jpg',
        tags: ['hair-treatment', 'repair', 'conditioning', 'hair'],
      },
      {
        title: 'Hair Straightening',
        description: 'Achieve sleek, straight, and frizz-free hair with our professional straightening services. Long-lasting results using the latest keratin and rebonding techniques.',
        duration: 180,
        pricing: 8000,
        benefits: 'Frizz elimination\nLong-lasting straight hair\nSmooth and silky texture\nReduced styling time daily\nSafe, professional products',
        faqs: JSON.stringify([
          { question: 'How long does hair straightening last?', answer: 'Results typically last 4-6 months depending on hair type and care.' },
          { question: 'Will it damage my hair?', answer: 'We use premium products and techniques to minimize damage while achieving great results.' }
        ]),
        featured: true,
        image: '/images/services/hair-straightening.jpg',
        tags: ['straightening', 'keratin', 'rebonding', 'hair'],
      },
      {
        title: 'Hair Coloring',
        description: 'Express yourself with vibrant, dimensional color. From natural highlights to bold fashion colors, our colorists create stunning, personalized looks.',
        duration: 120,
        pricing: 5000,
        benefits: 'Customized color consultation\nPremium color products\nEven, vibrant results\nLong-lasting color\nDamage-minimizing techniques',
        faqs: JSON.stringify([
          { question: 'Will coloring damage my hair?', answer: 'We use high-quality, ammonia-free products to minimize damage.' },
          { question: 'How often do I need touch-ups?', answer: 'Root touch-ups are recommended every 4-6 weeks.' }
        ]),
        featured: false,
        image: '/images/services/hair-coloring.jpg',
        tags: ['coloring', 'highlights', 'hair-color', 'hair'],
      },
      {
        title: 'Nano Plastic',
        description: 'Advanced nanoplastia hair smoothing treatment that uses natural amino acids and proteins. Achieve smooth, shiny, and healthy hair without harsh chemicals.',
        duration: 150,
        pricing: 10000,
        benefits: 'Chemical-free smoothing\nNatural amino acid formula\nDeep repair and nourishment\nLong-lasting smoothness\nSuitable for all hair types',
        faqs: JSON.stringify([
          { question: 'What is nanoplastia?', answer: 'Nanoplastia is an advanced hair treatment using nano-molecular technology and natural ingredients to smooth and repair hair.' },
          { question: 'How long does the result last?', answer: 'Results typically last 4-6 months with proper aftercare.' }
        ]),
        featured: true,
        image: '/images/services/nano-plastic.jpg',
        tags: ['nanoplastic', 'smoothing', 'hair', 'treatment'],
      },
    ],
  },
  {
    name: 'Makeup Services',
    order: 3,
    services: [
      {
        title: 'Makeup',
        description: 'Professional makeup artistry for any occasion — from bridal to party to editorial. Our skilled artists enhance your natural beauty using premium products.',
        duration: 90,
        pricing: 5000,
        benefits: 'Professional-grade products\nCustomized to your skin tone\nLong-lasting wear\nSuitable for any occasion\nIncludes consultation',
        faqs: JSON.stringify([
          { question: 'Do you offer bridal makeup?', answer: 'Yes! We offer complete bridal packages including trials and day-of makeup.' },
          { question: 'Should I bring reference photos?', answer: 'Absolutely — reference images help us understand your desired look.' }
        ]),
        featured: true,
        image: '/images/services/makeup.jpg',
        tags: ['makeup', 'bridal', 'party', 'beauty'],
      },
    ],
  },
  {
    name: 'Body Care',
    order: 4,
    services: [
      {
        title: 'Body Treatment',
        description: 'Luxurious full-body treatments including scrubs, wraps, and massages. Detoxify, rejuvenate, and pamper your body for total relaxation and wellness.',
        duration: 90,
        pricing: 4000,
        benefits: 'Full body relaxation\nSkin detoxification\nImproved circulation\nDeep moisturization\nStress relief',
        faqs: JSON.stringify([
          { question: 'What does a body treatment include?', answer: 'Our body treatment includes exfoliation, a nourishing wrap, and a relaxing massage.' },
          { question: 'Is it suitable for sensitive skin?', answer: 'Yes, we use hypoallergenic products suitable for sensitive skin.' }
        ]),
        featured: false,
        image: '/images/services/body-treatment.jpg',
        tags: ['body', 'spa', 'massage', 'relaxation'],
      },
    ],
  },
  {
    name: 'Nail Services',
    order: 5,
    services: [
      {
        title: 'Nails',
        description: 'Complete nail care services including manicure, pedicure, gel nails, nail art, and extensions. Beautifully groomed nails crafted with precision and creativity.',
        duration: 60,
        pricing: 1500,
        benefits: 'Precision nail shaping\nCuticle care\nGel and polish options\nCreative nail art available\nHygienic tools and products',
        faqs: JSON.stringify([
          { question: 'Do you offer gel extensions?', answer: 'Yes, we offer gel, acrylic, and press-on nail extensions.' },
          { question: 'How long do gel nails last?', answer: 'Gel nails typically last 2-3 weeks with proper care.' }
        ]),
        featured: false,
        image: '/images/services/nails.jpg',
        tags: ['nails', 'manicure', 'pedicure', 'nail-art'],
      },
    ],
  },
  {
    name: 'Waxing / Threading',
    order: 6,
    services: [
      {
        title: 'Threading',
        description: 'Precise and gentle threading for eyebrows, upper lip, and face. Our skilled technicians shape your brows to perfection using traditional threading techniques.',
        duration: 15,
        pricing: 200,
        benefits: 'Precise hair removal\nGentle on skin\nNo chemicals used\nPerfect brow shaping\nQuick and effective',
        faqs: JSON.stringify([
          { question: 'Is threading painful?', answer: 'There may be mild discomfort, but it is generally less painful than waxing.' },
          { question: 'How long does threading last?', answer: 'Threading results typically last 3-4 weeks.' }
        ]),
        featured: false,
        image: '/images/services/threading.jpg',
        tags: ['threading', 'eyebrows', 'hair-removal'],
      },
    ],
  },
  {
    name: 'Leg Services',
    order: 7,
    services: [
      {
        title: 'Leg Service',
        description: 'Complete leg care treatments including waxing, scrubbing, and moisturizing. Achieve smooth, radiant legs with our professional leg care services.',
        duration: 45,
        pricing: 1000,
        benefits: 'Smooth, hair-free legs\nExfoliation and scrubbing\nDeep moisturization\nSilky soft finish\nLong-lasting results',
        faqs: JSON.stringify([
          { question: 'What is included in leg service?', answer: 'Our leg service includes waxing, exfoliation, and a hydrating moisturizer application.' },
          { question: 'How long do results last?', answer: 'Results typically last 3-4 weeks.' }
        ]),
        featured: false,
        image: '/images/services/leg-service.jpg',
        tags: ['legs', 'waxing', 'body-care'],
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clear existing services and categories
  console.log('🗑️  Clearing existing services and categories...');
  await prisma.service.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('✅ Cleared existing data.\n');

  for (const cat of categoriesWithServices) {
    console.log(`📁 Creating category: ${cat.name}`);
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        order: cat.order,
      },
    });

    for (const svc of cat.services) {
      const slug = generateSlug(svc.title);
      console.log(`   ➕ Adding service: ${svc.title} (slug: ${slug})`);
      await prisma.service.create({
        data: {
          title: svc.title,
          slug,
          description: svc.description,
          duration: svc.duration,
          pricing: svc.pricing,
          categoryId: category.id,
          isActive: true,
          featured: svc.featured,
          image: svc.image,
          benefits: svc.benefits,
          faqs: svc.faqs,
          tags: svc.tags,
          order: cat.services.indexOf(svc),
        },
      });
    }
    console.log('');
  }

  const totalCategories = await prisma.category.count();
  const totalServices = await prisma.service.count();
  console.log(`\n✅ Seeding complete!`);
  console.log(`   📁 ${totalCategories} categories created`);
  console.log(`   💆 ${totalServices} services created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
