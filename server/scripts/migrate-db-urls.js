import { prisma } from "../config/db.js";

const getRelativePath = (str) => {
  if (!str) return str;
  const index = str.indexOf("/uploads/");
  if (index !== -1) {
    return str.substring(index); // Extract relative path starting with /uploads/
  }
  return str;
};

const runMigration = async () => {
  console.log("⏳ Connecting to database...");
  try {
    // 1. Migrate Banners
    console.log("⏳ Migrating Banners...");
    const banners = await prisma.banner.findMany();
    let bannerUpdates = 0;
    for (const b of banners) {
      const relative = getRelativePath(b.image);
      if (relative !== b.image) {
        await prisma.banner.update({ where: { id: b.id }, data: { image: relative } });
        bannerUpdates++;
      }
    }
    console.log(`✅ Migrated Banners: updated ${bannerUpdates} records.`);

    // 2. Migrate Categories
    console.log("⏳ Migrating Categories...");
    const categories = await prisma.category.findMany();
    let categoryUpdates = 0;
    for (const c of categories) {
      const relative = getRelativePath(c.image);
      if (relative !== c.image) {
        await prisma.category.update({ where: { id: c.id }, data: { image: relative } });
        categoryUpdates++;
      }
    }
    console.log(`✅ Migrated Categories: updated ${categoryUpdates} records.`);

    // 3. Migrate Products
    console.log("⏳ Migrating Products...");
    const products = await prisma.product.findMany();
    let productUpdates = 0;
    for (const p of products) {
      const relativeImage = getRelativePath(p.image);
      const relativeGallery = p.gallery ? p.gallery.map(getRelativePath) : [];
      let updated = false;
      const data = {};
      if (relativeImage !== p.image) {
        data.image = relativeImage;
        updated = true;
      }
      if (p.gallery && JSON.stringify(relativeGallery) !== JSON.stringify(p.gallery)) {
        data.gallery = relativeGallery;
        updated = true;
      }
      if (updated) {
        await prisma.product.update({ where: { id: p.id }, data });
        productUpdates++;
      }
    }
    console.log(`✅ Migrated Products: updated ${productUpdates} records.`);

    // 4. Migrate Testimonials
    console.log("⏳ Migrating Testimonials...");
    const testimonials = await prisma.testimonial.findMany();
    let testimonialUpdates = 0;
    for (const t of testimonials) {
      const relativeImages = t.images ? t.images.map(getRelativePath) : [];
      const relativeVideo = getRelativePath(t.video);
      let updated = false;
      const data = {};
      if (t.images && JSON.stringify(relativeImages) !== JSON.stringify(t.images)) {
        data.images = relativeImages;
        updated = true;
      }
      if (relativeVideo !== t.video) {
        data.video = relativeVideo;
        updated = true;
      }
      if (updated) {
        await prisma.testimonial.update({ where: { id: t.id }, data });
        testimonialUpdates++;
      }
    }
    console.log(`✅ Migrated Testimonials: updated ${testimonialUpdates} records.`);

    // 5. Migrate Blogs
    console.log("⏳ Migrating Blogs...");
    const blogs = await prisma.blog.findMany();
    let blogUpdates = 0;
    for (const b of blogs) {
      const relative = getRelativePath(b.image);
      if (relative !== b.image) {
        await prisma.blog.update({ where: { id: b.id }, data: { image: relative } });
        blogUpdates++;
      }
    }
    console.log(`✅ Migrated Blogs: updated ${blogUpdates} records.`);

    // 6. Migrate Gallery
    console.log("⏳ Migrating Gallery...");
    const galleryItems = await prisma.gallery.findMany();
    let galleryUpdates = 0;
    for (const item of galleryItems) {
      const relative = getRelativePath(item.image);
      if (relative !== item.image) {
        await prisma.gallery.update({ where: { id: item.id }, data: { image: relative } });
        galleryUpdates++;
      }
    }
    console.log(`✅ Migrated Gallery: updated ${galleryUpdates} records.`);

    // 7. Migrate Users
    console.log("⏳ Migrating Users profile photos...");
    const users = await prisma.user.findMany();
    let userUpdates = 0;
    for (const u of users) {
      const relative = getRelativePath(u.profilePic);
      if (relative !== u.profilePic) {
        await prisma.user.update({ where: { id: u.id }, data: { profilePic: relative } });
        userUpdates++;
      }
    }
    console.log(`✅ Migrated Users: updated ${userUpdates} records.`);

    console.log("🎉 Database URL migration finished successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

runMigration();
