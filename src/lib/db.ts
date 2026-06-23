import { PrismaClient } from '@prisma/client';

const mockCategories = [
  { id: '1', name: 'Hair Care', order: 1 },
  { id: '2', name: 'Skin Care', order: 2 },
  { id: '3', name: 'Nail Care', order: 3 },
  { id: '4', name: 'Spa & Body', order: 4 },
  { id: '5', name: 'Bridal', order: 5 },
];

const mockServices = [
  {
    id: 's1', title: 'Haircut & Styling', slug: 'haircut-styling', 
    description: 'Professional haircut and styling by expert stylists tailored to your face shape.',
    duration: 60, pricing: 1500, categoryId: '1', category: mockCategories[0],
    isActive: true, featured: true, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Fresh look\nHealthier hair\nBoosted confidence',
    faqs: '[]', tags: ['hair', 'styling', 'cut'], order: 1, formId: null
  },
  {
    id: 's2', title: 'Hair Coloring', slug: 'hair-coloring', 
    description: 'Premium hair coloring services using high-quality, damage-free products.',
    duration: 120, pricing: 4500, categoryId: '1', category: mockCategories[0],
    isActive: true, featured: false, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Vibrant color\nLong-lasting\nNourishing formula',
    faqs: '[]', tags: ['hair', 'color'], order: 2, formId: null
  },
  {
    id: 's8', title: 'Keratin Treatment', slug: 'keratin-treatment', 
    description: 'Frizz-free, smooth, and shiny hair with our premium keratin treatment.',
    duration: 180, pricing: 8000, categoryId: '1', category: mockCategories[0],
    isActive: true, featured: true, image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Smooth hair\nFrizz-free\nEasy to manage',
    faqs: '[]', tags: ['hair', 'keratin', 'treatment'], order: 3, formId: null
  },
  {
    id: 's3', title: 'Hydrating Facial', slug: 'hydrating-facial', 
    description: 'Deep cleansing and hydrating facial to rejuvenate your skin and restore glow.',
    duration: 45, pricing: 2500, categoryId: '2', category: mockCategories[1],
    isActive: true, featured: true, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Clear skin\nDeep hydration\nRelaxation',
    faqs: '[]', tags: ['skin', 'facial'], order: 1, formId: null
  },
  {
    id: 's7', title: 'Eyebrow Threading', slug: 'eyebrow-threading', 
    description: 'Precise and clean eyebrow shaping to enhance your facial features.',
    duration: 15, pricing: 300, categoryId: '2', category: mockCategories[1],
    isActive: true, featured: false, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Perfect shape\nClean look',
    faqs: '[]', tags: ['face', 'eyebrow', 'threading'], order: 2, formId: null
  },
  {
    id: 's4', title: 'Classic Manicure', slug: 'classic-manicure', 
    description: 'Nail shaping, cuticle care, and application of premium nail polish.',
    duration: 30, pricing: 800, categoryId: '3', category: mockCategories[2],
    isActive: true, featured: false, image: 'https://images.unsplash.com/photo-1519014816548-bf5fe459e36e?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Neat nails\nRelaxing hand massage',
    faqs: '[]', tags: ['nails', 'manicure'], order: 1, formId: null
  },
  {
    id: 's5', title: 'Gel Pedicure', slug: 'gel-pedicure', 
    description: 'Long-lasting gel polish application with a relaxing foot spa.',
    duration: 45, pricing: 1200, categoryId: '3', category: mockCategories[2],
    isActive: true, featured: false, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Long-lasting color\nSoft feet',
    faqs: '[]', tags: ['nails', 'pedicure', 'gel'], order: 2, formId: null
  },
  {
    id: 's6', title: 'Deep Tissue Massage', slug: 'deep-tissue-massage', 
    description: 'Relieve muscle tension and stress with a full body deep tissue massage.',
    duration: 60, pricing: 3500, categoryId: '4', category: mockCategories[3],
    isActive: true, featured: true, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Stress relief\nMuscle relaxation\nImproved circulation',
    faqs: '[]', tags: ['spa', 'massage', 'body'], order: 1, formId: null
  },
  {
    id: 's9', title: 'Bridal Makeup Package', slug: 'bridal-makeup-package', 
    description: 'Complete bridal makeup and styling package for your special day.',
    duration: 180, pricing: 15000, categoryId: '5', category: mockCategories[4],
    isActive: true, featured: true, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1000&auto=format&fit=crop',
    beforeAfterImage: null, benefits: 'Flawless look\nLong-lasting makeup\nProfessional styling',
    faqs: '[]', tags: ['bridal', 'makeup', 'wedding'], order: 1, formId: null
  }
];

const mockStaff = [
  {
    id: 'staff-1',
    name: 'Prerna Shrestha',
    role: 'Founder & CEO',
    specialization: '"Beauty is not just about appearances; it is an expression of inner grace and confidence. My vision is to create a sanctuary where every client feels empowered, radiant, and truly seen."',
    experience: '15+ Years',
    certifications: 'Advanced Aesthetics, Global Beauty Management',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'staff-2',
    name: 'Aisha Sharma',
    role: 'Head of Hair & Styling',
    specialization: 'Balayage & Color Correction',
    experience: '10 Years',
    certifications: 'L’Oréal Professional, Vidal Sassoon',
    image: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'staff-3',
    name: 'Dr. Maya Gurung',
    role: 'Head of Aesthetics & Skincare',
    specialization: 'Korean Glass Skin & Clinical Derma',
    experience: '8 Years',
    certifications: 'Certified Dermatologist, K-Beauty Expert',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'staff-4',
    name: 'Sara Karki',
    role: 'Senior Nail Artist',
    specialization: 'Nail Art & Gel Extensions',
    experience: '5 Years',
    certifications: 'OPI Certified',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'staff-5',
    name: 'Nina Thapa',
    role: 'Lead Makeup Artist',
    specialization: 'Bridal & Editorial Makeup',
    experience: '7 Years',
    certifications: 'MAC Pro, HD Bridal Makeup',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'staff-6',
    name: 'Rita Magar',
    role: 'Spa & Wellness Therapist',
    specialization: 'Deep Tissue & Shiatsu',
    experience: '12 Years',
    certifications: 'Certified Massage Therapist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    featured: false,
  }
];

const mockProducts = [
  {
    id: 'p1',
    title: 'Radiance Glow Serum',
    brand: 'Glow & Grace',
    description: 'A potent vitamin C serum that brightens and evens out skin tone while providing deep hydration.',
    ingredients: 'Vitamin C, Hyaluronic Acid, Aloe Vera Extract, Ferulic Acid',
    instructions: 'Apply 2-3 drops to clean, dry skin every morning before moisturizer.',
    recommendation: 'Perfect for all skin types, especially those looking to combat dullness.',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'p2',
    title: 'Argan Oil Hair Mask',
    brand: 'Silk Tresses',
    description: 'An intensive conditioning treatment that restores moisture, elasticity, and shine to damaged hair.',
    ingredients: 'Argan Oil, Keratin, Shea Butter, Coconut Oil',
    instructions: 'Apply to damp hair after shampooing. Leave on for 10-15 minutes, then rinse thoroughly.',
    recommendation: 'Use once a week to repair color-treated or heat-damaged hair.',
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'p3',
    title: 'Flawless Finish Foundation',
    brand: 'Lumière',
    description: 'A lightweight, buildable foundation that provides a natural, luminous finish that lasts all day.',
    ingredients: 'Aqua, Glycerin, Titanium Dioxide, Mineral Pigments, Vitamin E',
    instructions: 'Blend onto skin using a sponge or brush, starting from the center of the face outward.',
    recommendation: 'Excellent for achieving that highly sought-after "glass skin" look.',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'p4',
    title: 'Lavender Bath Salts',
    brand: 'Zen Wellness',
    description: 'Relaxing bath salts infused with essential oils to melt away stress and soothe tired muscles.',
    ingredients: 'Epsom Salt, Sea Salt, Lavender Essential Oil, Dried Lavender Buds',
    instructions: 'Add a handful to warm running bath water and soak for at least 20 minutes.',
    recommendation: 'Ideal for an at-home spa evening to promote deep sleep.',
    category: 'spa',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'p5',
    title: 'Rose Quartz Facial Roller',
    brand: 'Glow & Grace Tools',
    description: 'A dual-ended facial massage tool that promotes lymphatic drainage and reduces puffiness.',
    ingredients: '100% Natural Rose Quartz Stone, Rose Gold Hardware',
    instructions: 'Use after applying serum. Roll gently upwards and outwards across the face and neck.',
    recommendation: 'Keep it in the fridge for an extra cooling and depuffing effect in the morning.',
    category: 'tools',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'p6',
    title: 'Purifying Clay Mask',
    brand: 'Glow & Grace',
    description: 'A deep-cleansing bentonite clay mask that draws out impurities and minimizes pores.',
    ingredients: 'Bentonite Clay, Activated Charcoal, Tea Tree Oil',
    instructions: 'Apply an even layer to clean skin. Leave on for 10 minutes until dry, then rinse with warm water.',
    recommendation: 'Use 1-2 times a week. Great for oily or acne-prone skin.',
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'p7',
    title: 'Volumizing Sea Salt Spray',
    brand: 'Silk Tresses',
    description: 'A lightweight texturizing spray that gives your hair effortless, beachy waves and volume.',
    ingredients: 'Purified Water, Sea Salt, Aloe Vera, Seaweed Extract',
    instructions: 'Spritz evenly onto damp or dry hair. Scrunch with hands and let air dry or diffuse.',
    recommendation: 'Perfect for adding texture to fine or flat hair.',
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'p8',
    title: 'Velvet Matte Lipstick',
    brand: 'Lumière',
    description: 'A highly pigmented, long-wearing matte lipstick that never dries out your lips.',
    ingredients: 'Beeswax, Castor Oil, Vitamin E, Matte Pigments',
    instructions: 'Apply directly from the bullet or use a lip brush for precise edges.',
    recommendation: 'Our best-selling shade "Rosewood" is universally flattering.',
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'p9',
    title: 'Nourishing Body Butter',
    brand: 'Zen Wellness',
    description: 'An ultra-rich whipped body butter that melts into the skin, providing 24-hour hydration.',
    ingredients: 'Shea Butter, Cocoa Butter, Sweet Almond Oil, Vanilla Extract',
    instructions: 'Massage generously into skin, focusing on dry areas like elbows and knees.',
    recommendation: 'Apply right after a warm shower to lock in moisture.',
    category: 'spa',
    image: '/products/body_butter.png',
    featured: false,
  },
  {
    id: 'p10',
    title: 'Professional Makeup Brush Set',
    brand: 'Glow & Grace Tools',
    description: 'A 10-piece set of cruelty-free, ultra-soft brushes for face and eyes.',
    ingredients: 'Synthetic Taklon Bristles, Bamboo Handles',
    instructions: 'Use for applying liquid, cream, and powder products. Wash weekly with mild soap.',
    recommendation: 'The fluffy blending brush in this set is an absolute game changer for eyeshadow.',
    category: 'tools',
    image: '/products/makeup_brushes.png',
    featured: true,
  }
];

const mockTransformations = [
  {
    id: 't1',
    title: 'Signature Glass Skin Treatment',
    category: 'skin',
    desc: 'A comprehensive 6-week Korean hydration and exfoliation therapy targeting uneven texture and dullness. The result is a luminous, poreless, "glass skin" finish.',
    beforeImg: '/transformations/skin_before.png',
    afterImg: '/transformations/skin_after.png',
    beforeLabel: 'Before Therapy',
    afterLabel: 'After 6 Weeks',
    createdAt: new Date()
  },
  {
    id: 't2',
    title: 'Balayage & Keratin Revival',
    category: 'hair',
    desc: 'From dry, damaged, and brassy tones to a seamlessly blended, cool-toned balayage. Finished with a premium Keratin smoothing treatment for ultimate shine.',
    beforeImg: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=800&auto=format&fit=crop',
    beforeLabel: 'Damaged & Brassy',
    afterLabel: 'Sleek Balayage',
    createdAt: new Date()
  },
  {
    id: 't3',
    title: 'Luxury Bridal Elegance',
    category: 'makeup',
    desc: 'A complete bridal transformation focusing on a flawless, HD-ready base, soft romantic eyes, and a timeless updo. Designed to last over 12 hours.',
    beforeImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=800&auto=format&fit=crop',
    beforeLabel: 'Bare Canvas',
    afterLabel: 'Bridal Glamour',
    createdAt: new Date()
  }
];

const mockBlogPosts = [
  {
    id: 'b1',
    title: 'The Secret to Korean Glass Skin: A Step-by-Step Guide',
    slug: 'secret-to-korean-glass-skin',
    content: `# The Secret to Korean Glass Skin\n\nAchieving "glass skin"—that luminous, poreless, translucent complexion—is the ultimate beauty goal for many. But it doesn't happen overnight. It requires consistency, the right products, and a deep understanding of your skin's needs.\n\n## 1. Double Cleansing is Non-Negotiable\nStart with an oil-based cleanser to melt away sunscreen and sebum, followed by a gentle water-based cleanser to remove sweat and dirt.\n\n## 2. Exfoliate Wisely\nUse chemical exfoliants (AHA/BHA) rather than harsh physical scrubs to gently dissolve dead skin cells and reveal the fresh skin underneath.\n\n## 3. Hydrate, Hydrate, Hydrate\nLayering is key. Use a hydrating toner, followed by an essence, and seal it all in with a hyaluronic acid serum.\n\nBook our *Signature Glass Skin Treatment* at Glow & Grace Studio to jumpstart your journey to flawless skin!`,
    excerpt: 'Discover the ultimate routine to achieve that coveted luminous, poreless, and deeply hydrated glass skin look.',
    category: 'Skincare',
    author: 'Dr. Maya Gurung',
    image: '/blog/glass_skin.png',
    published: true,
    createdAt: new Date()
  },
  {
    id: 'b2',
    title: 'Why Keratin is the Ultimate Solution for Frizzy Hair',
    slug: 'why-keratin-is-ultimate-solution',
    content: `# The Magic of Keratin\n\nIf you struggle with frizzy, unmanageable hair, especially during humid weather, a Keratin treatment might be exactly what you need.\n\n## What is Keratin?\nKeratin is a structural protein that makes up your hair, skin, and nails. Over time, heat styling, coloring, and environmental damage can deplete your hair's natural keratin, leading to frizz and breakage.\n\n## The Treatment Process\nA professional Keratin treatment involves applying a specially formulated keratin solution to the hair, which is then sealed in using heat. This process fills in the porosity of your hair, smoothing the cuticle.\n\n### Benefits:\n- **Zero Frizz:** Enjoy perfectly smooth hair regardless of the weather.\n- **Reduced Styling Time:** Blow-drying takes half the time.\n- **Radiant Shine:** The treatment locks in moisture, giving your hair a glossy, magazine-ready finish.\n\nConsult with our expert stylists at Glow & Grace to see if Keratin is right for you.`,
    excerpt: 'Struggle with frizz? Learn how a professional Keratin treatment can completely transform your hair texture and save you hours of styling.',
    category: 'Hair Care',
    author: 'Aisha Sharma',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
    published: true,
    createdAt: new Date()
  },
  {
    id: 'b3',
    title: 'Bridal Beauty Timelines: When to Start Prepping Your Skin',
    slug: 'bridal-beauty-timelines',
    content: `# The Ultimate Bridal Prep Timeline\n\nYour wedding day is one of the most photographed days of your life. To ensure your makeup sits flawlessly, skin preparation needs to start months in advance.\n\n## 6 Months Before: The Foundation\nStart a consistent skincare routine. If you have concerns like acne or hyperpigmentation, this is the time to start professional treatments like chemical peels or laser therapy.\n\n## 3 Months Before: Intensive Hydration\nBegin incorporating regular facials. Our *Hydrating Facial* is perfect for deeply nourishing the skin. Do not introduce any harsh new active ingredients from this point on.\n\n## 1 Month Before: The Trial\nSchedule your hair and makeup trial. Bring photos of your dress, jewelry, and preferred makeup styles.\n\n## 1 Week Before: Gentle Prep\nFocus on hydration and gentle exfoliation. Avoid extractions or anything that could cause a breakout. Get your waxing and threading done now.\n\n## The Night Before: Rest and Relax\nApply a trusted, deeply hydrating sheet mask, drink plenty of water, and get a good night's sleep. Let the team at Glow & Grace handle the rest!`,
    excerpt: 'Planning your big day? Follow our comprehensive 6-month beauty timeline to ensure you walk down the aisle with a flawless, radiant glow.',
    category: 'Bridal',
    author: 'Prerna Shrestha',
    image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=800&auto=format&fit=crop',
    published: true,
    createdAt: new Date()
  },
  {
    id: 'b4',
    title: 'The Healing Power of Deep Tissue Massage',
    slug: 'healing-power-deep-tissue-massage',
    content: `# Beyond Relaxation\n\nWhen most people think of a spa day, they imagine soft music and gentle relaxation. However, a Deep Tissue Massage offers profound therapeutic benefits that go far beyond stress relief.\n\n## Releasing Chronic Tension\nDeep tissue massage focuses on realigning deeper layers of muscles and connective tissue. It is especially helpful for chronically tense and contracted areas such as stiff necks, low back tightness, and sore shoulders.\n\n## Improving Posture and Mobility\nBy breaking up scar tissue and muscle knots (adhesions), deep tissue massage can restore your natural range of motion. This makes it an essential treatment for athletes or anyone sitting at a desk all day.\n\n## The Aftercare\nIt is completely normal to feel a bit sore for a day or two after your session. We recommend drinking plenty of water to help flush out the toxins released from your muscles.\n\nBook a session with our expert therapist Rita to experience true muscle recovery.`,
    excerpt: 'Discover how regular massage therapy goes beyond relaxation to improve posture, circulation, and overall well-being.',
    category: 'Spa Wellness',
    author: 'Rita Magar',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
    published: true,
    createdAt: new Date()
  },
  {
    id: 'b5',
    title: 'Gel vs. Classic Polish: Which is Right for You?',
    slug: 'gel-vs-classic-polish',
    content: `# The Great Nail Debate\n\nStanding at the salon choosing your color is hard enough, but choosing between Gel and Classic Polish is a whole other dilemma. Here is our breakdown of which manicure style suits your lifestyle.\n\n## Classic Polish\nTraditional nail polish is easily applied and easily removed. \n\n**Best For:** Those who love to switch up their nail color frequently, or those taking a break from enhancements.\n**Longevity:** 3 to 7 days.\n\n## Gel Polish\nGel polish is cured under a UV or LED light, instantly drying the polish and creating a hard, protective shell.\n\n**Best For:** Busy professionals, vacations, and special events like weddings where chipping is not an option.\n**Longevity:** 2 to 3 weeks.\n\n## The Verdict\nIf you need longevity and instant dry time, Gel is the absolute winner. If you prefer low commitment and easy at-home removal, Classic is the way to go. \n\nVisit Sara at our nail bar for a flawless application, no matter which you choose!`,
    excerpt: 'Choosing the right manicure depends on your lifestyle. Here is our definitive guide to making your nails look fabulous for longer.',
    category: 'Nail Care',
    author: 'Sara Karki',
    image: '/blog/gel_vs_classic.png',
    published: true,
    createdAt: new Date()
  },
  {
    id: 'b6',
    title: '5 Essential Tips for a Flawless Everyday Makeup Look',
    slug: '5-essential-tips-everyday-makeup',
    content: `# Master the "No-Makeup" Look\n\nLooking polished doesn't have to take hours. The "no-makeup" makeup look is all about enhancing your natural features rather than covering them up. Here are 5 quick tips for busy mornings.\n\n## 1. Prep the Canvas\nMakeup always looks best on well-hydrated skin. Never skip your moisturizer and SPF.\n\n## 2. Spot Conceal\nInstead of a heavy foundation, use a lightweight, luminous concealer only where you need it (under the eyes, around the nose, and on blemishes).\n\n## 3. Cream Products are King\nSwap your powder blush and bronzer for cream formulas. They melt into the skin and give a natural, lit-from-within flush.\n\n## 4. Fluffy Brows\nUse a tinted brow gel to brush your eyebrow hairs upwards. This instantly lifts the face and makes you look more awake.\n\n## 5. Hydrated Lips\nFinish the look with a tinted lip balm or lip oil for a juicy, comfortable pout.\n\nLooking for personalized makeup lessons? Book a 1-on-1 session with our lead artist Nina.`,
    excerpt: 'Looking polished doesn\'t have to take hours. Master the "no-makeup" makeup look in under 10 minutes.',
    category: 'Makeup',
    author: 'Nina Thapa',
    image: '/blog/flawless_makeup.png',
    published: true,
    createdAt: new Date()
  }
];

const mockPrisma = new Proxy({}, {
  get: (target, prop) => {
    if (prop === '$connect' || prop === '$disconnect') {
      return async () => {};
    }
    
    return new Proxy({}, {
      get: (subTarget, subProp) => {
        return async (args?: any) => {
          if (subProp === 'findUnique' || subProp === 'findFirst') {
            if (prop === 'blogPost' && args?.where?.slug) {
              return mockBlogPosts.find(p => p.slug === args.where.slug) || null;
            }
            return null;
          }
          if (subProp === 'count') {
            if (prop === 'blogPost') return mockBlogPosts.length;
            return 0;
          }
          if (subProp === 'findMany') {
            if (prop === 'category') return mockCategories;
            if (prop === 'service') return mockServices;
            if (prop === 'staff') return mockStaff;
            if (prop === 'product') return mockProducts;
            if (prop === 'transformation') return mockTransformations;
            if (prop === 'blogPost') return mockBlogPosts;
          }
          if (subProp === 'create') {
            const data = args?.data || {};
            return {
              id: 'mock-id-' + Date.now(),
              ...data,
              // If it has nested creates (like appointment.customer.create), flatten them for the mock
              customer: data.customer?.create || { name: 'Guest', email: '', phone: '' },
              staff: data.staff?.create || null,
              createdAt: new Date(),
            };
          }
          if (subProp === 'update') {
            return { id: args?.where?.id || 'mock-id', ...args?.data };
          }
          return [];
        };
      }
    });
  }
});

const prisma = mockPrisma as unknown as PrismaClient;

export default prisma;
