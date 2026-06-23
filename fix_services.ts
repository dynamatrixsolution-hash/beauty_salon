import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing existing services...');
  
  // Get a default category
  const category = await prisma.category.findFirst();
  if (!category) {
    console.log('No categories found. Cannot fix services.');
    return;
  }

  // In MongoDB, Prisma might fail to read records with missing required fields via findMany.
  // We can use the raw MongoDB operations to update them.
  // Prisma's updateMany might also fail if it tries to fetch them first or validate.
  // Let's try updateMany first.
  try {
    const rawResult = await prisma.$runCommandRaw({
      update: 'Service',
      updates: [
        {
          q: { categoryId: { $exists: false } },
          u: { $set: { categoryId: { $oid: category.id } } },
          multi: true
        }
      ]
    });
    console.log('Raw update result:', rawResult);
    
    const rawResult2 = await prisma.$runCommandRaw({
      update: 'Service',
      updates: [
        {
          q: { categoryId: null },
          u: { $set: { categoryId: { $oid: category.id } } },
          multi: true
        }
      ]
    });
    console.log('Raw update result 2:', rawResult2);

  } catch (error) {
    console.error('Error fixing services:', error);
  }
  
  console.log('Fix complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
