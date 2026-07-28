import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("🚀 PostgreSQL Connected successfully via Prisma Pg Adapter");
  } catch (error) {
    console.error(`❌ PostgreSQL Connection Failed: ${error.message}`);
  }
};

export { prisma, connectDB as default };
