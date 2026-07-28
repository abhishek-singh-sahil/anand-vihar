import { prisma } from './config/db.js';

async function test() {
  console.log('Testing Prisma cart query...');
  try {
    const cart = await prisma.cartItem.findMany({
      include: {
        product: true
      }
    });
    console.log('✔ Cart query successful! Items retrieved:', cart.length);
  } catch (err) {
    console.error('❌ Cart query failed:', err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
