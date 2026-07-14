import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

function Products() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [veg, setVeg] = useState(true);
  const [bestseller, setBestseller] = useState(false);
  const [popular, setPopular] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [available, setAvailable] = useState(true);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = `/menu/items?search=${search}`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const response = await api.get(url);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/menu/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
        if (response.data.categories.length > 0) {
          setCategory(response.data.categories[0].name);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setDescription("");
    setPrice("");
    if (categories.length > 0) {
      setCategory(categories[0].name);
    }
    setImage(null);
    setVeg(true);
    setBestseller(false);
    setPopular(false);
    setIsNew(false);
    setAvailable(true);
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setImage(null);
    setVeg(item.veg);
    setBestseller(item.bestseller || false);
    setPopular(item.popular || false);
    setIsNew(item.isNew || false);
    setAvailable(item.available !== false);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !description) {
      return toast.error("Please fill in all text fields");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("veg", veg);
    formData.append("bestseller", bestseller);
    formData.append("popular", popular);
    formData.append("isNew", isNew);
    formData.append("available", available);

    if (image) {
      formData.append("image", image);
    }

    try {
      let res;
      if (editingItem) {
        res = await api.put(`/menu/items/${editingItem._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        if (!image) {
          return toast.error("Please upload an image file");
        }
        res = await api.post("/menu/items", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(res.data.message || "Saved successfully!");
        setShowModal(false);
        fetchItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const res = await api.delete(`/menu/items/${id}`);
      if (res.data.success) {
        toast.success("Menu item deleted");
        fetchItems();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected items?`)) return;

    try {
      const res = await api.post("/menu/items/bulk-delete", { ids: selectedIds });
      if (res.data.success) {
        toast.success("Bulk delete complete!");
        setSelectedIds([]);
        fetchItems();
      }
    } catch (error) {
      toast.error("Bulk deletion failed");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Menu Items CRUD Panel</h2>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm cursor-pointer shadow-sm"
            >
              Bulk Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-semibold text-sm cursor-pointer shadow-sm"
          >
            + Create Menu Item
          </button>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search items name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-xs text-gray-400">
            🔍
          </button>
        </form>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Items list table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold">Loading menu grid...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold">No menu items found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                <th className="py-4 px-2 w-10">Select</th>
                <th className="py-4 px-2">Item</th>
                <th className="py-4 px-2">Category</th>
                <th className="py-4 px-2">Price</th>
                <th className="py-4 px-2">Tags</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                        <span className="text-[10px] text-gray-400 font-semibold">{item.veg ? "🟢 Veg" : "🔴 Non-Veg"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500 font-semibold">{item.category}</td>
                  <td className="py-4 px-2 text-sm font-extrabold text-gray-800">₹{item.price}</td>
                  <td className="py-4 px-2">
                    <div className="flex gap-1.5 flex-wrap">
                      {item.bestseller && <span className="bg-orange-50 text-[#ff9248] text-[9px] font-bold px-1.5 py-0.5 rounded">Best</span>}
                      {item.popular && <span className="bg-yellow-50 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Pop</span>}
                      {item.isNew && <span className="bg-teal-50 text-teal-700 text-[9px] font-bold px-1.5 py-0.5 rounded">New</span>}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {item.available ? "Active" : "Sold Out"}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-[#ff9248] font-bold rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-lg transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-bold text-gray-800">{editingItem ? "Edit Menu Item" : "Create Menu Item"}</h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={veg} onChange={(e) => setVeg(e.target.checked)} />
                  🟢 Pure Vegetarian
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                  📦 In Stock / Available
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} />
                  ⭐ Bestseller Tag
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
                  🔥 Popular Tag
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                  ✨ New Arrival Tag
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-semibold text-sm cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold text-sm cursor-pointer shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
