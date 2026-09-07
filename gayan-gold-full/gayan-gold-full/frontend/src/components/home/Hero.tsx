import React from "react";
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Gem } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onExploreCollections: () => void;
  onBookAppointment: () => void;
  onOpenLuckyWheel?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCollections,
  onBookAppointment,
  onOpenLuckyWheel,
}) => {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2B040B] via-[#4A0B15] to-[#1E0207] text-white">
      {/* Subtle Pattern & Ambient Gold Light Overlays */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#B54E0E]/20 blur-3xl pointer-events-none"
      />

      {/* Decorative Gold Border Line at Top and Bottom */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A0F1B]/80 border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-semibold tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin-slow" />
            Sri Lanka's Royal Gem &amp; Sovereign Gold Boutique
          </motion.div>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Timeless Elegance, <br />
            <span className="bg-gradient-to-r from-[#FFEAA7] via-[#D4AF37] to-[#B54E0E] bg-clip-text text-transparent">
              Royal Sri Lankan Craft
            </span>
          </h1>

          <p className="text-stone-300 font-sans text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            Discover hallmarked 22K and 24K pure gold heirlooms, authenticated Ceylon Royal Blue Sapphires, and bespoke bridal masterworks hand-finished by master jewelers in Colombo &amp; Kandy.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onExploreCollections}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C59B27] text-[#30050D] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-[#D4AF37]/20 flex items-center justify-center gap-2 group cursor-pointer"
              id="hero-explore-collections-btn"
            >
              Explore Master Collections
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onBookAppointment}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-[#D4AF37]/60 text-white font-cinzel text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-xl transition-all backdrop-blur-xs flex items-center justify-center gap-2 cursor-pointer"
              id="hero-book-appointment-btn"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              Book VIP Viewing
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#5A0F1B]/80 text-left">
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4AF37] block">
                22K &amp; 24K
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 font-sans">
                Assay Hallmark Certified
              </span>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4AF37] block">
                100% Pure
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 font-sans">
                Natural Ceylon Sapphires
              </span>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4AF37] block">
                50+ Years
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 font-sans">
                Bespoke Heritage
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Hero Visual Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 relative"
        >
          <div className="relative mx-auto max-w-md rounded-2xl p-2 bg-gradient-to-b from-[#D4AF37]/50 via-[#5A0F1B]/40 to-[#D4AF37]/30 shadow-2xl">
            <div className="overflow-hidden rounded-xl bg-[#1E0207] relative aspect-[4/5] border border-[#D4AF37]/40 group">
              <img
                src="https://i.pinimg.com/1200x/87/10/d5/8710d57ea02996eea94b2bb6a7f32948.jpg"
                alt="Gayan Gold House Signature Sovereign Necklace"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />


              {/* Floating Royal Tier Tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#2B040B]/95 backdrop-blur-md border border-[#D4AF37]/60 p-3 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                    Royal Bridal Masterpiece
                  </span>
                  <span className="font-cinzel text-xs sm:text-sm font-bold text-white">
                    Padparadscha Empress Choker (22K)
                  </span>
                </div>

                {onOpenLuckyWheel && (
                  <button
                    onClick={onOpenLuckyWheel}
                    className="bg-[#B54E0E] hover:bg-[#8A3B0A] text-white text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Spin &amp; Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

