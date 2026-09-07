import React from "react";
import { Calendar, Clock, Sparkles, Gem, ShieldCheck, ArrowRight } from "lucide-react";

interface BespokeAppointmentSectionProps {
  onBookAppointment: () => void;
}

export const BespokeAppointmentSection: React.FC<BespokeAppointmentSectionProps> = ({
  onBookAppointment,
}) => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FAF3E8] via-[#FDFBF7] to-[#FAF3E8] border border-[#D4AF37]/50 rounded-3xl p-8 sm:p-12 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-xl bg-stone-100 relative">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
                alt="Private Gemstone & Jewelry Consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block font-cinzel">
                  Flagship VIP Suite
                </span>
                <span className="font-cinzel text-sm font-bold text-white">
                  Colombo Sea Street Private Salon
                </span>
              </div>
            </div>
          </div>

          {/* Right Information & Booking Form Shortcut */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
                <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
                VIP Private Consultation
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B] uppercase tracking-wide">
                Bespoke Bridal &amp; Gemstone Appointments
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                Whether selecting rare unheated Ceylon sapphires or tailoring complete 22K sovereign bridal heirlooms, our master designers provide dedicated one-on-one attention in our private VIP salon.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200">
                <Clock className="w-5 h-5 text-[#B54E0E] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold font-cinzel text-stone-900">
                    Live Store Fast-Tracking
                  </h4>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                    Appointments automatically bypass standard showroom queues.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200">
                <ShieldCheck className="w-5 h-5 text-[#B54E0E] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold font-cinzel text-stone-900">
                    Certified Gemologist
                  </h4>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                    Spectroscopy and refractometer testing performed live in front of you.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onBookAppointment}
                className="w-full sm:w-auto bg-[#5A0F1B] hover:bg-[#400A13] text-white font-cinzel text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
                id="bespoke-appointment-book-btn"
              >
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                Select Preferred Date &amp; Time
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <span className="text-xs text-stone-500 font-sans">
                Complimentary &bull; Instant Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
