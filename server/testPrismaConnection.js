import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({});

async function test() {
  console.log('Testing native Prisma connection with empty config object {}...');
  try {
    const settings = await prisma.setting.findMany();
    console.log('✔ Connection successful! Settings count:', settings.length);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
