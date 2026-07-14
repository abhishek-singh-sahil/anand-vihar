import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";
import MenuItem from "./models/MenuItem.js";
import User from "./models/User.js";

dotenv.config();

const initialCategories = [
  "Restaurant",
  "Sweets",
  "Fast Food",
  "Chinese",
  "South Indian",
  "Beverages",
];

const initialMenuItems = [
  {
    name: "Paneer Butter Masala",
    description: "Cubes of paneer cooked in a rich, creamy, and mildly sweet tomato-based gravy.",
    price: 249,
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    isNew: false,
  },
  {
    name: "Veg Biryani",
    description: "Fragrant basmati rice cooked with assorted vegetables, spices, and herbs in a dum style.",
    price: 199,
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: false,
    popular: false,
    isNew: true,
  },
  {
    name: "Hakka Noodles",
    description: "Stir-fried noodles with crisp vegetables, soy sauce, and aromatic Chinese spices.",
    price: 169,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: false,
    popular: true,
    isNew: false,
  },
  {
    name: "Masala Dosa",
    description: "Thin, crispy rice crepe filled with a spiced mashed potato stuffing, served with chutney and sambar.",
    price: 149,
    category: "South Indian",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    isNew: false,
  },
  {
    name: "Kaju Katli",
    description: "Premium quality diamond-shaped cashew fudge sweets crafted with pure silver leafing.",
    price: 620,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    isNew: false,
  },
  {
    name: "Kalakand",
    description: "Traditional soft, crumbly milk cake prepared from fresh cottage cheese and sweetened milk.",
    price: 520,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    isNew: false,
  },
  {
    name: "Rasgulla",
    description: "Soft, spongy cottage cheese balls soaked in a light, sweet sugar syrup.",
    price: 380,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60", // fallback
    veg: true,
    bestseller: false,
    popular: false,
    isNew: true,
  },
  {
    name: "Gulab Jamun",
    description: "Golden fried milk-solid dumplings soaked in warm cardamom infused sugar syrup.",
    price: 360,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60", // fallback
    veg: true,
    bestseller: true,
    popular: false,
    isNew: false,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // 1. Seed Categories
    console.log("Seeding categories...");
    for (const catName of initialCategories) {
      const exists = await Category.findOne({ name: catName });
      if (!exists) {
        await Category.create({ name: catName });
      }
    }
    console.log("Categories seeded successfully.");

    // 2. Seed Menu Items
    console.log("Seeding menu items...");
    for (const item of initialMenuItems) {
      const exists = await MenuItem.findOne({ name: item.name });
      if (!exists) {
        await MenuItem.create(item);
      }
    }
    console.log("Menu items seeded successfully.");

    // 3. Seed Default Admin User
    console.log("Seeding admin account...");
    const adminEmail = "admin@anandvihar.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "Anand Vihar Admin",
        email: adminEmail,
        password: "adminpassword123", // hashes automatically via User pre-save
        phone: "+919934190109",
        role: "admin",
        isVerified: true,
      });
      console.log("Admin account created successfully!");
      console.log("Credentials: admin@anandvihar.com / adminpassword123");
    } else {
      console.log("Admin account already exists.");
    }

    console.log("Seeding process completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
