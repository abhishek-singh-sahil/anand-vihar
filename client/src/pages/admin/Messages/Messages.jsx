import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { FaTrash, FaEnvelopeOpen, FaEnvelope, FaRegEnvelope } from "react-icons/fa";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact/messages");
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (msg, newStatus) => {
    try {
      const res = await api.put(`/contact/messages/${msg.id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Message marked as ${newStatus}`);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: newStatus } : m));
        if (selectedMessage && selectedMessage.id === msg.id) {
          setSelectedMessage(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this contact message?")) return;
    try {
      const res = await api.delete(`/contact/messages/${id}`);
      if (res.data.success) {
        toast.success("Message deleted successfully");
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  // Filter and search logic
  const filteredMessages = messages.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "unread") return m.status === "unread";
    if (filterTab === "read") return m.status === "read";
    return true;
  });

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      handleUpdateStatus(msg, "read");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inquiry Messages Inbox</h2>
          <p className="text-xs text-gray-400 mt-1">Manage and respond to website contact form inquiries.</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 gap-1 w-full md:w-auto">
          {["all", "unread", "read"].map((tab) => {
            const count = messages.filter(m => {
              if (tab === "all") return true;
              return m.status === tab;
            }).length;

            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer border-none ${
                  filterTab === tab
                    ? "bg-[#ff9248] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 bg-transparent"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search inquiries name, email, text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
          />
          <span className="absolute right-3 top-3 text-xs text-gray-400">🔍</span>
        </div>
      </div>

      {/* Grid view containing List + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages List Column */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-medium">Loading inbox...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No inquiries found in this tab.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isUnread = msg.status === "unread";
              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex gap-3.5 items-start ${
                    isSelected
                      ? "border-[#ff9248] bg-orange-50/40 shadow-sm"
                      : isUnread
                      ? "border-gray-200 bg-white font-bold"
                      : "border-gray-100 bg-white/70 hover:bg-gray-50/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUnread ? "bg-orange-100 text-[#ff9248]" : "bg-gray-100 text-gray-400"}`}>
                    {isUnread ? <FaEnvelope size={12} /> : <FaEnvelopeOpen size={12} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className={`text-xs truncate ${isUnread ? "text-gray-900 font-extrabold" : "text-gray-700 font-semibold"}`}>{msg.name}</h4>
                      <span className="text-[9px] text-gray-400 shrink-0 font-medium">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isUnread ? "text-gray-800" : "text-gray-500"}`}>{msg.subject || "(No Subject)"}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-1">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Details Column */}
        <div className="lg:col-span-7 bg-gray-50 border border-gray-200 rounded-3xl p-6 min-h-[350px] flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4 border-b border-gray-200/60 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-800">{selectedMessage.subject || "(No Subject)"}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      From: <span className="font-semibold text-gray-700">{selectedMessage.name}</span> · <span className="text-blue-500 underline">{selectedMessage.email}</span>
                    </p>
                    {selectedMessage.phone && (
                      <p className="text-[11px] text-gray-400 mt-0.5">Phone: <span className="font-semibold">{selectedMessage.phone}</span></p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium shrink-0">
                    Received {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-inner min-h-[150px] text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-200/60">
                <div className="flex gap-2">
                  {selectedMessage.status === "unread" ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage, "read")}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer border-none flex items-center gap-1.5 transition"
                    >
                      <FaEnvelopeOpen size={11} />
                      <span>Mark Read</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage, "unread")}
                      className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-[#ff9248] text-xs font-bold rounded-xl cursor-pointer border-none flex items-center gap-1.5 transition"
                    >
                      <FaEnvelope size={11} />
                      <span>Mark Unread</span>
                    </button>
                  )}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject || "Anand Vihar Sweet Shop Inquiry"}`}
                    className="px-4 py-1.5 bg-[#013e37] hover:bg-[#025347] text-white text-xs font-bold rounded-xl cursor-pointer border-none flex items-center gap-1.5 transition decoration-none"
                  >
                    📩 Reply via Email
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl cursor-pointer border-none flex items-center justify-center transition"
                  title="Delete Inquiry"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400 space-y-3 flex-grow">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">📥</div>
              <div>
                <h4 className="font-bold text-gray-700 text-sm">Select an Inquiry Message</h4>
                <p className="text-xs text-gray-400 max-w-xs mt-1">Click a message card on the left panel to review message content, contact info, and submit replies.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
