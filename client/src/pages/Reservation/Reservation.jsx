import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
];

function Reservation() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("07:00 PM");
  const [specialRequest, setSpecialRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedResv, setSubmittedResv] = useState(null);

  // Disable past dates
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !date || !time) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      const response = await api.post("/reservations", {
        name,
        phone,
        email,
        guests: Number(guests),
        date,
        time,
        specialRequest,
      });

      if (response.data.success) {
        toast.success("Reservation request sent!");
        setSubmittedResv(response.data.reservation);
        // Reset form
        setName("");
        setPhone("");
        setEmail("");
        setGuests(2);
        setDate("");
        setSpecialRequest("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-16 px-6 bg-[#FDFCFA] font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Banner Column */}
        <div>
          <span className="badge mb-4">✦ Table Bookings ✦</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#013e37] leading-tight mb-6">
            Reserve A Table For Your <span className="text-[#ff9248]">Family Feast</span>
          </h1>
          <p className="text-gray-600 leading-relaxed mb-8 text-base">
            Enjoy premium dining, traditional Jharkhandi sweets, and curated starters at Anand Vihar near Jhanda Chowk. Book your slot in advance to ensure comfortable seating and quick service.
          </p>
          <div className="space-y-4 text-sm text-gray-500 font-semibold">
            <p>📍 Location: Anand Vihar Complex, Jhumri Telaiya, Jharkhand</p>
            <p>📞 Helpline: +91 9934190109</p>
            <p>✉ Confirmation: Immediate booking details sent to your inbox</p>
          </div>
        </div>

        {/* Form Column */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!submittedResv ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Book a Table</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 9934190109"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Guests *</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] cursor-pointer"
                    >
                      {guestOptions.map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time Slot *</label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] cursor-pointer"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requests (Optional)</label>
                  <textarea
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSecretKey(e.target.value)} // wait, it should be setSpecialRequest, let's correct it: setSpecialRequest(e.target.value)
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Allergies, high chair, window seating, etc."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Requesting Booking..." : "Request Table Reservation"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 text-green-700 text-3xl font-bold flex items-center justify-center rounded-full mx-auto mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Booking Requested!</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Thank you for booking with us. We have received your request for <span className="font-semibold text-[#013e37]">{submittedResv.guests} guests</span> on <span className="font-semibold text-[#013e37]">{submittedResv.date}</span> at <span className="font-semibold text-[#013e37]">{submittedResv.time}</span>.
                </p>
                <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100 text-xs text-gray-500 space-y-2 mb-6">
                  <p><strong>Booking ID:</strong> {submittedResv._id}</p>
                  <p><strong>Status:</strong> <span className="font-bold text-orange-500 capitalize">{submittedResv.status}</span></p>
                  <p>Check your email for details. We will notify you when approved.</p>
                </div>
                <button
                  onClick={() => setSubmittedResv(null)}
                  className="px-6 py-2.5 bg-[#013e37] text-white rounded-xl font-semibold hover:bg-opacity-95 cursor-pointer shadow-sm text-sm"
                >
                  Book Another Table
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
