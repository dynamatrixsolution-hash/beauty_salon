import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const data = {
  "Facial & Skin Care": [
    "Facial",
    "Hydra Facial",
    "BB Glow",
    "Micro Needling"
  ],
  "Hair Services": [
    "Hair Cut",
    "Blow Dry",
    "Hair Treatment",
    "Hair Straightening",
    "Hair Coloring",
    "Nano Plastic"
  ],
  "Makeup Services": [
    "Makeup"
  ],
  "Body Care": [
    "Body Treatment"
  ],
  "Nail Services": [
    "Nails"
  ],
  "Waxing / Threading": [
    "Threading"
  ],
  "Leg Services": [
    "Leg Service"
  ]
};

async function main() {
  console.log('Clearing existing services and categories...');
  await prisma.service.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Seeding exact categories and services...');
  
  let categoryOrder = 0;
  for (const [categoryName, services] of Object.entries(data)) {
    // Create category
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        order: categoryOrder++,
      }
    });

    // Create services for this category
    let serviceOrder = 0;
    for (const serviceName of services) {
      await prisma.service.create({
        data: {
          title: serviceName,
          slug: serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description: `Experience the best ${serviceName} with our professional staff.`,
          duration: 60, // Default 1 hour
          pricing: 1500, // Default price
          categoryId: category.id,
          benefits: 'Relaxation\nRejuvenation',
          faqs: '[]',
          tags: [],
          order: serviceOrder++,
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800', // Default placeholder image
          isActive: true,
          featured: false
        }
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
