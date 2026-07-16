import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";
import MenuItem from "./models/MenuItem.js";
import User from "./models/User.js";
import Blog from "./models/Blog.js";
import Testimonial from "./models/Testimonial.js";

dotenv.config();

const initialCategories = [
  "Sweets",
  "Beverages",
  "Ice Cream",
  "Restaurant",
  "Fast Food",
  "Chinese",
  "South Indian",
];

const initialMenuItems = [
  // ================= 40 SWEETS FROM USER LIST =================
  {
    name: "Gulab Jamun",
    description: "Golden fried milk-solid dumplings soaked in warm cardamom-infused sugar syrup. Price: ₹25-35/piece.",
    price: 30,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Rasgulla",
    description: "Soft cottage cheese balls soaked in light fragrant sugar syrup. Price: ₹20-30/piece.",
    price: 25,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: false,
    popular: true,
    available: true
  },
  {
    name: "Rasmalai",
    description: "Soft paneer discs served in rich saffron and pistachio-flavored milk. Price: ₹40-60/piece.",
    price: 50,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Kaju Katli",
    description: "Thin diamond-shaped cashew fudge with a smooth melt-in-mouth texture. Price: ₹900-1400/kg.",
    price: 1150,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Soan Papdi",
    description: "Crisp flaky sweet made with gram flour, sugar, and aromatic cardamom. Price: ₹300-500/kg.",
    price: 400,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: false,
    popular: false,
    available: true
  },
  {
    name: "Besan Laddu",
    description: "Roasted gram flour balls blended with pure ghee and nuts. Price: ₹400-600/kg.",
    price: 500,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: false,
    popular: true,
    available: true
  },
  {
    name: "Motichoor Laddu",
    description: "Tiny boondi pearls shaped into soft laddus with saffron aroma. Price: ₹450-700/kg.",
    price: 570,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Boondi Laddu",
    description: "Sweet gram flour pearls bound together with fragrant sugar syrup. Price: ₹350-550/kg.",
    price: 450,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: false,
    popular: false,
    available: true
  },
  {
    name: "Jalebi",
    description: "Crispy spiral-shaped sweet dipped in warm saffron sugar syrup. Price: ₹300-450/kg.",
    price: 370,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Imarti",
    description: "Thick crispy lentil swirls soaked in aromatic sugar syrup. Price: ₹400-600/kg.",
    price: 500,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Balushahi",
    description: "Flaky deep-fried pastry glazed with sweet sugar coating. Price: ₹350-500/kg.",
    price: 420,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Milk Cake",
    description: "Rich caramelized milk fudge with a soft grainy texture. Price: ₹500-700/kg.",
    price: 600,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Kalakand",
    description: "Fresh milk sweet delicately flavored with cardamom and pistachios. Price: ₹500-800/kg.",
    price: 650,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Peda",
    description: "Soft milk fudge infused with cardamom and rich dairy flavor. Price: ₹500-800/kg.",
    price: 650,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Cham Cham",
    description: "Soft cottage cheese sweet coated with coconut and flavored syrup. Price: ₹25-35/piece.",
    price: 30,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Sandesh",
    description: "Delicate Bengali cottage cheese sweet with subtle cardamom notes. Price: ₹25-40/piece.",
    price: 32,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Malpua",
    description: "Soft fried pancakes soaked in saffron-infused sugar syrup. Price: ₹40-60/piece.",
    price: 50,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Mysore Pak",
    description: "Rich gram flour and ghee fudge with a buttery melt-in-mouth texture. Price: ₹500-800/kg.",
    price: 650,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Coconut Barfi",
    description: "Sweet coconut fudge flavored with cardamom and fresh milk. Price: ₹450-700/kg.",
    price: 570,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Chocolate Barfi",
    description: "Creamy milk fudge layered with rich chocolate flavor. Price: ₹600-900/kg.",
    price: 750,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Plain Barfi",
    description: "Traditional milk fudge with a smooth creamy finish. Price: ₹450-700/kg.",
    price: 570,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Dry Fruit Barfi",
    description: "Premium milk fudge packed with crunchy mixed dry fruits. Price: ₹900-1600/kg.",
    price: 1250,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Anjeer Barfi",
    description: "Nutty fig-based fudge enriched with premium dry fruits. Price: ₹1000-1600/kg.",
    price: 1300,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Gajar Ka Halwa",
    description: "Slow-cooked carrots blended with milk, ghee, and crunchy nuts. Price: ₹450-700/kg.",
    price: 570,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Moong Dal Halwa",
    description: "Rich roasted lentil dessert cooked in pure ghee and milk. Price: ₹600-900/kg.",
    price: 750,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Badam Halwa",
    description: "Luxurious almond dessert with rich saffron and ghee flavor. Price: ₹800-1200/kg.",
    price: 1000,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Kheer",
    description: "Creamy rice pudding flavored with cardamom and dry fruits. Price: ₹80-150/bowl.",
    price: 110,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Rabri",
    description: "Thickened sweet milk delicately flavored with saffron and nuts. Price: ₹120-200/bowl.",
    price: 160,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Shahi Tukda",
    description: "Fried bread topped with rich rabri and crunchy dry fruits. Price: ₹120-180/plate.",
    price: 150,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Phirni",
    description: "Chilled creamy rice dessert infused with cardamom and saffron. Price: ₹80-150/bowl.",
    price: 110,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Basundi",
    description: "Rich reduced milk dessert garnished with almonds and pistachios. Price: ₹100-180/bowl.",
    price: 140,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Palkova",
    description: "Thick milk sweet slowly cooked to creamy perfection. Price: ₹500-700/kg.",
    price: 600,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Malai Roll",
    description: "Soft paneer roll filled with rich sweetened cream. Price: ₹40-60/piece.",
    price: 50,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Kesar Peda",
    description: "Traditional milk peda infused with premium saffron strands. Price: ₹600-900/kg.",
    price: 750,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Doda Barfi",
    description: "Rich Punjabi fudge made with milk, nuts, and caramelized sugar. Price: ₹700-1000/kg.",
    price: 850,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Patisa",
    description: "Crispy flaky North Indian sweet with a buttery finish. Price: ₹350-550/kg.",
    price: 450,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Chhena Murki",
    description: "Soft paneer cubes coated with a delicate sugar shell. Price: ₹500-700/kg.",
    price: 600,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Kesar Rasmalai",
    description: "Soft cottage cheese discs in rich saffron-flavored creamy milk. Price: ₹50-70/piece.",
    price: 60,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Kala Jamun",
    description: "Dark fried milk dumplings soaked in aromatic sugar syrup. Price: ₹25-35/piece.",
    price: 30,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },
  {
    name: "Khoya Roll",
    description: "Rich khoya rolls stuffed with premium dry fruits. Price: ₹600-900/kg.",
    price: 750,
    category: "Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    veg: true,
    available: true
  },

  // ================= BEVERAGES =================
  {
    name: "Mango Lassi",
    description: "Thick creamy yogurt drink blended with sweet Alphonso mangoes and nuts.",
    price: 90,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Special Masala Chai",
    description: "Traditional tea brewed with fresh milk, ginger, cardamom, and signature spices.",
    price: 30,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    available: true
  },
  {
    name: "Premium Cold Coffee",
    description: "Chilled espresso blend whipped with fresh cream and topped with vanilla ice cream scoop.",
    price: 110,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    veg: true,
    available: true
  },

  // ================= ICE CREAM =================
  {
    name: "Royal Kulfi Falooda Sundae",
    description: "Rich traditional dry fruit kulfi layered with vermicelli, sweet basil seeds, and rose syrup.",
    price: 160,
    category: "Ice Cream",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Double Chocolate Brownie Sundae",
    description: "Double chocolate fudge scoops served over hot sizzled brownie and chocolate syrup.",
    price: 180,
    category: "Ice Cream",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60",
    veg: true,
    available: true
  },

  // ================= RESTAURANT (Dine-In Main Course) =================
  {
    name: "Paneer Butter Masala",
    description: "Cubes of paneer cooked in a rich, creamy, and mildly sweet tomato-based gravy.",
    price: 249,
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },
  {
    name: "Special Veg Dum Biryani",
    description: "Fragrant basmati rice cooked with assorted fresh vegetables, spices, and mint in dum style.",
    price: 199,
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: false,
    popular: false,
    available: true
  },

  // ================= SOUTH INDIAN =================
  {
    name: "Masala Dosa",
    description: "Thin, crispy rice crepe filled with a spiced mashed potato stuffing, served with coconut chutney and hot sambar.",
    price: 149,
    category: "South Indian",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: true,
    popular: true,
    available: true
  },

  // ================= CHINESE =================
  {
    name: "Veg Hakka Noodles",
    description: "Stir-fried noodles with crisp cabbage, capsicum, carrots, soy sauce, and mild spices.",
    price: 169,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60",
    veg: true,
    bestseller: false,
    popular: true,
    available: true
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // 1. Wipe collections for fresh seeding
    console.log("Cleaning database collections...");
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Blog.deleteMany({});
    await Testimonial.deleteMany({});
    console.log("Database cleaned.");

    // 2. Seed Categories
    console.log("Seeding categories...");
    for (const catName of initialCategories) {
      await Category.create({ name: catName });
    }
    console.log("Categories seeded successfully.");

    // 3. Seed Menu Items
    console.log("Seeding menu items...");
    for (const item of initialMenuItems) {
      await MenuItem.create(item);
    }
    console.log("Menu items seeded successfully.");

    // 4. Seed Default Admin User
    console.log("Seeding admin account...");
    const adminEmail = "admin@anandvihar.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "Anand Vihar Admin",
        email: adminEmail,
        password: "adminpassword123",
        phone: "+919934190109",
        role: "admin",
        isVerified: true,
      });
      console.log("Admin account created successfully!");
    } else {
      console.log("Admin account already exists.");
    }

    // 5. Seed Blogs
    console.log("Seeding blogs...");
    const initialBlogs = [
      {
        title: "The Secrets of Perfect Ghee Kalakand",
        slug: "the-secrets-of-perfect-ghee-kalakand",
        category: "Recipes",
        content: "Kalakand is one of India's most beloved milk-based desserts. Originating from the northern belt, this crumbly milk cake is prepared using freshly curdled cottage cheese (chenna) and sweetened reduced milk. The secret to achieving the perfect crumbly yet moist texture lies in the heating control. Boiling milk too fast results in rubbery cheese granules, while low heat ensures that the cottage cheese absorbs the sweet milk cream slowly, retaining a melt-in-the-mouth texture. At Anand Vihar, our chefs curd daily batches using traditional copper pans to preserve this legendary taste.",
        author: admin._id,
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=60",
      },
      {
        title: "Sweets and Celebrations: The Heart of Indian Festivals",
        slug: "sweets-and-celebrations-the-heart-of-indian-festivals",
        category: "Sweets & Culture",
        content: "No Indian festival is complete without sweets. From Kaju Katlis during Diwali to Motichoor Ladoos during Ganesh Chaturthi, sweets represent luck, prosperity, and sharing joy. Confectioneries are considered sacred offerings (prasad) before gods, highlighting the spiritual significance of purity. Desi ghee sweets, prepared from pure cow milk fat, hold the highest status because ghee represents wealth and health. In this article, we trace the history of regional sweet crafts and why traditional sweets remain Jhumri Telaiya’s most trusted way of celebrating life's achievements.",
        author: admin._id,
        image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=800&auto=format&fit=crop&q=60",
      },
      {
        title: "Why Traditional Pure Ghee Sweets Rule Our Hearts",
        slug: "why-traditional-pure-ghee-sweets-rule-our-hearts",
        category: "Health & Diet",
        content: "In an era of modern baked cakes, traditional ghee-based sweets still hold an undefeated position in Indian households. Ghee is rich in fat-soluble vitamins and healthy fatty acids. When cooked with chickpea flour (in Soan Papdi or Besan Ladoo) or milk solids, pure cow ghee behaves as a natural preservative, keeping sweets fresh for weeks without any artificial chemical additives. This makes traditional sweets the perfect long-lasting gift for weddings, festive occasions, and family gatherings.",
        author: admin._id,
        image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=60",
      }
    ];

    for (const blog of initialBlogs) {
      await Blog.create(blog);
    }
    console.log("Blogs seeded successfully.");

    // 6. Seed Testimonials
    console.log("Seeding testimonials...");
    const initialTestimonials = [
      {
        name: "Suresh Kumar",
        city: "Jhumri Telaiya",
        rating: 5,
        review: "Anand Vihar's Kalakand is simply outstanding! It melts in your mouth instantly. Easily the best sweet shop in Jhumri Telaiya. Whenever we have guests, this is our go-to shop.",
        status: "approved",
        isFeatured: true,
        likes: ["192.168.1.1"]
      },
      {
        name: "Ritu Sharma",
        city: "Koderma",
        rating: 5,
        review: "We ordered 80 boxes of Kaju Katli and Kesar Peda for my brother's wedding. The packaging looked highly premium and the taste was pure and fresh. Every guest loved it!",
        status: "approved",
        isFeatured: true,
      },
      {
        name: "Aman Gupta",
        city: "Jharkhand",
        rating: 5,
        review: "The Mango Lassi and Royal Kulfi Falooda here are legendary! Highly hygienic prep areas, separate zones for sweets, and extremely polite staff. Five stars!",
        status: "approved",
        isFeatured: false,
      }
    ];

    for (const test of initialTestimonials) {
      await Testimonial.create(test);
    }
    console.log("Testimonials seeded successfully.");

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding process failed:", error);
    process.exit(1);
  }
};

seedData();
