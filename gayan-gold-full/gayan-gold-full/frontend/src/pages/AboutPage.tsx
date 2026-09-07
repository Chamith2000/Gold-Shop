import React from "react";
import { ShieldCheck, Gem, Sparkles, Award, MapPin, CheckCircle2 } from "lucide-react";
import { Logo } from "../components/layout/Logo";

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            50+ Years of Sri Lankan Goldsmithing
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            The Royal Legacy of Gayan Gold House
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-stone-600 font-sans leading-relaxed">
            Founded along the historic jewellery streets of Colombo and Kandy, Gayan Gold House stands as a bastion of authentic 22K and 24K sovereign gold craftsmanship and ethical Ceylon gemstone curation.
          </p>
        </div>

        {/* Brand Story & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="aspect-4/3 rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-xl bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"
                alt="Traditional Goldsmith hand-carving gold heirloom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#5A0F1B] text-[#FAF8F5] p-5 rounded-2xl border border-[#D4AF37] shadow-xl hidden sm:block max-w-xs">
              <Logo size="sm" theme="light" />
              <p className="text-[11px] text-[#F3E5AB] font-sans mt-2">
                Certified by the National Gem and Jewellery Authority of Sri Lanka with official assay stamp.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-stone-700 font-sans text-xs sm:text-sm leading-relaxed">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#5A0F1B]">
              Master Artistry Preserved Across Generations
            </h2>
            <p>
              Every ceremonial necklace, sovereign bangle, and gemstone ring crafted under the Gayan Gold House seal is shaped by generational artisans skilled in traditional Sri Lankan repoussé, filigree, and precision bezel setting.
            </p>
            <p>
              We pride ourselves on 100% transparency. Our showroom in Sea Street, Pettah, houses advanced electronic density balances and X-ray fluorescence (XRF) gold assay testing spectrometers so our patrons can verify their gold purity before taking delivery.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <span className="font-cinzel text-xl font-bold text-[#5A0F1B] block">10,000+</span>
                <span className="text-xs text-stone-500">Bridal Sets Cast</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <span className="font-cinzel text-xl font-bold text-[#5A0F1B] block">100%</span>
                <span className="text-xs text-stone-500">Conflict-Free Gems</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="bg-[#FAF3E8] border border-[#D4AF37]/50 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-cinzel text-2xl font-bold text-[#5A0F1B] uppercase tracking-wider">
              Our Assay &amp; Ethical Commitments
            </h3>
            <p className="text-xs text-stone-600 font-sans">
              Setting the standard for transparency, purity, and heritage in Sri Lankan jewellery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#5A0F1B]" />
              <h4 className="font-cinzel text-sm font-bold text-stone-900">Assay Hallmarked</h4>
              <p className="text-xs text-stone-500">
                All 22K and 24K sovereigns guaranteed with government assay hallmarks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <Gem className="w-6 h-6 text-[#5A0F1B]" />
              <h4 className="font-cinzel text-sm font-bold text-stone-900">Natural Ceylon Gems</h4>
              <p className="text-xs text-stone-500">
                Ethically unmined in Ratnapura and Elahera, verified by certified gemologists.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <Award className="w-6 h-6 text-[#5A0F1B]" />
              <h4 className="font-cinzel text-sm font-bold text-stone-900">Lifetime Buyback</h4>
              <p className="text-xs text-stone-500">
                Guaranteed gold value buyback at prevailing market bullion rates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <Sparkles className="w-6 h-6 text-[#5A0F1B]" />
              <h4 className="font-cinzel text-sm font-bold text-stone-900">Bespoke Fitting</h4>
              <p className="text-xs text-stone-500">
                Complimentary lifetime cleaning, resizing, and prong re-tightening for all pieces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
