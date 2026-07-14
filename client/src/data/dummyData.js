import Dish1 from "../assets/images/dish1.jpg";
import Dish2 from "../assets/images/dish2.jpg";
import Dish3 from "../assets/images/dish3.jpg";
import Dish4 from "../assets/images/dish4.jpg";

import Sweet1 from "../assets/images/sweet1.jpg";
import Sweet2 from "../assets/images/sweet2.jpg";
import Sweet3 from "../assets/images/sweet3.jpg";
import Sweet4 from "../assets/images/sweet4.jpg";

export const menuCategories = [
  "All",
  "Restaurant",
  "Sweets",
  "Fast Food",
  "Chinese",
  "South Indian",
  "Beverages",
];

export const menuItems = [

  {
    id: 1,
    name: "Paneer Butter Masala",
    category: "Restaurant",
    image: Dish1,
    price: 249,
    rating: 4.8,
    veg: true,
    bestseller: true,
    isNew: false,
  },

  {
    id: 2,
    name: "Veg Biryani",
    category: "Restaurant",
    image: Dish2,
    price: 199,
    rating: 4.7,
    veg: true,
    bestseller: false,
    isNew: true,
  },

  {
    id: 3,
    name: "Hakka Noodles",
    category: "Chinese",
    image: Dish3,
    price: 169,
    rating: 4.5,
    veg: true,
    bestseller: false,
    isNew: false,
  },

  {
    id: 4,
    name: "Masala Dosa",
    category: "South Indian",
    image: Dish4,
    price: 149,
    rating: 4.8,
    veg: true,
    bestseller: true,
    isNew: false,
  },

  {
    id: 5,
    name: "Kaju Katli",
    category: "Sweets",
    image: Sweet1,
    price: 620,
    rating: 5,
    veg: true,
    bestseller: true,
    isNew: false,
  },

  {
    id: 6,
    name: "Kalakand",
    category: "Sweets",
    image: Sweet2,
    price: 520,
    rating: 4.9,
    veg: true,
    bestseller: true,
    isNew: false,
  },

  {
    id: 7,
    name: "Rasgulla",
    category: "Sweets",
    image: Sweet3,
    price: 380,
    rating: 4.8,
    veg: true,
    bestseller: false,
    isNew: true,
  },

  {
    id: 8,
    name: "Gulab Jamun",
    category: "Sweets",
    image: Sweet4,
    price: 360,
    rating: 4.9,
    veg: true,
    bestseller: true,
    isNew: false,
  },

];