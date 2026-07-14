import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      let url = `/reservations?search=${search}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      if (dateFilter) {
        url += `&date=${dateFilter}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        setReservations(res.data.reservations);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.put(`/reservations/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Booking marked as ${status}`);
        fetchReservations();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation record?")) return;
    try {
      const res = await api.delete(`/reservations/${id}`);
      if (res.data.success) {
        toast.success("Reservation deleted");
        fetchReservations();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const handleBulkStatus = async (status) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await api.post("/reservations/bulk-status", { ids: selectedIds, status });
      if (res.data.success) {
        toast.success(`Selected reservations marked as ${status}`);
        setSelectedIds([]);
        fetchReservations();
      }
    } catch (error) {
      toast.error("Batch update failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} reservation records?`)) return;

    try {
      const res = await api.post("/reservations/bulk-delete", { ids: selectedIds });
      if (res.data.success) {
        toast.success("Bulk delete complete");
        setSelectedIds([]);
        fetchReservations();
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

  const toggleSelectAll = () => {
    if (selectedIds.length === reservations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reservations.map(r => r._id));
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Table Reservations CRUD Panel</h2>
        
        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkStatus("approved")}
              className="px-3.5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Approve Selected ({selectedIds.length})
            </button>
            <button
              onClick={() => handleBulkStatus("rejected")}
              className="px-3.5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reject Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
          />
          <button type="submit" className="absolute right-3 top-3 text-xs text-gray-400">
            🔍
          </button>
        </form>

        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none cursor-pointer"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none cursor-pointer"
          >
            <option value="">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold">Loading bookings list...</div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold">No reservation records found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                <th className="py-4 px-2 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === reservations.length && reservations.length > 0}
                    onChange={toggleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="py-4 px-2">Customer</th>
                <th className="py-4 px-2">Contact Details</th>
                <th className="py-4 px-2">Guests</th>
                <th className="py-4 px-2">Date / Time</th>
                <th className="py-4 px-2">Request</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((resv) => (
                <tr key={resv._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(resv._id)}
                      onChange={() => toggleSelect(resv._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">{resv.name}</h4>
                  </td>
                  <td className="py-4 px-2 text-xs text-gray-500">
                    <p className="font-semibold">{resv.email}</p>
                    <p className="mt-0.5">{resv.phone}</p>
                  </td>
                  <td className="py-4 px-2 text-sm font-bold text-gray-700">{resv.guests}</td>
                  <td className="py-4 px-2 text-xs text-gray-600">
                    <p className="font-bold">{resv.date}</p>
                    <p className="mt-0.5 font-medium text-[#ff9248]">{resv.time}</p>
                  </td>
                  <td className="py-4 px-2 text-xs text-gray-400 max-w-[200px] truncate" title={resv.specialRequest}>
                    {resv.specialRequest || "-"}
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        resv.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : resv.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {resv.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex justify-end gap-1.5">
                      {resv.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(resv._id, "approved")}
                            className="px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg transition cursor-pointer"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(resv._id, "rejected")}
                            className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-lg transition cursor-pointer"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(resv._id)}
                        className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-lg transition cursor-pointer"
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
    </div>
  );
}

export default Reservations;
