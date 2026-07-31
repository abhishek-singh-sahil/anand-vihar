import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { FaSearch, FaTrash, FaCheck, FaTimes, FaShippingFast, FaBoxOpen, FaClipboardList } from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get("/orders", { params });
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    try {
      const res = await api.delete(`/orders/${orderId}`);
      if (res.data?.success) {
        toast.success("Order record deleted successfully.");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "packing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#013e37]">Orders Management</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor sales, check packaging logs, and update delivery statuses</p>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {["All", "pending", "packing", "shipped", "delivered", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                statusFilter === st
                  ? "bg-[#ff6b1a] text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md mb-6">
        <input
          type="text"
          placeholder="Search by order ID, name, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff6b1a] text-sm"
        />
        <button 
          type="submit" 
          className="bg-[#013e37] hover:bg-[#002c1a] text-white px-5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none"
        >
          <FaSearch size={12} />
          <span>Search</span>
        </button>
      </form>

      {/* Orders List Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-bold">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center text-gray-500">
          <FaClipboardList className="text-gray-300 mx-auto mb-4" size={48} />
          <p className="font-bold text-lg">No orders matching filters found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#FAF5EF] rounded-3xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs text-gray-400 font-bold">ORDER ID</span>
                  <h3 className="font-extrabold text-gray-800 text-lg">{order.orderNumber}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  
                  {/* Status Dropdown */}
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#ff6b1a] bg-gray-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="packing">Packing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items listing & Client address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Ordered Items */}
                <div className="md:col-span-2 space-y-2">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Sweets Ordered</h4>
                  <div className="divide-y divide-gray-100 max-h-[160px] overflow-y-auto pr-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-sm gap-2">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover border" />
                          <span className="font-bold text-gray-800">{item.name} {item.weight && `(${item.weight})`}</span>
                          <span className="text-xs text-[#ff6b1a] font-extrabold">(x{item.quantity})</span>
                        </div>
                        <span className="font-bold text-gray-700">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-[#FAF5EF]/40 border border-[#FAF5EF] rounded-2xl p-4 text-xs space-y-1.5 text-gray-700">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Deliver To</h4>
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p className="leading-relaxed">
                    <strong>Address:</strong> {order.houseNumber}, {order.street}, {order.landmark ? order.landmark + ', ' : ''}{order.city}, {order.state} - {order.pinCode}
                  </p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  {order.notes && <p><strong>Notes:</strong> "{order.notes}"</p>}
                </div>

              </div>

              {/* Order total amount summary & Delete button */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">Shipping: ₹{order.shippingCharge}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="font-bold text-gray-800">Grand Total: </span>
                  <span className="font-extrabold text-[#ff6b1a] text-lg">₹{order.grandTotal}</span>
                </div>

                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                  title="Delete Order Record"
                >
                  <FaTrash size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
