import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const entries = [
  // ── General Info ──────────────────────────────────────────────────────────
  {
    question: 'Where is Glow & Grace Studio located?',
    answer:
      'We are located in Kathmandu, Nepal. You can contact us on WhatsApp for exact directions or Google Maps location assistance.',
    category: 'General Info',
    isPriority: true,
  },
  {
    question: 'Do you accept walk-in customers?',
    answer:
      'Yes, we accept walk-ins based on availability. However, we strongly recommend booking an appointment for a smoother experience.',
    category: 'General Info',
    isPriority: true,
  },

  // ── Bridal ────────────────────────────────────────────────────────────────
  {
    question: 'What is the price of bridal makeup?',
    answer:
      'Our bridal packages start from NPR 25,000, depending on styling, makeup type, and additional services like hair and draping.',
    category: 'Bridal',
    isPriority: true,
  },
  {
    question: 'Do you provide full bridal packages?',
    answer:
      'Yes ✨ We offer complete bridal packages including makeup, hairstyling, skincare prep, and consultation to create your perfect wedding look.',
    category: 'Bridal',
    isPriority: true,
  },
  {
    question: 'How early should I book bridal makeup?',
    answer:
      'We recommend booking your bridal appointment at least 2–4 weeks in advance to ensure availability and proper preparation.',
    category: 'Bridal',
    isPriority: true,
  },

  // ── Facial ────────────────────────────────────────────────────────────────
  {
    question: 'Which facial is best for glowing skin?',
    answer:
      'For glowing skin, we recommend our Hydra Facial + Vitamin C Glow Treatment, which deeply cleanses, hydrates, and brightens your skin.',
    category: 'Facial',
    isPriority: false,
  },
  {
    question: 'Do you offer acne treatment?',
    answer:
      'Yes, we offer customized acne treatment facials designed to reduce breakouts, control oil, and improve skin texture over time.',
    category: 'Facial',
    isPriority: false,
  },

  // ── Hair ──────────────────────────────────────────────────────────────────
  {
    question: 'Do you provide hair coloring?',
    answer:
      'Yes ✨ We offer professional hair coloring including balayage, highlights, global color, and root touch-ups using premium products.',
    category: 'Hair',
    isPriority: false,
  },
  {
    question: 'Do you offer hair spa treatments?',
    answer:
      'Yes, our hair spa treatments help repair damaged hair, improve shine, and deeply nourish the scalp.',
    category: 'Hair',
    isPriority: false,
  },
];

async function main() {
  console.log('🌸 Seeding AI Knowledge Base for Glow & Grace Studio...\n');

  let added = 0;
  let skipped = 0;

  for (const entry of entries) {
    // Check for duplicate question to keep idempotent
    // @ts-ignore
    const existing = await prisma.aIKnowledgeBase.findFirst({
      where: { question: { equals: entry.question } },
    });

    if (existing) {
      console.log(`  ⏭  Skipped (already exists): "${entry.question}"`);
      skipped++;
      continue;
    }

    // @ts-ignore
    await prisma.aIKnowledgeBase.create({ data: entry });
    console.log(`  ✅ Added [${entry.category}${entry.isPriority ? ' · PRIORITY' : ''}]: "${entry.question}"`);
    added++;
  }

  console.log(`\n✨ Done! ${added} added, ${skipped} already existed.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
