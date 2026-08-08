const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: 'secret',
    },
  });

  // Seed products
  const products = [
    { title: 'Sample Product A', description: 'Example product A', price: 9.99 },
    { title: 'Sample Product B', description: 'Example product B', price: 19.99 },
    { title: 'Sample Product C', description: 'Example product C', price: 29.99 },
    { title: 'Sample Product D', description: 'Another product D', price: 14.5 },
    { title: 'Sample Product E', description: 'Example product E', price: 5.0 }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { title: p.title },
      update: { description: p.description, price: p.price },
      create: p,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
