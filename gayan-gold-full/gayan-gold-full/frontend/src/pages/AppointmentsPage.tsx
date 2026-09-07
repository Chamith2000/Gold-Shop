import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Gem,
  ArrowRight,
  Activity,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTraffic } from "../context/TrafficContext";
import { AppointmentAvailabilityResponse, AppointmentSlot, Appointment } from "../types";

export const AppointmentsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { activity } = useTraffic();

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [appointmentType, setAppointmentType] = useState<string>("Bridal Jewellery Consultation");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [visitorCount, setVisitorCount] = useState<number>(2);
  const [fullName, setFullName] = useState<string>(user?.fullName || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [notes, setNotes] = useState<string>("");

  // Slots availability data
  const [availability, setAvailability] = useState<AppointmentAvailabilityResponse | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // My Appointments list
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);

  const fetchSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const data = await api.appointments.getAvailability(selectedDate, appointmentType);
      setAvailability(data);
      if (data.slots && data.slots.length > 0) {
        const firstAvailable = data.slots.find((s) => s.available);
        if (firstAvailable) setSelectedSlot(firstAvailable.time);
      }
    } catch (e) {
      console.error("Failed to fetch slots", e);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const fetchMyAppointments = async () => {
    if (!isAuthenticated) return;
    try {
      const list = await api.appointments.getMyAppointments();
      setMyAppointments(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, appointmentType]);

  useEffect(() => {
    fetchMyAppointments();
  }, [isAuthenticated, bookingSuccess]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage("Please select a valid time slot.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await api.appointments.book({
        date: selectedDate,
        timeSlot: selectedSlot,
        appointmentType,
        visitorCount,
        notes: `Patron: ${fullName}, Phone: ${phone}, Email: ${email}. Notes: ${notes}`,
      });
      setBookingSuccess(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage(err.message || "Booking reservation failed. Please try another slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const appointmentTypes = [
    {
      title: "Bridal Jewellery Consultation",
      desc: "Full bespoke trousseau fitting & 22K/24K sovereign matching for bride & family.",
      icon: Sparkles,
    },
    {
      title: "Ceylon Gemstone Selection",
      desc: "Private viewing of natural unheated Blue Sapphires, Padparadscha & Rubies.",
      icon: Gem,
    },
    {
      title: "Custom Gold Crafting & Design",
      desc: "Meet master goldsmith to transform your vision or heirloom gold into custom jewelry.",
      icon: Clock,
    },
    {
      title: "Sovereign Gold & Bullion Purchase",
      desc: "Fast-track 24K and 22K sovereign coin and bar acquisition at spot market prices.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            Private VIP Showroom Salon
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            Reserve Your Private Boutique Appointment
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Fast-track your showroom visit with dedicated gemological consultants, live gold testing, and private champagne viewing in Sea Street Colombo.
          </p>
        </div>

        {/* Live Traffic Indicator Banner */}
        <div className="bg-gradient-to-r from-[#FAF3E8] via-white to-[#FAF3E8] border border-[#D4AF37]/50 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A0F1B] text-[#D4AF37] flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-cinzel text-xs font-bold uppercase text-[#5A0F1B] block">
                Flagship Boutique Real-Time Traffic
              </span>
              <p className="text-xs text-stone-600 font-sans">
                Currently <strong className="text-stone-900">{activity?.currentVisitorCount || 6} patrons</strong> browsing &bull; Average wait time: <strong className="text-stone-900">{activity?.estimatedWaitMinutes || 5} mins</strong>
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#5A0F1B] text-[#F3E5AB] px-3.5 py-1.5 rounded-full text-xs font-bold font-cinzel">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            Appointments Bypass All Showroom Queues
          </div>
        </div>

        {/* Booking Confirmation Banner if Success */}
        {bookingSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 text-emerald-900 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold">
                  VIP Appointment Confirmed! (Ref: {bookingSuccess.appointmentNumber})
                </h3>
                <p className="text-xs text-emerald-800">
                  A confirmation SMS &amp; email have been scheduled. Our concierge team looks forward to receiving you.
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans border border-emerald-200">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Date</span>
                <strong className="text-stone-900">{bookingSuccess.date}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Time Slot</span>
                <strong className="text-stone-900">{bookingSuccess.timeSlot}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Service</span>
                <strong className="text-stone-900">{bookingSuccess.appointmentType}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Guests</span>
                <strong className="text-stone-900">{bookingSuccess.visitorCount} Person(s)</strong>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form Layout */}
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Step 1 - Appointment Type & Date Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Type */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#5A0F1B] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5A0F1B] text-white flex items-center justify-center text-xs">1</span>
                Select Consultation Service
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appointmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = appointmentType === type.title;
                  return (
                    <div
                      key={type.title}
                      onClick={() => setAppointmentType(type.title)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#FAF3E8] border-[#D4AF37] shadow-xs"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#5A0F1B]" : "text-stone-400"}`} />
                        <h4 className={`font-cinzel text-xs font-bold ${isSelected ? "text-[#5A0F1B]" : "text-stone-900"}`}>
                          {type.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                        {type.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Available Time Slots */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#5A0F1B] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5A0F1B] text-white flex items-center justify-center text-xs">2</span>
                Choose Date &amp; Fast-Track Time Slot
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="space-y-1 w-full sm:w-auto">
                  <label className="text-xs font-bold text-stone-700 font-sans">Preferred Date:</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>

                <div className="text-[11px] text-stone-500 font-sans">
                  Showing real-time showroom capacity for Colombo 11 Flagship VIP Suite.
                </div>
              </div>

              {/* Slot Cards Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 font-sans block">
                  Select Time Slot:
                </label>

                {isLoadingSlots ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-16 rounded-xl bg-stone-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {availability?.slots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          type="button"
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`p-3 rounded-xl border text-center transition-all relative ${
                            !slot.available
                              ? "bg-stone-100 border-stone-200 opacity-40 cursor-not-allowed"
                              : isSelected
                              ? "bg-[#5A0F1B] border-[#5A0F1B] text-white shadow-md font-bold"
                              : slot.isRecommended
                              ? "bg-[#FAF3E8] border-[#D4AF37] text-[#5A0F1B] hover:bg-[#F3E5AB]"
                              : "bg-white border-stone-200 text-stone-800 hover:bg-stone-50"
                          }`}
                        >
                          <span className="font-mono text-xs font-bold block">{slot.time}</span>
                          <span
                            className={`text-[9px] uppercase tracking-wider block mt-1 ${
                              isSelected
                                ? "text-[#F3E5AB]"
                                : slot.isRecommended
                                ? "text-[#B54E0E] font-bold"
                                : "text-stone-400"
                            }`}
                          >
                            {slot.status === "RECOMMENDED" ? "★ Recommended" : slot.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Step 3 - Customer Details & Booking Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#5A0F1B] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5A0F1B] text-white flex items-center justify-center text-xs">3</span>
                Guest Information
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Lady Chamari Perera"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Contact Phone (SMS Confirmation)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Number of Guests</label>
                  <select
                    value={visitorCount}
                    onChange={(e) => setVisitorCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  >
                    <option value={1}>1 Guest (Solo VIP)</option>
                    <option value={2}>2 Guests (Couple)</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests (Bridal Family)</option>
                    <option value={6}>5-6 Guests (Full Trousseau Party)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Special Requirements or Target Pieces</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Looking for 22K Sovereign Padparadscha bridal set, or bringing family gold for re-crafting..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedSlot}
                className="w-full bg-[#5A0F1B] hover:bg-[#400A13] text-white py-3.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                id="submit-appointment-btn"
              >
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                {isSubmitting ? "Securing VIP Reservation..." : "Confirm VIP Appointment"}
              </button>

              <div className="flex items-center gap-2 text-[10px] text-stone-500 justify-center font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Complimentary booking with zero cancellation charges.</span>
              </div>
            </div>
          </div>
        </form>

        {/* My Existing Bookings List */}
        {isAuthenticated && myAppointments.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase tracking-wider">
              My Scheduled Appointments ({myAppointments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAppointments.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl border border-stone-200 bg-[#FAF8F5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#5A0F1B]">
                      {app.appointmentNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        app.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <h4 className="font-cinzel text-xs font-bold text-stone-900">{app.appointmentType}</h4>
                  <div className="flex items-center gap-4 text-xs text-stone-600 font-sans">
                    <span>📅 {app.date}</span>
                    <span>⏰ {app.timeSlot}</span>
                    <span>👥 {app.visitorCount} Guests</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
