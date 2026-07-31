import { prisma } from "../config/db.js";

const checkDB = async () => {
  try {
    const galleryCount = await prisma.gallery.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const blogCount = await prisma.blog.count();
    const testimonialCount = await prisma.testimonial.count();
    const bannerCount = await prisma.banner.count();
    const userCount = await prisma.user.count();

    console.log(`Gallery count: ${galleryCount}`);
    console.log(`Product count: ${productCount}`);
    console.log(`Category count: ${categoryCount}`);
    console.log(`Blog count: ${blogCount}`);
    console.log(`Testimonial count: ${testimonialCount}`);
    console.log(`Banner count: ${bannerCount}`);
    console.log(`User count: ${userCount}`);

    const products = await prisma.product.findMany({ take: 3 });
    console.log("Products sample:", products.map(p => ({ id: p.id, name: p.name, image: p.image })));

    const categories = await prisma.category.findMany({ take: 3 });
    console.log("Categories sample:", categories.map(c => ({ id: c.id, name: c.name, image: c.image })));

    const blogs = await prisma.blog.findMany({ take: 3 });
    console.log("Blogs sample:", blogs.map(b => ({ id: b.id, title: b.title, image: b.image })));

  } catch (error) {
    console.error("Error reading database:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

checkDB();
