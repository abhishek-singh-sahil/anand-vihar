import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/menu/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const response = await api.post("/menu/categories", { name: newCatName });
      if (response.data.success) {
        toast.success("Category created successfully!");
        setNewCatName("");
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? Deleting this category will not delete its items, but their reference category won't match.")) return;
    try {
      const response = await api.delete(`/menu/categories/${id}`);
      if (response.data.success) {
        toast.success("Category deleted");
        fetchCategories();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
      {/* Create Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Add Category</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category Name</label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Traditional Thali"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-bold text-sm cursor-pointer shadow-sm"
          >
            Create Category
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Available Menu Categories</h3>
        
        {loading ? (
          <div className="text-center py-6 text-gray-500 font-semibold">Loading...</div>
        ) : categories.length === 0 ? (
          <p className="text-center py-6 text-gray-500 font-medium">No categories added yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <div key={cat._id} className="py-3.5 flex justify-between items-center group">
                <span className="font-bold text-gray-800 text-base">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
