import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ShoppingBag } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function Menu() {
  const { settings, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVariants, setSelectedVariants] = useState({});
  
  // Tag filters
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/menu/categories");
      if (res.data.success) {
        const catNames = res.data.categories.map(c => c.name);
        setCategories(["All", ...catNames]);
      }
    } catch (error) {
      console.error("Could not load categories:", error);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      let url = `/menu/items?search=${search}`;
      if (activeCategory !== "All") {
        url += `&category=${activeCategory}`;
      }
      if (vegOnly) url += "&veg=true";
      if (bestsellerOnly) url += "&bestseller=true";
      if (popularOnly) url += "&popular=true";
      if (newOnly) url += "&isNew=true";

      const res = await api.get(url);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (error) {
      console.error("Could not load menu items:", error);
      toast.error("Error loading menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [settings]);

  useEffect(() => {
    fetchMenuItems();
  }, [activeCategory, vegOnly, bestsellerOnly, popularOnly, newOnly, settings]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMenuItems();
  };

  const toggleVeg = () => setVegOnly(!vegOnly);
  const toggleBestseller = () => setBestsellerOnly(!bestsellerOnly);
  const togglePopular = () => setPopularOnly(!popularOnly);
  const toggleNew = () => setNewOnly(!newOnly);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setVegOnly(false);
    setBestsellerOnly(false);
    setPopularOnly(false);
    setNewOnly(false);
  };

  return (
    <main className="bg-[#FDFCFA] font-sans">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#FAF5EF]">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#ff9248]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#013e37]/10 blur-[150px]" />

        <div className="section py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="badge">
              <Sparkles size={16} />
              Our Menu
            </span>
            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-[#013e37] md:text-6xl">
              Discover Authentic
              <span className="text-[#ff9248]"> Flavours</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-600">
              Explore our carefully crafted collection of traditional Indian sweets, restaurant favourites, snacks, and beverages. Prepared fresh daily with premium ingredients.
            </p>
          </motion.div>

          {/* ================= SEARCH ================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mx-auto mt-12 max-w-3xl"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center rounded-full bg-white px-6 py-4 shadow-xl">
              <Search size={22} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search your favourite dish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-4 w-full bg-transparent text-lg outline-none placeholder:text-slate-400"
              />
              <button type="submit" className="hidden" />
            </form>
          </motion.div>

          {/* ================= CATEGORY FILTER ================= */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-7 py-3 text-base font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-[#ff9248] text-white shadow-lg"
                    : "bg-white text-[#013e37] shadow hover:bg-[#013e37] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= MENU GRID START ================= */}
      <section className="section-space py-16">
        <div className="section">
          {/* Subfilters bar */}
          <div className="mb-12 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#013e37]">Popular Dishes</h2>
              <p className="mt-3 text-slate-600">Showing {items.length} delicious items</p>
            </div>

            {/* Premium tag filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={toggleVeg}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border transition cursor-pointer ${
                  vegOnly ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-gray-500 border-gray-100"
                }`}
              >
                🟢 Veg Only
              </button>
              <button
                onClick={toggleBestseller}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border transition cursor-pointer ${
                  bestsellerOnly ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-white text-gray-500 border-gray-100"
                }`}
              >
                ⭐ Bestsellers
              </button>
              <button
                onClick={togglePopular}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border transition cursor-pointer ${
                  popularOnly ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-white text-gray-500 border-gray-100"
                }`}
              >
                🔥 Popular
              </button>
              <button
                onClick={toggleNew}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border transition cursor-pointer ${
                  newOnly ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-white text-gray-500 border-gray-100"
                }`}
              >
                ✨ New Arrivals
              </button>
            </div>
          </div>

          {/* Grid lists */}
          {loading ? (
            <div className="text-center py-24 text-gray-500 font-semibold">Loading menu items...</div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[32px] bg-white py-24 text-center shadow-lg border border-gray-100"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF4EB]">
                <Search size={30} className="text-[#ff9248]" />
              </div>
              <h3 className="mt-8 text-3xl font-bold text-[#013e37]">No Dishes Found</h3>
              <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500">
                We couldn't find any dishes matching the selected criteria. Try resetting the filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-8 rounded-full bg-[#ff9248] px-8 py-3 font-semibold text-white transition hover:scale-105 cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group overflow-hidden rounded-[28px] bg-white shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Bestseller badge */}
                    {item.bestseller && (
                      <span className="absolute left-4 top-4 rounded-full bg-[#ff9248] px-4 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                        Bestseller
                      </span>
                    )}

                    {/* New badge */}
                    {item.isNew && (
                      <span className="absolute right-4 top-4 rounded-full bg-[#013e37] px-4 py-1 text-[10px] font-bold uppercase text-[#ffefb3] shadow-sm">
                        New
                      </span>
                    )}

                    {/* Veg indicator badge */}
                    <div className="absolute bottom-4 left-4 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 shadow-sm">
                      <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                        🟢 {item.veg ? "Veg" : "Non-Veg"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                        <span className="text-[#ff9248]">{item.category}</span>
                        <span>Premium</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#013e37] leading-tight mb-2 group-hover:text-[#ff9248] transition">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                      {/* Weight Variant Pills */}
                      {item.variants && item.variants.length > 1 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.variants.map((v, vIdx) => {
                            const isSelected = (selectedVariants[item._id] || 0) === vIdx;
                            return (
                              <button
                                key={v.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedVariants(prev => ({ ...prev, [item._id]: vIdx }));
                                }}
                                className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#013e37] text-white border-[#013e37] shadow-sm"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-[#013e37]"
                                }`}
                              >
                                {v.weight}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-[#013e37]">
                        ₹{item.variants && item.variants.length > 0
                          ? item.variants[selectedVariants[item._id] || 0].price
                          : item.price}
                      </span>
                      {settings?.orderingEnabled ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              toast.error("Please login to buy sweets!");
                              navigate("/login");
                              return;
                            }
                            const activeVar = item.variants && item.variants.length > 0
                              ? item.variants[selectedVariants[item._id] || 0]
                              : null;
                            const success = await addToCart(item._id, 1, activeVar?.id);
                            if (success) {
                              toast.success(`Added ${item.name} (${activeVar?.weight || ""}) to cart!`);
                            } else {
                              toast.error("Failed to add to cart.");
                            }
                          }}
                          disabled={
                            item.variants && item.variants.length > 0
                              ? item.variants[selectedVariants[item._id] || 0].stock <= 0
                              : !item.available
                          }
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#ff9248] text-white text-xs font-bold rounded-2xl hover:bg-[#ea5a00] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg border-none whitespace-nowrap"
                        >
                          <ShoppingBag size={14} />
                          {(item.variants && item.variants.length > 0
                            ? item.variants[selectedVariants[item._id] || 0].stock <= 0
                            : !item.available)
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            (item.variants && item.variants.length > 0
                              ? item.variants[selectedVariants[item._id] || 0].stock > 0
                              : item.available)
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {(item.variants && item.variants.length > 0
                            ? item.variants[selectedVariants[item._id] || 0].stock > 0
                            : item.available)
                            ? "Available"
                            : "Sold Out"}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-[#FAF5EF] py-16">
        <div className="section">
          <div className="text-center mb-12">
            <span className="badge">Why Our Menu?</span>
            <h2 className="mt-4 subtitle">Every Dish Is Prepared With Care</h2>
            <p className="description mx-auto mt-4 max-w-xl text-gray-500">
              We combine fresh ingredients, authentic family recipes, and modern hygiene standards to deliver unforgettable taste.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Fresh Ingredients", desc: "Daily sourced premium handpicked ingredients.", icon: "🥗" },
              { title: "Authentic Taste", desc: "Traditional recipes with rich regional flavours.", icon: "🍛" },
              { title: "Hygienic Kitchens", desc: "Prepared following strict cleaning guidelines.", icon: "🏆" },
              { title: "Pure Veg Items", desc: "Separate designated sweet crafting zones.", icon: "🌱" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white p-8 rounded-3xl text-center shadow-sm border border-gray-55 hover:shadow-md transition"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF4EB] text-3xl">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16">
        <div className="section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[36px] bg-gradient-to-r from-[#013e37] to-[#045148] px-10 py-16 text-center text-white shadow-xl"
          >
            <span className="inline-flex rounded-full bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-[#ffefb3]">
              Anand Vihar Sweet Shop
            </span>
            <h2 className="mt-6 text-4xl font-extrabold md:text-5xl">Craving Something Delicious?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80">
              Explore our complete collection of traditional sweets. Visit near Jhanda Chowk to enjoy them fresh with your family!
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="rounded-full border border-white hover:bg-white hover:text-[#013e37] px-8 py-4 font-bold transition hover:scale-105 flex items-center justify-center text-center cursor-pointer no-underline text-white"
              >
                Get Directions / Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Menu;