import { prisma } from "./config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const initialCategories = [
  { name: "Traditional Sweets", description: "Delicious traditional dairy and flour sweets" },
  { name: "Milk Sweets", description: "Fresh milk, khoya and paneer based sweets" },
  { name: "Dry Fruit Sweets", description: "Premium cashew, almond and fig based sweets" },
  { name: "Gift Packs", description: "Assorted sweet boxes for corporate and family gifting" },
  { name: "Festival Specials", description: "Limited time traditional sweet creations" },
  { name: "Beverages", description: "Cooling lassis, shakes and traditional drinks" },
  { name: "Ice Cream", description: "Premium kulfis and sundae scoops" },
  { name: "Snacks", description: "Crispy namkeens and matching savories" }
];

const sweetsToSeed = [
  {
    name: "Gulab Jamun",
    description: "Golden fried milk-solid dumplings soaked in warm cardamom-infused sugar syrup. Price: ₹25-35/piece.",
    price: 30.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Khoya, Paneer, Flour, Cardamom, Sugar Syrup",
    shelfLife: "3 Days",
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Rasgulla",
    description: "Soft cottage cheese balls soaked in light fragrant sugar syrup. Price: ₹20-30/piece.",
    price: 25.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Chhena (Cottage Cheese), Sugar, Water",
    shelfLife: "2 Days",
    isBestSeller: false,
    isFeatured: true
  },
  {
    name: "Rasmalai",
    description: "Soft paneer discs served in rich saffron and pistachio-flavored milk. Price: ₹40-60/piece.",
    price: 50.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Milk, Chhena, Saffron, Pistachio, Cardamom",
    shelfLife: "1 Day",
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Kaju Katli",
    description: "Thin diamond-shaped cashew fudge with a smooth melt-in-mouth texture. Price: ₹900-1400/kg.",
    price: 1150.0,
    categoryName: "Dry Fruit Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Cashew Nuts, Sugar, Ghee, Silver Leaf",
    shelfLife: "15 Days",
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Soan Papdi",
    description: "Crisp flaky sweet made with gram flour, sugar, and aromatic cardamom. Price: ₹300-500/kg.",
    price: 400.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Gram Flour, All Purpose Flour, Sugar, Ghee, Cardamom",
    shelfLife: "30 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Besan Laddu",
    description: "Roasted gram flour balls blended with pure ghee and nuts. Price: ₹400-600/kg.",
    price: 500.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Gram Flour, Desi Ghee, Sugar, Almonds",
    shelfLife: "20 Days",
    isBestSeller: false,
    isFeatured: true
  },
  {
    name: "Motichoor Laddu",
    description: "Tiny boondi pearls shaped into soft laddus with saffron aroma. Price: ₹450-700/kg.",
    price: 570.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Chickpea Flour Pearls, Sugar, Saffron, Cardamom, Pistachios",
    shelfLife: "7 Days",
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Boondi Laddu",
    description: "Sweet gram flour pearls bound together with fragrant sugar syrup. Price: ₹350-550/kg.",
    price: 450.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Gram Flour, Sugar Syrup, Melon Seeds",
    shelfLife: "10 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Jalebi",
    description: "Crispy spiral-shaped sweet dipped in warm saffron sugar syrup. Price: ₹300-450/kg.",
    price: 370.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Fermented Flour Batter, Ghee, Sugar Syrup, Saffron",
    shelfLife: "1 Day",
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Imarti",
    description: "Thick crispy lentil swirls soaked in aromatic sugar syrup. Price: ₹400-600/kg.",
    price: 500.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Black Gram (Urad Dal) Paste, Sugar, Cardamom",
    shelfLife: "2 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Balushahi",
    description: "Flaky deep-fried pastry glazed with sweet sugar coating. Price: ₹350-500/kg.",
    price: 420.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Refined Flour, Ghee, Yogurt, Sugar Syrup",
    shelfLife: "5 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Milk Cake",
    description: "Rich caramelized milk fudge with a soft grainy texture. Price: ₹500-700/kg.",
    price: 600.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Milk, Sugar, Citric Acid, Ghee",
    shelfLife: "10 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Kalakand",
    description: "Fresh milk sweet delicately flavored with cardamom and pistachios. Price: ₹500-800/kg.",
    price: 650.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Solidified Milk, Paneer, Sugar, Cardamom, Pistachios",
    shelfLife: "3 Days",
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Peda",
    description: "Soft milk fudge infused with cardamom and rich dairy flavor. Price: ₹500-800/kg.",
    price: 650.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Khoya, Sugar, Cardamom, Saffron",
    shelfLife: "10 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Cham Cham",
    description: "Soft cottage cheese sweet coated with coconut and flavored syrup. Price: ₹25-35/piece.",
    price: 30.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Chhena, Sugar Syrup, Coconut Flakes, Rose Water",
    shelfLife: "2 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Sandesh",
    description: "Delicate Bengali cottage cheese sweet with subtle cardamom notes. Price: ₹25-40/piece.",
    price: 32.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Fresh Chhena, Date Palm Jaggery/Sugar, Cardamom",
    shelfLife: "1 Day",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Malpua",
    description: "Soft fried pancakes soaked in saffron-infused sugar syrup. Price: ₹40-60/piece.",
    price: 50.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Flour, Fennel Seeds, Milk, Rabri, Ghee, Sugar Syrup",
    shelfLife: "2 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Mysore Pak",
    description: "Rich gram flour and ghee fudge with a buttery melt-in-mouth texture. Price: ₹500-800/kg.",
    price: 650.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Besan (Gram Flour), Pure Desi Ghee, Sugar",
    shelfLife: "15 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Coconut Barfi",
    description: "Sweet coconut fudge flavored with cardamom and fresh milk. Price: ₹450-700/kg.",
    price: 570.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Grated Coconut, Condensed Milk, Sugar, Cardamom",
    shelfLife: "7 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Chocolate Barfi",
    description: "Creamy milk fudge layered with rich chocolate flavor. Price: ₹600-900/kg.",
    price: 750.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Mawa (Khoya), Cocoa Powder, Sugar, Pistachios",
    shelfLife: "7 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Plain Barfi",
    description: "Traditional milk fudge with a smooth creamy finish. Price: ₹450-700/kg.",
    price: 570.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Khoya, Sugar, Rose Water",
    shelfLife: "7 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Dry Fruit Barfi",
    description: "Premium milk fudge packed with crunchy mixed dry fruits. Price: ₹900-1600/kg.",
    price: 1250.0,
    categoryName: "Dry Fruit Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Almonds, Pistachios, Cashews, Figs, Dates, Khoya",
    shelfLife: "14 Days",
    isBestSeller: true,
    isFeatured: false
  },
  {
    name: "Anjeer Barfi",
    description: "Nutty fig-based fudge enriched with premium dry fruits. Price: ₹1000-1600/kg.",
    price: 1300.0,
    categoryName: "Dry Fruit Sweets",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Premium Dried Figs, Cashews, Almonds, Pistachios, Ghee",
    shelfLife: "20 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Gajar Ka Halwa",
    description: "Slow-cooked carrots blended with milk, ghee, and crunchy nuts. Price: ₹450-700/kg.",
    price: 570.0,
    categoryName: "Festival Specials",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Red Carrots, Milk, Mawa, Ghee, Sugar, Cashews",
    shelfLife: "4 Days",
    isBestSeller: true,
    isFeatured: false
  },
  {
    name: "Moong Dal Halwa",
    description: "Rich roasted lentil dessert cooked in pure ghee and milk. Price: ₹600-900/kg.",
    price: 750.0,
    categoryName: "Festival Specials",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Split Yellow Moong Dal, Ghee, Milk, Sugar, Cardamom",
    shelfLife: "5 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Badam Halwa",
    description: "Luxurious almond dessert with rich saffron and ghee flavor. Price: ₹800-1200/kg.",
    price: 1000.0,
    categoryName: "Festival Specials",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Almond Paste, Pure Ghee, Sugar, Saffron, Cardamom",
    shelfLife: "10 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Kheer",
    description: "Creamy rice pudding flavored with cardamom and dry fruits. Price: ₹80-150/bowl.",
    price: 110.0,
    categoryName: "Beverages",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    weight: "Bowl",
    ingredients: "Basmati Rice, Condensed Milk, Cardamom, Almonds",
    shelfLife: "2 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Rabri",
    description: "Thickened sweet milk delicately flavored with saffron and nuts. Price: ₹120-200/bowl.",
    price: 160.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "Bowl",
    ingredients: "Reduced Creamy Milk, Saffron, Pistachio, Sugar",
    shelfLife: "2 Days",
    isBestSeller: true,
    isFeatured: false
  },
  {
    name: "Shahi Tukda",
    description: "Fried bread topped with rich rabri and crunchy dry fruits. Price: ₹120-180/plate.",
    price: 150.0,
    categoryName: "Festival Specials",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    weight: "Plate",
    ingredients: "Ghee Fried Bread, Thick Rabri, Saffron Syrup, Nuts",
    shelfLife: "1 Day",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Phirni",
    description: "Chilled creamy rice dessert infused with cardamom and saffron. Price: ₹80-150/bowl.",
    price: 110.0,
    categoryName: "Beverages",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    weight: "Bowl",
    ingredients: "Ground Rice, Milk, Cardamom, Rose Water, Saffron",
    shelfLife: "2 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Basundi",
    description: "Rich reduced milk dessert garnished with almonds and pistachios. Price: ₹100-180/bowl.",
    price: 140.0,
    categoryName: "Beverages",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "Bowl",
    ingredients: "Condensed Milk, Cardamom, Nutmeg, Pistachios",
    shelfLife: "3 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Palkova",
    description: "Thick milk sweet slowly cooked to creamy perfection. Price: ₹500-700/kg.",
    price: 600.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Slow Boiled Milk, Sugar",
    shelfLife: "5 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Malai Roll",
    description: "Soft paneer roll filled with rich sweetened cream. Price: ₹40-60/piece.",
    price: 50.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Paneer Sheet, Sweetened Clotted Cream (Malai), Pistachios",
    shelfLife: "1 Day",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Kesar Peda",
    description: "Traditional milk peda infused with premium saffron strands. Price: ₹600-900/kg.",
    price: 750.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Solid Milk Khoya, Premium Saffron, Cardamom, Sugar",
    shelfLife: "7 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Doda Barfi",
    description: "Rich Punjabi fudge made with milk, nuts, and caramelized sugar. Price: ₹700-1000/kg.",
    price: 850.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Sprouted Wheat, Milk, Sugar, Alum, Cocoa, Ghee, Mixed Nuts",
    shelfLife: "15 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Patisa",
    description: "Crispy flaky North Indian sweet with a buttery finish. Price: ₹350-550/kg.",
    price: 450.0,
    categoryName: "Traditional Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Besan, Flour, Sugar Syrup, Pure Ghee",
    shelfLife: "20 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Chhena Murki",
    description: "Soft paneer cubes coated with a delicate sugar shell. Price: ₹500-700/kg.",
    price: 600.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Cottage Cheese Cubes, Sugar Syrup, Rose Essence",
    shelfLife: "3 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Kesar Rasmalai",
    description: "Soft cottage cheese discs in rich saffron-flavored creamy milk. Price: ₹50-70/piece.",
    price: 60.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Milk, Saffron Strands, Pistachios, Cardamom, Sugar",
    shelfLife: "1 Day",
    isBestSeller: true,
    isFeatured: false
  },
  {
    name: "Kala Jamun",
    description: "Dark fried milk dumplings soaked in aromatic sugar syrup. Price: ₹25-35/piece.",
    price: 30.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    weight: "Piece",
    ingredients: "Paneer, Khoya, Sugar Syrup, Cardamom",
    shelfLife: "3 Days",
    isBestSeller: false,
    isFeatured: false
  },
  {
    name: "Khoya Roll",
    description: "Rich khoya rolls stuffed with premium dry fruits. Price: ₹600-900/kg.",
    price: 750.0,
    categoryName: "Milk Sweets",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    weight: "1 Kg",
    ingredients: "Khoya, Sugar, Almonds, Cashews, Cardamom, Pistachios",
    shelfLife: "7 Days",
    isBestSeller: false,
    isFeatured: false
  },
  
  // ================= BEVERAGES =================
  {
    name: "Special Mango Lassi",
    description: "Thick creamy yogurt drink blended with sweet Alphonso mangoes and nuts.",
    price: 90.0,
    categoryName: "Beverages",
    image: "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=500&auto=format&fit=crop&q=60",
    weight: "Glass",
    ingredients: "Yogurt, Mango Pulp, Sugar, Cardamom, Pistachios",
    shelfLife: "1 Day",
    isBestSeller: true,
    isFeatured: true
  },
  {
    name: "Chilled Badam Milk",
    description: "Cold milk drink flavored with almonds, saffron and cardamoms.",
    price: 80.0,
    categoryName: "Beverages",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    weight: "Glass",
    ingredients: "Milk, Almond Paste, Sugar, Saffron, Cardamom",
    shelfLife: "2 Days",
    isBestSeller: false,
    isFeatured: false
  }
];

const initialBlogs = [
  {
    title: "The Secrets of Perfect Ghee Kalakand",
    slug: "the-secrets-of-perfect-ghee-kalakand",
    category: "Recipes",
    content: "Kalakand is one of India's most beloved milk-based desserts. Originating from the northern belt, this crumbly milk cake is prepared using freshly curdled cottage cheese (chenna) and sweetened reduced milk. The secret to achieving the perfect crumbly yet moist texture lies in the heating control. Boiling milk too fast results in rubbery cheese granules, while low heat ensures that the cottage cheese absorbs the sweet milk cream slowly, retaining a melt-in-the-mouth texture. At Anand Vihar, our chefs curd daily batches using traditional copper pans to preserve this legendary taste.",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Sweets and Celebrations: The Heart of Indian Festivals",
    slug: "sweets-and-celebrations-the-heart-of-indian-festivals",
    category: "Sweets & Culture",
    content: "No Indian festival is complete without sweets. From Kaju Katlis during Diwali to Motichoor Ladoos during Ganesh Chaturthi, sweets represent luck, prosperity, and sharing joy. Confectioneries are considered sacred offerings (prasad) before gods, highlighting the spiritual significance of purity. Desi ghee sweets, prepared from pure cow milk fat, hold the highest status because ghee represents wealth and health. In this article, we trace the history of regional sweet crafts and why traditional sweets remain Jhumri Telaiya’s most trusted way of celebrating life's achievements.",
    image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Why Traditional Pure Ghee Sweets Rule Our Hearts",
    slug: "why-traditional-pure-ghee-sweets-rule-our-hearts",
    category: "Health & Diet",
    content: "In an era of modern baked cakes, traditional ghee-based sweets still hold an undefeated position in Indian households. Ghee is rich in fat-soluble vitamins and healthy fatty acids. When cooked with chickpea flour (in Soan Papdi or Besan Ladoo) or milk solids, pure cow ghee behaves as a natural preservative, keeping sweets fresh for weeks without any artificial chemical additives. This makes traditional sweets the perfect long-lasting gift for weddings, festive occasions, and family gatherings.",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=60",
  }
];

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

const initialSettings = [
  { key: "shopName", value: "Anand Vihar Sweet Shop", description: "Name of the sweet shop" },
  { key: "whatsappNumber", value: "+919934190109", description: "Primary WhatsApp checkout receiver number" },
  { key: "deliveryCharge", value: "40", description: "Flat shipping/delivery charge in Rupees" },
  { key: "freeDeliveryMinAmount", value: "500", description: "Minimum order value for free shipping" }
];

async function main() {
  console.log("Seeding database...");

  // Wipe tables
  await prisma.otpToken.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.productReview.deleteMany({});
  await prisma.productQuestion.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.blogComment.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.pinCodeZone.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Wiped old records.");

  // 1. Seed Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("adminpassword123", salt);
  const adminUser = await prisma.user.create({
    data: {
      name: "Anand Vihar Admin",
      email: "admin@anandvihar.com",
      password: passwordHash,
      phone: "+919934190109",
      role: "admin",
      isVerified: true
    }
  });
  console.log("Seeded admin user: admin@anandvihar.com / adminpassword123");

  // 2. Seed Categories
  const categoryMap = {};
  for (const cat of initialCategories) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        description: cat.description,
        slug: slug,
        metaTitle: `${cat.name} - Anand Vihar`,
        metaDescription: cat.description
      }
    });
    categoryMap[cat.name] = createdCat.id;
  }
  console.log("Seeded categories.");

  // 3. Seed Products & Variants
  for (const p of sweetsToSeed) {
    const categoryId = categoryMap[p.categoryName] || categoryMap["Traditional Sweets"];
    const productSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 5);
    
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        image: p.image,
        gallery: [p.image],
        slug: productSlug,
        metaTitle: `${p.name} - Anand Vihar Sweet Shop`,
        metaDescription: p.description.substring(0, 150),
        ingredients: p.ingredients || "",
        shelfLife: p.shelfLife || "",
        storageInstructions: "Store in a cool, dry place.",
        isPureVeg: true,
        fssaiNumber: "21123000000000",
        manufacturer: "Anand Vihar Sweet Shop",
        countryOfOrigin: "India",
        isBestSeller: p.isBestSeller || false,
        isFeatured: p.isFeatured || false,
        tags: [p.categoryName, "Fresh", "Traditional"],
        categories: {
          connect: { id: categoryId }
        }
      }
    });

    // Seed Variants for each sweet (e.g. 250g, 500g, 1kg)
    const basePrice = p.price;
    const isSweet = ["Traditional Sweets", "Milk Sweets", "Dry Fruit Sweets", "Gift Packs", "Festival Specials"].includes(p.categoryName);
    
    if (isSweet) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          weight: "250g",
          price: Math.round(basePrice * 0.3),
          stock: 100,
          sku: `${createdProduct.slug.substring(0, 5)}-250g`
        }
      });
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          weight: "500g",
          price: Math.round(basePrice * 0.55),
          stock: 80,
          sku: `${createdProduct.slug.substring(0, 5)}-500g`
        }
      });
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          weight: "1kg",
          price: basePrice,
          stock: 50,
          sku: `${createdProduct.slug.substring(0, 5)}-1kg`
        }
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          weight: p.weight || "Regular",
          price: basePrice,
          stock: 60,
          sku: `${createdProduct.slug.substring(0, 5)}-regular`
        }
      });
    }
  }
  console.log("Seeded sweets catalog products and variants.");

  // 4. Seed Blogs
  for (const blog of initialBlogs) {
    await prisma.blog.create({
      data: {
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        content: blog.content,
        image: blog.image,
        views: Math.floor(Math.random() * 200) + 50
      }
    });
  }
  console.log("Seeded blogs.");

  // 5. Seed Testimonials
  for (const test of initialTestimonials) {
    await prisma.testimonial.create({
      data: test
    });
  }
  console.log("Seeded testimonials.");

  // 6. Seed Settings
  for (const set of initialSettings) {
    await prisma.setting.create({
      data: set
    });
  }
  console.log("Seeded default settings.");

  // 7. Seed Pin Code Zones
  const defaultPinCodes = [
    { code: "825409", areaName: "Jhanda Chowk", deliveryCharge: 40.0, deliveryTime: "30-45 mins" },
    { code: "825410", areaName: "Near HDFC Bank", deliveryCharge: 50.0, deliveryTime: "30-45 mins" },
    { code: "825411", areaName: "Koderma Station", deliveryCharge: 70.0, deliveryTime: "45-60 mins" }
  ];
  for (const pin of defaultPinCodes) {
    await prisma.pinCodeZone.create({
      data: pin
    });
  }
  console.log("Seeded default PIN code zones.");

  // 8. Seed Offers
  const defaultOffers = [
    { title: "Festival Sweet Discount", description: "Get flat 10% off on premium sweets", type: "PERCENTAGE", value: 10.0, targetType: "CATEGORY" },
    { title: "Standard Order Discount", description: "Get flat 40 off on orders", type: "FLAT", value: 40.0, targetType: "ORDER" }
  ];
  for (const off of defaultOffers) {
    await prisma.offer.create({
      data: off
    });
  }
  console.log("Seeded default offers.");

  console.log("Database seeding finished successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
