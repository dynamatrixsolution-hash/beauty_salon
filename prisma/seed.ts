import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.user.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.staff.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.formTemplate.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.transformation.deleteMany({});

  // 2. Create Admin User
  const adminPassword = bcryptjs.hashSync('admin', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Glow & Grace Admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.email);

  // 3. Create Staff
  const staffMembers = [
    {
      name: 'Aayusha Shrestha',
      role: 'Stylist',
      specialization: 'Senior Hair Director & Styling Expert',
      experience: '8 Years',
      certifications: 'L\'Oréal Professionnel Color Certification, Toni&Guy Academy London',
      socials: 'instagram:https://instagram.com/aayusha_stylist,facebook:https://facebook.com/aayushashresthastyling',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      featured: true,
    },
    {
      name: 'Prajwal Giri',
      role: 'Stylist',
      specialization: 'Keratin & Creative Colorist Specialist',
      experience: '6 Years',
      certifications: 'Wella Master Color Expert, Olaplex Certified Stylist',
      socials: 'instagram:https://instagram.com/prajwal_hair,facebook:https://facebook.com/prajwalgiricuts',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
      featured: true,
    },
    {
      name: 'Neha Thapa',
      role: 'Stylist',
      specialization: 'Bridal Makeup Artist & Glow Specialist',
      experience: '7 Years',
      certifications: 'MAC Cosmetics Pro Academy, Kryolan Bridal Makeup Artistry',
      socials: 'instagram:https://instagram.com/neha_makeup_art,facebook:https://facebook.com/nehathapamakeup',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
      featured: true,
    },
    {
      name: 'Samikshya Adhikari',
      role: 'Stylist',
      specialization: 'Advanced Skincare & Nail Aesthetics Specialist',
      experience: '5 Years',
      certifications: 'CIDESCO International Skin Care Diploma, Shills Professional Nail Artistry',
      socials: 'instagram:https://instagram.com/samikshya_nails,facebook:https://facebook.com/samikshyaesthetician',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      featured: false,
    },
  ];

  for (const s of staffMembers) {
    await prisma.staff.create({ data: s });
  }
  console.log('Staff seeded.');

  // 4. Create Categories
  const categoryMap: Record<string, string> = {};
  const categoriesList = [
    { key: 'hair', name: 'Hair Services', order: 0 },
    { key: 'facial', name: 'Facial & Skin Care', order: 1 },
    { key: 'bridal', name: 'Makeup Services', order: 2 },
    { key: 'nails', name: 'Nail Services', order: 3 },
    { key: 'spa', name: 'Body Care', order: 4 },
    { key: 'skin', name: 'Skin Treatment', order: 5 },
    { key: 'eyebrow-lash', name: 'Eyebrow & Lash Services', order: 6 },
  ];

  for (const cat of categoriesList) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        order: cat.order,
      }
    });
    categoryMap[cat.key] = created.id;
  }
  console.log('Categories seeded.');

  // 5. Create Services
  const services = [
    {
      title: 'Premium Hair Styling',
      slug: 'hair-styling',
      description: 'Get the perfect cut, blow-dry, or customized hair styling designed to enhance your natural features and match your unique lifestyle. Includes luxury wash and scalp massage.',
      duration: 45,
      pricing: 1500,
      categoryKey: 'hair',
      benefits: 'Personalized styling consultation\nPremium organic shampoo & conditioning\nStress-relieving scalp massage\nLong-lasting professional blow-dry finish',
      faqs: JSON.stringify([
        { q: 'Does this service include a hair wash?', a: 'Yes, all our hair styling services include a luxurious wash, deep conditioning, and a relaxing scalp massage.' },
        { q: 'How long will the styling last?', a: 'A standard blow-dry and style lasts between 2 to 3 days depending on your hair type and care routine.' }
      ]),
      featured: true,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Balayage & Creative Coloring',
      slug: 'hair-coloring',
      description: 'Transform your hair with our signature hand-painted balayage, highlights, or full color changes. We use ultra-conditioning, low-ammonia formulas for rich, radiant color.',
      duration: 180,
      pricing: 6500,
      categoryKey: 'hair',
      benefits: 'Custom tone-matching assessment\nMinimal hair-damage protective bond builders used\nRich, multi-dimensional color reflection\nIncludes post-color hydration treatment',
      faqs: JSON.stringify([
        { q: 'What is the difference between highlights and balayage?', a: 'Balayage is a hand-painted technique that creates a soft, natural, sun-kissed gradient, whereas traditional highlights use foils from the roots down.' },
        { q: 'Is hair color damaging?', a: 'We use high-end low-ammonia colors infused with Plex bond builders to protect and strengthen your hair throughout the coloring process.' }
      ]),
      featured: true,
      image: 'https://images.unsplash.com/photo-1605497746444-12961b4777a0?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Hydra-Glow Signature Facial',
      slug: 'facial',
      description: 'Revitalize dull skin with our signature Korean-inspired hydrating facial. Combines ultrasonic exfoliation, vacuum extraction, and antioxidant serum infusion for immediate glass-skin results.',
      duration: 60,
      pricing: 3500,
      categoryKey: 'facial',
      benefits: 'Deep pore extraction and cleansing\nIntense hyaluronic moisture infusion\nImproves skin elasticity and texture\nIncludes facial lymphatic drainage massage',
      faqs: JSON.stringify([
        { q: 'Is there any downtime after the Hydra-Glow facial?', a: 'None! You will walk out with an immediate radiant glow. We recommend avoiding direct sunlight for 24 hours and wearing SPF.' },
        { q: 'How often should I get this facial?', a: 'For best results, we recommend booking a Hydra-Glow facial once every 4 weeks to maintain skin cell turnover and hydration.' }
      ]),
      featured: true,
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Royal Bridal Makeup',
      slug: 'bridal-makeup',
      description: 'Look breathtaking on your special day. Our luxury bridal package offers HD airbrush makeup, hair styling, veil setting, and jewelry placement for a flawless, photo-ready wedding look.',
      duration: 150,
      pricing: 15000,
      categoryKey: 'bridal',
      benefits: 'Custom consultation and trial session included\nWaterproof, 18-hour long-wear premium cosmetics\nFlawless HD airbrush finish\nVeil, jewelry drape, and floral styling assistance',
      faqs: JSON.stringify([
        { q: 'Do you offer on-site wedding day services?', a: 'Yes, our bridal makeup specialists can travel to your wedding venue or home for an additional styling fee.' },
        { q: 'Is a makeup trial session included in the package?', a: 'Yes! Every Royal Bridal Package includes a detailed 1-hour trial session scheduled 2 to 4 weeks before your wedding.' }
      ]),
      featured: true,
      image: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Luxury Gel Nail Art',
      slug: 'nail-art',
      description: 'Indulge in a premium manicure featuring shape styling, cuticle care, and custom hand-painted gel nail art using non-toxic, long-lasting Korean gel polishes.',
      duration: 60,
      pricing: 2000,
      categoryKey: 'nails',
      benefits: 'Nail strengthening base coat treatment\nCustom hand-painted art and embellishments\nChip-free wear for 3 to 4 weeks\nMoisturizing hand cream massage included',
      faqs: JSON.stringify([
        { q: 'How do I remove gel nails safely?', a: 'We highly recommend coming to the studio for professional gel removal to avoid stripping or damaging your natural nail beds.' },
        { q: 'Can I choose my own custom art design?', a: 'Absolutely! You can show our nail artists any design reference, and they will hand-paint it for you.' }
      ]),
      featured: false,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Aromatherapy Spa Massage',
      slug: 'spa-massage',
      description: 'Melt away stress and muscle tension. Our full-body massage uses organic warm oils and customized pressure to restore peace to your mind, body, and spirit.',
      duration: 90,
      pricing: 4000,
      categoryKey: 'spa',
      benefits: 'Relieves physical fatigue & muscle soreness\nPromotes blood circulation & flexibility\nInfused with calming lavender and eucalyptus oils\nIncludes hot towel foot compress',
      faqs: JSON.stringify([
        { q: 'Can I choose the pressure of my massage?', a: 'Yes. Our therapist will ask your preference (soft, medium, or deep tissue) before beginning.' },
        { q: 'Should I eat before a massage?', a: 'We recommend eating only a light snack and staying hydrated. Avoid heavy meals for at least 1 hour before your appointment.' }
      ]),
      featured: false,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Advanced Acne/Skin Treatment',
      slug: 'skin-treatment',
      description: 'Target skin concerns with our dermatologist-approved clinical treatments. Includes chemical peels, LED light therapy, and barrier repairing ampoules to heal and refine skin texture.',
      duration: 75,
      pricing: 4500,
      categoryKey: 'skin',
      benefits: 'Reduces active acne outbreaks\nFades hyperpigmentation and acne scars\nBoosts collagen production for firmer skin\nCustom chemical peel tailored to your skin type',
      faqs: JSON.stringify([
        { q: 'Is LED light therapy safe?', a: 'Yes, it is a non-invasive, UV-free treatment that targets acne-causing bacteria and reduces inflammation safely.' },
        { q: 'How many sessions will I need?', a: 'While you will see improvements after one session, we recommend a series of 4-6 treatments for acne clearance.' }
      ]),
      featured: true,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Lash Lift & Brow Lamination',
      slug: 'eyebrow-lash',
      description: 'Wake up with effortlessly groomed brows and lifted lashes. Brow lamination sets brow hairs into a full, neat shape, while the lash lift curls your natural lashes for a wide-eyed look.',
      duration: 75,
      pricing: 3000,
      categoryKey: 'eyebrow-lash',
      benefits: 'Saves time on daily makeup routine\nLashes appear longer and fuller naturally\nBrows look groomed, uniform and thick\nIncludes lash and brow deep conditioning tint',
      faqs: JSON.stringify([
        { q: 'How long does a lash lift last?', a: 'A lash lift and tint generally lasts 6 to 8 weeks, depending on your natural eyelash growth cycle.' },
        { q: 'What is the post-treatment care for brow lamination?', a: 'Keep your brows completely dry and avoid steam, swimming, or brow makeup for the first 24 hours.' }
      ]),
      featured: false,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Luxury Keratin Treatment',
      slug: 'keratin-treatment',
      description: 'Eliminate frizz and restore brilliant shine. Our advanced Keratin Infusion treatment seals protein into the hair shaft, leaving it sleek, straight, and manageable for months.',
      duration: 150,
      pricing: 7500,
      categoryKey: 'hair',
      benefits: 'Eliminates 90% of hair frizz\nCuts styling and blow-drying time in half\nStrengthens damaged hair fibers\nSilky, smooth finish lasting up to 4 months',
      faqs: JSON.stringify([
        { q: 'Can I wash my hair immediately after the treatment?', a: 'We recommend waiting 72 hours before washing your hair or using hair ties to let the keratin set.' },
        { q: 'Is this treatment suitable for color-treated hair?', a: 'Yes! In fact, it locks in color and adds a glossy protective seal over colored hair.' }
      ]),
      featured: true,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Detoxifying Body Scrub & Spa',
      slug: 'spa-therapy',
      description: 'Exfoliate and polish your body with our signature pink Himalayan salt and rose petal scrub. Completed with a warm botanical bath and deep hydration body butter application.',
      duration: 90,
      pricing: 5000,
      categoryKey: 'spa',
      benefits: 'Removes dead skin cells and detoxifies\nLeaves skin incredibly soft, smooth, and nourished\nCalms the nervous system through sensory aromas\nIncludes moisturizing rosewater body wrap',
      faqs: JSON.stringify([
        { q: 'Is the body scrub abrasive?', a: 'Our Himalayan salt is blended with organic botanical oils, offering gentle yet effective exfoliation.' },
        { q: 'Can I shave before the body scrub?', a: 'We recommend not shaving for at least 24 hours prior to the treatment to prevent salt from stinging sensitive skin.' }
      ]),
      featured: false,
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop',
    }
  ];

  let serviceOrder = 0;
  for (const s of services) {
    const { categoryKey, ...rest } = s;
    const catId = categoryMap[categoryKey] || categoryMap['hair'];
    await prisma.service.create({
      data: {
        ...rest,
        categoryId: catId,
        isActive: true,
        tags: [],
        order: serviceOrder++,
      },
    });
  }
  console.log('Services seeded.');

  // 6. Create Products
  const products = [
    {
      title: 'Glass Skin Radiance Serum',
      brand: 'Glow & Grace Professional',
      description: 'A revolutionary hydrating serum containing 5% Niacinamide, Rice Ferment filtrate, and Triple Hyaluronic Acid. Designed to give an intense glass-skin glow, fade dark spots, and fortify the moisture barrier.',
      ingredients: 'Rice Ferment Filtrate, Water, Niacinamide, Hyaluronic Acid, Centella Asiatica, Licorice Root Extract, Adenosine, Panthenol.',
      instructions: 'Apply 3-4 drops to cleansed, damp skin morning and night. Gently pat into the skin until fully absorbed. Follow with moisturizer.',
      recommendation: 'Perfect for skin showing signs of dehydration, dullness, or uneven tone. Highly recommended after chemical peels or facials to maintain moisture.',
      category: 'skincare',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop',
      featured: true,
    },
    {
      title: 'Argan & Marula Silk Hair Oil',
      brand: 'Moroccan Glow',
      description: 'An ultra-light, non-greasy hair serum infused with cold-pressed Moroccan Argan Oil and African Marula Oil. Seals split ends, tames wild frizz, and offers heat protection up to 230°C.',
      ingredients: 'Cyclopentasiloxane, Dimethicone, Cold-Pressed Argania Spinosa Kernel Oil, Marula Seed Oil, Fragrance, Vitamin E.',
      instructions: 'Rub 1-2 pumps between your palms. Apply evenly through damp hair from mid-lengths to ends before blow-drying. Apply a tiny amount to dry hair to tame flyaways.',
      recommendation: 'Excellent for dry, damaged, or color-treated hair. Our stylists use this at the end of every styling and blow-dry service.',
      category: 'haircare',
      image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=400&auto=format&fit=crop',
      featured: true,
    },
    {
      title: 'Luminous Silk Hydrating Primer',
      brand: 'Grace Beauty Pro',
      description: 'A luxury makeup base that blurs pores, smooths texture, and creates a soft-focus glow. Infused with rosewater and vitamin E to keep makeup locked in place and looking fresh for up to 16 hours.',
      ingredients: 'Water, Glycerin, Rosa Damascena Flower Water, Dimethicone Crosspolymer, Tocopherol, Caprylyl Glycol, Mica.',
      instructions: 'Smooth a pea-sized amount over clean, moisturized skin. Allow it to set for 60 seconds before applying foundation or concealer.',
      recommendation: 'Designed for bridal clients and photography makeups. Prevents makeup from dry-patching and creates a beautiful glowing canvas.',
      category: 'makeup',
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=400&auto=format&fit=crop',
      featured: false,
    },
    {
      title: 'Botanical Rose Body Oil',
      brand: 'Glow & Grace Spa',
      description: 'A nourishing body massage oil formulated with sweet almond oil, jojoba oil, and real rose petals. Quickly absorbs into skin, locking in hydration and leaving a delicate fragrance of fresh roses.',
      ingredients: 'Sweet Almond Oil, Jojoba Seed Oil, Rose Flower Oil, Dried Rose Petals, Rosehip Seed Oil, Sunflower Seed Oil.',
      instructions: 'Massage generously onto clean, damp skin after showering. Focus on dry areas like elbows, knees, and heels. Can also be added to a warm bath.',
      recommendation: 'Recommended for home body care after receiving our spa scrub treatments. Retains body suppleness and relieves skin dryness.',
      category: 'spa',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop',
      featured: false,
    },
    {
      title: 'Rose Quartz Gua Sha Tool',
      brand: 'Glow & Grace Tools',
      description: 'A premium, hand-carved rose quartz stone designed to relieve facial tension, reduce morning puffiness, sculpt jawlines, and boost product absorption through facial massage.',
      ingredients: '100% Authentic Hand-Polished Natural Rose Quartz Crystal.',
      instructions: 'Apply a face oil or serum first. Hold the tool flat against the skin (15-degree angle) and sweep outwards and upwards along the neck, jawline, cheeks, and forehead.',
      recommendation: 'Pair this tool with our Glass Skin Serum. Sweep daily for 5 minutes in the morning to drain lymphatic fluid and sculpt the face.',
      category: 'tools',
      image: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=400&auto=format&fit=crop',
      featured: true,
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log('Products seeded.');

  // 7. Create Reviews
  const reviews = [
    {
      customerName: 'Prerna Thapa',
      rating: 5,
      serviceType: 'Balayage & Creative Coloring',
      text: 'I am in love with my new balayage! Aayusha is absolute magic with hair colors. The studio is gorgeous, the service feels so premium, and my hair actually feels healthier after coloring!',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      status: 'approved',
    },
    {
      customerName: 'Shreeya Bajracharya',
      rating: 5,
      serviceType: 'Royal Bridal Makeup',
      text: 'Neha and her team styled me for my wedding day and it was flawless. The airbrush makeup was so lightweight and lasted through 12 hours of rituals. Highly recommend their bridal packages!',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
      status: 'approved',
    },
    {
      customerName: 'Monika Pandey',
      rating: 5,
      serviceType: 'Hydra-Glow Signature Facial',
      text: 'My skin has never felt this hydrated. The Korean skincare products and the facial massage by Samikshya are pure heaven. I have already booked my next appointment.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      status: 'approved',
    }
  ];

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }
  console.log('Reviews seeded.');

  // 8. Create Blog Posts
  const blogPosts = [
    {
      title: '5 Steps to Achieve the Korean Glass Skin Look At Home',
      slug: 'korean-glass-skin-steps',
      content: `The "Glass Skin" trend originates from Korea and refers to skin that is exceptionally smooth, even-toned, and hydrated, giving it a translucent, glass-like appearance. While professional facials like our **Hydra-Glow Signature Facial** are the gold standard, maintaining it at home is essential. Here is a professional 5-step daily routine:

### 1. The Double Cleanse
To get glass skin, your pores must be completely clean. Start with an oil-based cleanser to melt away sebum, makeup, and sunscreen, followed by a gentle water-based foaming cleanser.

### 2. Hydrating Toner layering
Unlike harsh astringent toners, Korean toners focus on hydration. Pour a few drops onto your palms and press it into your face. Repeat this 2-3 times (the "7-skin" method modified) for deep hydration layers.

### 3. Apply the Hero: Niacinamide & Hyaluronic Acid Serum
Use a serum rich in Niacinamide (vitamin B3) and Hyaluronic Acid. Our [Glass Skin Radiance Serum](file:///e:/Salon/products) is specifically formulated with 5% Niacinamide and fermented rice water to brighten and plump the skin.

### 4. Lock it in with a Barrier Cream
Apply a nourishing moisturizer containing ceramides or centella asiatica. This locks the serums inside and strengthens your skin barrier against pollutants.

### 5. Never Skip Sunscreen
Sun damage destroys collagen and creates hyperpigmentation, immediately ruining the translucent glass effect. Apply a broad-spectrum SPF 50 every single morning.`,
      excerpt: 'Learn the professional skincare routine to get translucent, hydrated, and glowing skin at home using key serums and techniques.',
      category: 'skincare',
      author: 'Samikshya Adhikari',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
      published: true,
    },
    {
      title: 'Choosing the Perfect Bridal Makeup: HD vs Airbrush',
      slug: 'bridal-makeup-hd-vs-airbrush',
      content: `Planning a wedding in Nepal involves long hours, emotional moments, and bright flash photography. Choosing the right makeup technique is vital. Here is a detailed breakdown between HD and Airbrush makeup:

### What is HD Makeup?
HD (High Definition) makeup uses standard application tools (brushes, sponges) but relies on high-end, light-diffusing cosmetics. These products are formulated with micro-particles that blur imperfections without looking cakey on high-resolution cameras.

* **Pros:** Highly customizable, great for layering, easy to touch up, looks extremely natural.
* **Cons:** Can feel slightly heavier than airbrush, requires precise blending.

### What is Airbrush Makeup?
Airbrush makeup uses a specialized compressor gun that sprays a fine mist of liquid foundation over the face. It sits on top of the skin as a thin, uniform veil rather than being rubbed in.

* **Pros:** Exceptionally lightweight, completely waterproof and sweatproof, holds up to 18 hours, flawless velvety texture.
* **Cons:** Harder to touch up once set, can look dry on flakey skin if not prepped correctly.

### Our Recommendation
At **Glow & Grace Studio**, our **Royal Bridal Package** merges both! We prep the skin with premium primers, apply a thin base of HD concealer, and finish with Airbrush foundation for that flawless, tear-resistant wedding glow. We recommend booking a trial 3 weeks before to find what works best on your skin.`,
      excerpt: 'HD makeup or Airbrush? Compare the two popular bridal makeup options and choose the perfect one for your wedding day.',
      category: 'bridal',
      author: 'Neha Thapa',
      image: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=600&auto=format&fit=crop',
      published: true,
    },
    {
      title: 'How to Care for Your Hair After a Professional Keratin Treatment',
      slug: 'keratin-post-treatment-care',
      content: `A professional Keratin treatment is an investment that makes your hair sleek, glossy, and frizz-free. However, the longevity of your treatment (typically 3 to 5 months) depends heavily on your post-treatment care. Here are the cardinal rules from our hair director, Aayusha:

### 1. The Crucial 72-Hour Window
For the first 3 days (72 hours) after your treatment, the keratin is still bonding to your hair structure:
* **DO NOT** wash your hair or get it wet (no swimming, saunas, or heavy workouts).
* **DO NOT** use hair ties, clips, bobby pins, or tuck your hair behind your ears. Keep it completely straight and loose.
* If your hair accidentally gets wet or creased, blow-dry it immediately on low heat and run a flat iron over the area.

### 2. Switch to Sulfate-Free Products
Sulfates are harsh cleaning agents that strip away the keratin coating. You **must** switch to a sulfate-free and sodium chloride-free shampoo and conditioner. We recommend using our **Argan Nourishing Hair Oil** as a finish after washing.

### 3. Sleep on Silk or Satin
Cotton pillowcases create friction that ruffles the hair cuticle, leading to frizz and shortened treatment life. Sleep on a silk or satin pillowcase to let your hair glide smoothly.

### 4. Limit Heat Styling
Since the keratin treatment makes your hair naturally straight and quick to dry, minimize the use of hot flat irons. When you do blow-dry, always apply a heat-protectant serum.`,
      excerpt: 'Maximize the life of your keratin treatment with these essential post-treatment tips on shampooing, styling, and care.',
      category: 'haircare',
      author: 'Aayusha Shrestha',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
      published: true,
    }
  ];

  for (const b of blogPosts) {
    await prisma.blogPost.create({ data: b });
  }
  console.log('Blog posts seeded.');

  // 9. Create Transformations
  const transformations = [
    {
      title: 'Korean Hydra-Glow Facial',
      category: 'skin',
      desc: 'Targeting dry patches, dullness and fine lines with clinical-grade active serum infusions.',
      beforeImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
      afterImg: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
      beforeLabel: 'Dull Skin',
      afterLabel: 'Glass Skin Results',
    },
    {
      title: 'Ash Brown Balayage & Cut',
      category: 'hair',
      desc: 'Bespoke hand-painted highlights, restoring structural integrity with Plex bond builders.',
      beforeImg: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
      afterImg: 'https://images.unsplash.com/photo-1605497746444-12961b4777a0?q=80&w=600&auto=format&fit=crop',
      beforeLabel: 'Frizzy / Solid Tone',
      afterLabel: 'Seamless Balayage',
    },
    {
      title: 'Bridal HD Airbrush Makeup',
      category: 'makeup',
      desc: 'Flawless 18-hour waterproof finish, covering blemishes with lightweight light-diffusing base.',
      beforeImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
      afterImg: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=600&auto=format&fit=crop',
      beforeLabel: 'Natural Skin',
      afterLabel: 'Bridal Glamour',
    },
  ];

  for (const t of transformations) {
    await prisma.transformation.create({ data: t });
  }
  console.log('Transformations seeded.');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
