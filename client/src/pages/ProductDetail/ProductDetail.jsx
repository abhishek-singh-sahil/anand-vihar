import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FaStar, FaShoppingCart, FaChevronRight, FaMinus, FaPlus, FaCheckCircle, FaLock, FaCertificate, FaClock, FaBookOpen } from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);

  // Specifications tabs
  const [activeTab, setActiveTab] = useState("description");

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/menu/items/${id}`);
      if (res.data?.success && res.data.product) {
        const prod = res.data.product;
        setProduct(prod);
        setActiveImage(prod.image);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
        
        // Fetch related products of the same category
        if (prod.categories && prod.categories.length > 0) {
          const catId = prod.categories[0].id || prod.categories[0]._id;
          const relatedRes = await api.get(`/menu/items?category=${encodeURIComponent(catId)}&limit=5`);
          if (relatedRes.data?.success) {
            const filtered = (relatedRes.data.items || []).filter(item => item._id !== prod.id && item.id !== prod.id);
            setRelatedProducts(filtered);
          }
        }
      } else {
        toast.error("Product not found");
        navigate("/menu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product details");
      navigate("/menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // Scroll to top when product ID changes
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center font-sans text-gray-500">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-[#ff6b1a] rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-sm text-[#013e37]">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart!");
      navigate("/login");
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a variant option!");
      return;
    }

    try {
      const success = await addToCart(product.id, quantity, selectedVariant.id);
      if (success) {
        toast.success(`x${quantity} ${product.name} added to cart!`);
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  // Calculations
  const discountedPrice = selectedVariant 
    ? selectedVariant.price - (selectedVariant.discount || 0) 
    : 0;
  const totalPrice = discountedPrice * quantity;
  const savingAmount = selectedVariant?.discount ? selectedVariant.discount * quantity : 0;

  // Average Rating
  const reviewsList = product.reviews || [];
  const avgRating = reviewsList.length > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : "No reviews yet";

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-xs text-gray-400 font-bold mb-8">
        <Link to="/" className="hover:text-[#ff6b1a] transition">HOME</Link>
        <FaChevronRight size={8} />
        <Link to="/menu" className="hover:text-[#ff6b1a] transition">MENU</Link>
        <FaChevronRight size={8} />
        <span className="text-[#013e37] uppercase">{product.name}</span>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Images Gallery & Zoom */}
        <div className="space-y-4">
          <div 
            onClick={() => setIsZoomed(true)}
            className="bg-white rounded-3xl p-4 border border-[#FAF5EF] shadow-sm relative overflow-hidden group cursor-zoom-in aspect-square flex items-center justify-center"
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className="max-h-[500px] w-auto object-contain transition duration-500 group-hover:scale-105"
            />
            {product.isPureVeg && (
              <span className="absolute top-4 left-4 bg-green-50 border border-green-200 text-green-700 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                <span>PURE VEG</span>
              </span>
            )}
            {selectedVariant?.discount > 0 && (
              <span className="absolute top-4 right-4 bg-[#ff6b1a] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                SAVE ₹{selectedVariant.discount}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <div 
                onClick={() => setActiveImage(product.image)}
                className={`w-16 h-16 rounded-xl border-2 p-1 bg-white cursor-pointer transition ${
                  activeImage === product.image ? "border-[#ff6b1a]" : "border-transparent"
                }`}
              >
                <img src={product.image} alt="Main" className="w-full h-full object-cover rounded-lg" />
              </div>
              {product.gallery.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-white cursor-pointer transition ${
                    activeImage === img ? "border-[#ff6b1a]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Configuration & Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            {product.categories && product.categories.length > 0 && (
              <span className="text-[10px] bg-orange-50 text-[#ff6b1a] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {product.categories[0].name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">{product.name}</h1>
            
            {/* Reviews summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#013e37] text-white px-2 py-0.5 rounded text-xs font-bold">
                <span>{avgRating}</span>
                <FaStar size={10} className="text-amber-400 fill-amber-400" />
              </div>
              <a href="#reviews" className="text-xs text-gray-400 hover:text-[#ff6b1a] font-semibold underline">
                {reviewsList.length} Customer {reviewsList.length === 1 ? 'Review' : 'Reviews'}
              </a>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Price details */}
          <div className="bg-[#FDFCFA] rounded-2xl border border-[#FAF5EF] p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Total Price</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#013e37]">₹{totalPrice}</span>
                {selectedVariant?.discount > 0 && (
                  <span className="text-sm text-gray-400 line-through">₹{selectedVariant.price * quantity}</span>
                )}
              </div>
            </div>
            {savingAmount > 0 && (
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-xl font-bold">
                You Save ₹{savingAmount}!
              </span>
            )}
          </div>

          {/* Variant option selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Select Weight Variant</label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1); // Reset qty on variant change
                    }}
                    className={`px-4 py-2.5 rounded-xl font-extrabold text-sm border transition flex flex-col items-center min-w-[80px] cursor-pointer ${
                      selectedVariant?.id === v.id
                        ? "border-[#ff6b1a] bg-orange-50/20 text-[#ff6b1a]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>{v.weight}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">₹{v.price - (v.discount || 0)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity increments & Add to Cart button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white shadow-sm shrink-0">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#ff6b1a] bg-transparent border-none cursor-pointer text-sm"
              >
                <FaMinus size={10} />
              </button>
              <span className="w-10 text-center font-extrabold text-gray-800 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#ff6b1a] bg-transparent border-none cursor-pointer text-sm"
              >
                <FaPlus size={10} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#ff6b1a] hover:bg-[#ea5a00] text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 border-none cursor-pointer text-base"
            >
              <FaShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Quality check highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 bg-white border border-[#FAF5EF] rounded-xl p-3 shadow-xs">
              <FaCertificate size={16} className="text-[#ff6b1a]" />
              <div>
                <h4 className="font-extrabold text-gray-800 text-xs">Fresh Daily</h4>
                <p className="text-[9px] text-gray-400">Handcrafted batch</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white border border-[#FAF5EF] rounded-xl p-3 shadow-xs">
              <FaClock size={16} className="text-[#ff6b1a]" />
              <div>
                <h4 className="font-extrabold text-gray-800 text-xs">Shelf Life</h4>
                <p className="text-[9px] text-gray-400">{product.shelfLife || "7-10 Days"}</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Specifications accordions */}
          <div className="space-y-4">
            <div className="flex border-b border-gray-100 text-xs font-bold">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-2.5 px-4 bg-transparent border-b-2 font-bold cursor-pointer transition ${
                  activeTab === "description" ? "border-[#ff6b1a] text-[#ff6b1a]" : "border-transparent text-gray-400"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("ingredients")}
                className={`pb-2.5 px-4 bg-transparent border-b-2 font-bold cursor-pointer transition ${
                  activeTab === "ingredients" ? "border-[#ff6b1a] text-[#ff6b1a]" : "border-transparent text-gray-400"
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab("storage")}
                className={`pb-2.5 px-4 bg-transparent border-b-2 font-bold cursor-pointer transition ${
                  activeTab === "storage" ? "border-[#ff6b1a] text-[#ff6b1a]" : "border-transparent text-gray-400"
                }`}
              >
                Storage & Safety
              </button>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed font-medium min-h-[100px] px-1">
              {activeTab === "description" && (
                <p>{product.description || "Indulge in the authentic and premium flavors of Anand Vihar's traditional Indian sweets, prepared fresh daily with the finest ingredients."}</p>
              )}
              {activeTab === "ingredients" && (
                <p>{product.ingredients || "No artificial ingredients added. Contact administration for detailed nutritional mapping information."}</p>
              )}
              {activeTab === "storage" && (
                <div className="space-y-2 text-xs">
                  {product.storageInstructions && (
                    <p><b>Storage:</b> {product.storageInstructions}</p>
                  )}
                  {product.fssaiNumber && (
                    <p className="flex items-center gap-1.5 text-gray-700 font-bold bg-orange-50/50 p-2 rounded-lg border border-orange-100 w-fit">
                      <FaCheckCircle className="text-green-600" />
                      <span>FSSAI License: {product.fssaiNumber}</span>
                    </p>
                  )}
                  <p><b>Prep Type:</b> Handcrafted traditional process.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ================= RELATED PRODUCTS CAROUSEL ================= */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1200px] mx-auto mt-20 space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-800">You May Also Like</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x scroll-smooth">
            {relatedProducts.map((item) => {
              const baseVar = item.variants?.[0] || { price: item.price };
              const cleanPrice = baseVar.price - (baseVar.discount || 0);

              return (
                <div 
                  key={item._id || item.id}
                  onClick={() => navigate(`/product/${item._id || item.id}`)}
                  className="w-48 shrink-0 bg-white rounded-2xl p-3 border border-[#FAF5EF] shadow-xs hover:shadow-md transition cursor-pointer snap-start flex flex-col justify-between"
                >
                  <div>
                    <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-xl bg-gray-50" />
                    <h3 className="font-extrabold text-sm text-gray-800 mt-3 truncate">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{baseVar.weight || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-extrabold text-sm text-gray-800">₹{cleanPrice}</span>
                    <span className="text-[10px] bg-orange-50 text-[#ff6b1a] px-2 py-0.5 rounded font-bold">VIEW</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= CUSTOMER REVIEWS LIST ================= */}
      <div id="reviews" className="max-w-[1200px] mx-auto mt-20 border-t border-gray-100 pt-12 space-y-6">
        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <span>Customer Reviews</span>
          <span className="text-sm font-normal text-gray-400 font-sans">({reviewsList.length})</span>
        </h2>

        {reviewsList.length === 0 ? (
          <div className="bg-white border border-[#FAF5EF] rounded-3xl p-10 text-center text-gray-400">
            <p className="text-3xl mb-3">⭐</p>
            <p className="font-bold text-sm">No reviews yet for this product.</p>
            <p className="text-xs text-gray-400 mt-1">Purchased this sweet? Be the first to leave a review from your profile order history!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsList.map((rev) => (
              <div 
                key={rev.id || rev._id}
                className="bg-white border border-[#FAF5EF] rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-800">{rev.name}</h4>
                    <span className="text-[9px] text-gray-400 font-semibold">{new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  
                  <div className="flex gap-0.5 text-xs text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < rev.rating ? "fill-amber-400" : "text-gray-200"} size={11} />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">"{rev.comment}"</p>

                {rev.isVerifiedPurchase && (
                  <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider w-fit block">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= LIGHTBOX ZOOM MODAL ================= */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 text-white text-3xl bg-transparent border-none cursor-pointer font-semibold hover:text-gray-300"
          >
            ✕
          </button>
          <img 
            src={activeImage} 
            alt={product.name} 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl animate-scaleIn"
          />
        </div>
      )}

    </div>
  );
}

export default ProductDetail;
