import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight, FaTicketAlt } from "react-icons/fa";

function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, getCartCount } = useCart();
  const { settings } = useAuth();
  
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price - (item.discount || 0);
      return total + price * item.quantity;
    }, 0);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      const subtotal = calculateSubtotal();
      const res = await api.post("/coupons/validate", {
        code: couponCode,
        orderAmount: subtotal
      });

      if (res.data?.success) {
        setAppliedCoupon(res.data.coupon.code);
        setCouponDiscount(res.data.coupon.discountAmount);
        toast.success(res.data.message || "Coupon applied successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired coupon code.");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    toast.success("Coupon removed.");
  };

  const subtotal = calculateSubtotal();
  const deliveryCharge = settings?.deliveryCharge ? Number(settings.deliveryCharge) : 40;
  const freeMin = settings?.freeDeliveryMinAmount ? Number(settings.freeDeliveryMinAmount) : 500;
  const shippingCharge = subtotal >= freeMin ? 0 : deliveryCharge;
  const grandTotal = subtotal - couponDiscount + shippingCharge;

  if (loading && cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans text-gray-500">
        Loading your cart...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-6 bg-[#FDFCFA]">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6b1a] mb-6">
          <FaShoppingBag size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Add some of our delicious, premium sweets to your cart and make your celebrations special!</p>
        <a 
          href="/menu" 
          className="px-8 py-3 bg-[#ff6b1a] hover:bg-[#ea5a00] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Browse Sweets Menu</span>
          <FaArrowRight size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b border-gray-100 pb-4">
          Shopping Cart ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const unitPrice = item.price - (item.discount || 0);
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-[#FAF5EF] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-gray-800 text-lg">{item.product.name}</h3>
                      <div className="flex flex-wrap gap-2 items-center text-xs mt-1">
                        <span className="text-[#013e37] font-bold">{item.product.categories && item.product.categories[0]}</span>
                        {item.weight && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">
                            {item.weight}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-gray-800">₹{unitPrice}</span>
                        {item.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">₹{item.price}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-1 bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-extrabold text-gray-800 text-lg">₹{unitPrice * item.quantity}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer mt-1 flex items-center gap-1 text-xs ml-auto"
                      >
                        <FaTrash size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout & Summary Sidebar */}
          <div className="space-y-6">
            
            {/* Coupon Code Block */}
            <div className="bg-white rounded-2xl p-6 border border-[#FAF5EF] shadow-sm">
              <h3 className="font-extrabold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <FaTicketAlt className="text-[#ff6b1a]" />
                <span>Apply Coupon</span>
              </h3>
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Code (e.g. FESTIVAL50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff6b1a] text-sm uppercase"
                  />
                  <button 
                    type="submit" 
                    disabled={couponLoading}
                    className="bg-[#013e37] hover:bg-[#002c1a] text-white px-5 rounded-xl text-sm font-bold transition-all border-none cursor-pointer"
                  >
                    {couponLoading ? "Applying..." : "Apply"}
                  </button>
                </form>
              ) : (
                <div className="bg-orange-50 border border-dashed border-[#ff6b1a] rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#ff6b1a] font-bold">Applied Coupon</p>
                    <p className="font-extrabold text-gray-800 text-sm">{appliedCoupon}</p>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Invoice Summary Block */}
            <div className="bg-white rounded-2xl p-6 border border-[#FAF5EF] shadow-sm space-y-4">
              <h3 className="font-extrabold text-gray-800 text-lg mb-2">Order Summary</h3>
              
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 text-sm font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 text-sm">
                <span>Delivery Charges</span>
                <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
              </div>

              {shippingCharge > 0 && (
                <p className="text-xs text-gray-400 italic">
                  * Shop for ₹{freeMin} or more to get free delivery!
                </p>
              )}

              <hr className="border-gray-100" />

              <div className="flex justify-between text-gray-800 font-extrabold text-lg">
                <span>Grand Total</span>
                <span className="text-[#ff6b1a]">₹{grandTotal}</span>
              </div>

              <a 
                href="/checkout" 
                className="w-full mt-4 bg-[#ff6b1a] hover:bg-[#ea5a00] text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer no-underline text-center text-sm"
              >
                <span>Proceed to Checkout</span>
                <FaArrowRight size={12} />
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;
