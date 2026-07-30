import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPlus, FaWhatsapp, FaTruck, FaFileInvoice, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

function Checkout() {
  const { cart, clearCart } = useCart();
  const { settings } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD or WHATSAPP
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Searchable PIN codes states
  const [pincodes, setPincodes] = useState([]);
  const [selectedPinCodeZone, setSelectedPinCodeZone] = useState(null);
  const [pincodeSearch, setPincodeSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deliveryStatusMsg, setDeliveryStatusMsg] = useState("");

  // Address creation form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    state: "Jharkhand",
    city: "Jhumri Telaiya",
    pinCode: "825409",
    houseNumber: "",
    street: "",
    landmark: "",
    isDefault: false
  });

  // Success view state
  const [placedOrder, setPlacedOrder] = useState(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address");
      if (res.data?.success) {
        setAddresses(res.data.addresses || []);
        const defaultAddr = res.data.addresses.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0].id);
        }
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);
    }
  };

  const fetchPinCodes = async () => {
    try {
      const res = await api.get("/pincodes/public");
      if (res.data?.success) {
        setPincodes(res.data.data || []);
      }
    } catch (error) {
      console.error("Fetch pin codes error:", error);
    }
  };

  const validateCouponOnMount = async (code, amount) => {
    try {
      setCouponLoading(true);
      const res = await api.post("/coupons/validate", {
        code,
        orderAmount: amount
      });
      if (res.data?.success) {
        setCouponCode(res.data.coupon.code);
        setCouponDiscount(res.data.coupon.discountAmount);
      }
    } catch (error) {
      console.error("Coupon validation on mount failed:", error);
      localStorage.removeItem("appliedCouponCode");
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchPinCodes();
  }, []);

  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCouponCode");
    if (savedCoupon && cart.length > 0) {
      const currentSubtotal = cart.reduce((total, item) => total + (item.price - (item.discount || 0)) * item.quantity, 0);
      validateCouponOnMount(savedCoupon, currentSubtotal);
    }
  }, [cart]);

  useEffect(() => {
    if (selectedAddressId && addresses.length > 0 && pincodes.length > 0) {
      const activeAddr = addresses.find(a => a.id === selectedAddressId);
      if (activeAddr) {
        // Find matching pincode zone
        const matchingZone = pincodes.find(z => z.code === activeAddr.pinCode);
        if (matchingZone) {
          setSelectedPinCodeZone(matchingZone);
          setPincodeSearch(matchingZone.code + " - " + matchingZone.areaName);
          setDeliveryStatusMsg(`✓ Delivery Available! Charge: ₹${matchingZone.deliveryCharge} (${matchingZone.deliveryTime})`);
        } else {
          setSelectedPinCodeZone(null);
          setPincodeSearch(activeAddr.pinCode);
          setDeliveryStatusMsg(`❌ Sorry, Delivery is not available in area (${activeAddr.pinCode}).`);
        }
      }
    }
  }, [selectedAddressId, addresses, pincodes]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/address", addressForm);
      if (res.data?.success) {
        toast.success("Delivery address added successfully!");
        setAddressForm({
          fullName: "",
          phone: "",
          state: "Jharkhand",
          city: "Jhumri Telaiya",
          pinCode: "825409",
          houseNumber: "",
          street: "",
          landmark: "",
          isDefault: false
        });
        setShowAddAddress(false);
        fetchAddresses();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (deliveryStatusMsg && !selectedPinCodeZone) {
      toast.error("Please select a valid delivery PIN Code before placing order.");
      return;
    }

    try {
      setIsSubmitting(true);
      const subtotal = cart.reduce((total, item) => total + (item.price - (item.discount || 0)) * item.quantity, 0);
      const freeMin = settings?.freeDeliveryMinAmount ? Number(settings.freeDeliveryMinAmount) : 500;
      let shippingCharge;
      if (selectedPinCodeZone) {
        shippingCharge = subtotal >= freeMin ? 0 : Number(selectedPinCodeZone.deliveryCharge);
      } else {
        const defaultCharge = settings?.deliveryCharge ? Number(settings.deliveryCharge) : 40;
        shippingCharge = subtotal >= freeMin ? 0 : defaultCharge;
      }

      const orderPayload = {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod === "COD" ? "COD" : "WhatsApp Redirect",
        notes,
        shippingCharge,
        pinCode: selectedPinCodeZone?.code || null,
        couponCode: couponCode || null
      };

      const res = await api.post("/orders", orderPayload);
      if (res.data?.success) {
        const orderInfo = res.data.order;
        setPlacedOrder(orderInfo);
        clearCart();
        localStorage.removeItem("appliedCouponCode");
        toast.success("Order placed successfully!");

        // If user chose WhatsApp redirection, redirect immediately!
        if (paymentMethod === "WHATSAPP" && res.data.whatsappUrl) {
          window.open(res.data.whatsappUrl, "_blank");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price - (item.discount || 0);
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const freeMin = settings?.freeDeliveryMinAmount ? Number(settings.freeDeliveryMinAmount) : 500;
  const defaultDeliveryCharge = settings?.deliveryCharge ? Number(settings.deliveryCharge) : 40;
  const pinZoneCharge = selectedPinCodeZone ? Number(selectedPinCodeZone.deliveryCharge) : defaultDeliveryCharge;
  const shippingCharge = (subtotal - couponDiscount) >= freeMin ? 0 : pinZoneCharge;
  const grandTotal = subtotal - couponDiscount + shippingCharge;

  const filteredPincodes = pincodes.filter((z) => {
    const q = pincodeSearch.toLowerCase();
    return z.code.includes(q) || (z.areaName || "").toLowerCase().includes(q);
  });

  // Render Order Success Screen
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] py-16 px-6 font-sans flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#FAF5EF] shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto">
            <FaCheckCircle size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">Order Placed!</h2>
          <p className="text-gray-500 text-sm">
            Thank you for shopping with Anand Vihar. We have received your order and are preparing your fresh sweets. An invoice receipt has been delivered to your email.
          </p>

          <div className="bg-[#FAF5EF] rounded-2xl p-4 text-left space-y-2 text-sm text-gray-700">
            <p><strong>Order Tracking Number:</strong> {placedOrder.orderNumber}</p>
            <p><strong>Grand Total:</strong> ₹{placedOrder.grandTotal}</p>
            <p><strong>Payment Method:</strong> {placedOrder.paymentMethod}</p>
            <p><strong>Deliver To:</strong> {placedOrder.name}</p>
          </div>

          {placedOrder.paymentMethod === "WhatsApp Redirect" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-left space-y-2 text-sm text-green-800">
              <p className="font-bold">WhatsApp Order Status:</p>
              <p>A prefilled order redirection has been launched in a new tab. If it did not open, click the button below to text our owner directly.</p>
            </div>
          )}

          <div className="pt-4 flex flex-col gap-2">
            {placedOrder.paymentMethod === "WhatsApp Redirect" && (
              <a 
                href={`https://api.whatsapp.com/send?phone=${settings?.whatsappNumber || "+919934190109"}&text=Hi,%20order%20status%20check%20for%20order%20${placedOrder.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer no-underline text-center"
              >
                <FaWhatsapp size={14} />
                <span>Message Owner on WhatsApp</span>
              </a>
            )}
            <a 
              href="/menu" 
              className="w-full py-3 bg-[#013e37] hover:bg-[#002c1a] text-white rounded-xl font-bold transition-all shadow-md text-center no-underline block"
            >
              Back to Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1280px] mx-auto">
        <button 
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-6 bg-transparent border-none cursor-pointer"
        >
          <FaArrowLeft size={12} />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 pb-4 border-b border-gray-100">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Shipping Address & Payment Selection */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address Box */}
            <div className="bg-white rounded-2xl p-6 border border-[#FAF5EF] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#ff6b1a]" />
                  <span>Select Delivery Address</span>
                </h3>
                <button 
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs text-[#ff6b1a] hover:text-[#ea5a00] font-bold flex items-center gap-1 bg-transparent border-none cursor-pointer"
                >
                  <FaPlus size={10} />
                  <span>Add New Address</span>
                </button>
              </div>

              {showAddAddress ? (
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-200 rounded-2xl p-4 bg-gray-50 mb-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      required 
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">PIN Code</label>
                    <input 
                      type="text" 
                      required 
                      value={addressForm.pinCode}
                      onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">House/Flat Number</label>
                    <input 
                      type="text" 
                      required 
                      value={addressForm.houseNumber}
                      onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Street/Locality</label>
                    <input 
                      type="text" 
                      required 
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Landmark (Optional)</label>
                    <input 
                      type="text" 
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    />
                    <label htmlFor="isDefault" className="text-xs text-gray-500 font-bold">Set as Default Address</label>
                  </div>
                  <div className="sm:col-span-2 flex gap-2 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 bg-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-[#013e37] text-white rounded-lg text-xs font-bold border-none cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : null}

              {addresses.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No saved addresses found. Please add a delivery address to place your order.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`border rounded-2xl p-4 cursor-pointer transition-all relative ${
                        selectedAddressId === addr.id 
                          ? "border-[#ff6b1a] bg-orange-50/20" 
                          : "border-gray-200 hover:border-[#ff6b1a]/40"
                      }`}
                    >
                      <h4 className="font-extrabold text-gray-800 text-sm">{addr.fullName}</h4>
                      <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {addr.houseNumber}, {addr.street}, {addr.landmark ? addr.landmark + ', ' : ''}{addr.city}, {addr.state} - {addr.pinCode}
                      </p>
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 bg-[#013e37] text-white px-2 py-0.5 rounded text-[9px] font-bold">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PIN Code Delivery Zone Selector */}
            <div className="bg-white rounded-2xl p-6 border border-[#FAF5EF] shadow-sm">
              <h3 className="font-extrabold text-gray-800 text-lg mb-1 flex items-center gap-2">
                <FaTruck className="text-[#ff6b1a]" />
                <span>Delivery PIN Code</span>
              </h3>
              <p className="text-xs text-gray-400 mb-4">Select your delivery area to see applicable charges</p>

              <div className="relative">
                <input
                  type="text"
                  disabled={!!selectedAddressId}
                  placeholder={selectedAddressId ? "PIN code auto-selected based on address details" : "Search PIN Code or area (e.g. 825409 or Bazar)..."}
                  value={pincodeSearch}
                  onFocus={() => setDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  onChange={(e) => {
                    setPincodeSearch(e.target.value);
                    setDropdownOpen(true);
                    if (!e.target.value) {
                      setSelectedPinCodeZone(null);
                      setDeliveryStatusMsg("");
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ff6b1a] pr-10 ${
                    selectedAddressId ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
                  }`}
                />
                {selectedPinCodeZone && !selectedAddressId && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer text-lg font-bold"
                    onClick={() => { setSelectedPinCodeZone(null); setPincodeSearch(""); setDeliveryStatusMsg(""); }}
                  >
                    ×
                  </button>
                )}

                {dropdownOpen && !selectedAddressId && filteredPincodes.length > 0 && (
                  <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                    {filteredPincodes.map((zone) => (
                      <li
                        key={zone.id}
                        onMouseDown={() => {
                          setSelectedPinCodeZone(zone);
                          setPincodeSearch(`${zone.code}${zone.areaName ? " – " + zone.areaName : ""}`);
                          setDeliveryStatusMsg("");
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center text-sm border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <span className="font-bold text-gray-800">{zone.code}</span>
                          {zone.areaName && <span className="text-gray-500 ml-2">{zone.areaName}</span>}
                        </div>
                        <span className="text-xs font-bold text-[#ff6b1a]">₹{zone.deliveryCharge}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {deliveryStatusMsg && (
                <p className={`mt-3 text-xs font-bold ${deliveryStatusMsg.startsWith("❌") ? "text-red-500" : "text-green-600"}`}>
                  {deliveryStatusMsg}
                </p>
              )}

              {selectedPinCodeZone && !deliveryStatusMsg.startsWith("❌") && (
                <div className="mt-4 bg-green-50/50 border border-green-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-green-700">
                  <span className="text-green-600 font-bold text-base">✓</span>
                  <div>
                    <span className="font-bold text-green-700">{selectedPinCodeZone.code}</span>
                    {selectedPinCodeZone.areaName && <span className="text-green-600 ml-1">({selectedPinCodeZone.areaName})</span>}
                    <span className="ml-2 text-green-600">— Delivery: <b>₹{selectedPinCodeZone.deliveryCharge}</b></span>
                    {selectedPinCodeZone.deliveryTime && (
                      <span className="ml-2 text-gray-400 text-xs">ETA: {selectedPinCodeZone.deliveryTime}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Block */}
            <div className="bg-white rounded-2xl p-6 border border-[#FAF5EF] shadow-sm">
              <h3 className="font-extrabold text-gray-800 text-lg mb-6 flex items-center gap-2">
                <FaFileInvoice className="text-[#ff6b1a]" />
                <span>Select Payment Method</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod("COD")}
                  className={`border rounded-2xl p-5 cursor-pointer flex items-center gap-4 transition-all ${
                    paymentMethod === "COD" 
                      ? "border-[#ff6b1a] bg-orange-50/20" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6b1a] flex-shrink-0">
                    <FaTruck size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-sm">Cash on Delivery</h4>
                    <p className="text-xs text-gray-400">Pay cash upon delivery at your doorstep.</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod("WHATSAPP")}
                  className={`border rounded-2xl p-5 cursor-pointer flex items-center gap-4 transition-all ${
                    paymentMethod === "WHATSAPP" 
                      ? "border-[#ff6b1a] bg-orange-50/20" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#25D366] flex-shrink-0">
                    <FaWhatsapp size={18} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-sm">WhatsApp Checkout</h4>
                    <p className="text-xs text-gray-400">Pre-fill details and message our owner directly.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-700 font-bold mb-2">Delivery Instructions / Order Notes</label>
                <textarea 
                  rows="3"
                  placeholder="e.g. Please send fresh batches only, call before delivery etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff6b1a] text-sm"
                />
              </div>
            </div>

          </div>

          {/* Cart items invoice summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#FAF5EF] shadow-sm space-y-4">
              <h3 className="font-extrabold text-gray-800 text-lg mb-2">Order Items</h3>
              
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-[#ff6b1a] text-xs flex-shrink-0">x{item.quantity}</span>
                      <span className="text-gray-700 font-medium truncate max-w-[130px]">{item.product.name}</span>
                      {item.weight && (
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0">{item.weight}</span>
                      )}
                    </div>
                    <span className="font-bold text-gray-800 flex-shrink-0">
                      ₹{(item.price - (item.discount || 0)) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {couponCode && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Applied Coupon</p>
                    <p className="font-extrabold text-[#013e37] text-sm">{couponCode}</p>
                  </div>
                  <span className="text-xs text-green-700 font-bold">
                    Saved ₹{couponDiscount}
                  </span>
                </div>
              )}

              <hr className="border-gray-100" />

              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 text-sm font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 text-sm">
                <div>
                  <span>Delivery Charges</span>
                  {selectedPinCodeZone?.deliveryTime && (
                    <span className="block text-xs text-gray-400">ETA: {selectedPinCodeZone.deliveryTime}</span>
                  )}
                </div>
                <span>{shippingCharge === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shippingCharge}`}</span>
              </div>

              <hr className="border-gray-100" />

              <div className="flex justify-between text-gray-800 font-extrabold text-lg">
                <span>Total Amount</span>
                <span className="text-[#ff6b1a]">₹{grandTotal}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cart.length === 0}
                className="w-full mt-4 bg-[#ff6b1a] hover:bg-[#ea5a00] text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
