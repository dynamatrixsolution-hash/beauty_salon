import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  'Facial & Skin Care',
  'Hair Services',
  'Makeup',
  'Nails',
  'Body Care',
  'Waxing/Threading',
  'Leg Services',
];

async function main() {
  console.log('Seeding categories...');
  for (let i = 0; i < defaultCategories.length; i++) {
    const categoryName = defaultCategories[i];
    await prisma.category.create({
      data: {
        name: categoryName,
        order: i,
      },
    });
    console.log(`Created category: ${categoryName}`);
  }
  console.log('Categories seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
