import { prisma } from "../config/db.js";

const checkDB = async () => {
  try {
    const categories = await prisma.category.findMany();
    console.log("All Categories in DB:", categories.map(c => ({ id: c.id, name: c.name, status: c.status })));
  } catch (error) {
    console.error("Error reading database:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

checkDB();
