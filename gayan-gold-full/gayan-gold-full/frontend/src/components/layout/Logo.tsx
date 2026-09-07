import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  theme?: "dark" | "light" | "gold";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  theme = "dark",
}) => {
  const sizeMap = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textColors = {
    dark: "text-[#5A0F1B]",
    light: "text-white",
    gold: "text-[#D4AF37]",
  };

  const subtitleColors = {
    dark: "text-[#B54E0E]",
    light: "text-[#F3E5AB]",
    gold: "text-[#AA771C]",
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none flex-nowrap shrink-0 ${className}`}>
      {/* Precision Circular Vector Logo */}
      <div className={`relative ${sizeMap[size]} flex-shrink-0 aspect-square`}>
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBA54" />
              <stop offset="30%" stopColor="#FFEAA7" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#AA771C" />
              <stop offset="100%" stopColor="#8A5A00" />
            </linearGradient>
            <linearGradient id="maroonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#781726" />
              <stop offset="100%" stopColor="#400A13" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Ring */}
          <circle cx="200" cy="200" r="190" stroke="url(#goldGradient)" strokeWidth="4" fill="none" />
          <circle cx="200" cy="200" r="182" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />

          {/* Flanking Ornate Medallions */}
          <circle cx="20" cy="200" r="14" fill="#FAF8F5" stroke="url(#goldGradient)" strokeWidth="3" />
          <circle cx="20" cy="200" r="6" fill="url(#goldGradient)" />
          <circle cx="380" cy="200" r="14" fill="#FAF8F5" stroke="url(#goldGradient)" strokeWidth="3" />
          <circle cx="380" cy="200" r="6" fill="url(#goldGradient)" />

          {/* Central Stylized G-H Monogram */}
          <path
            d="M 200 80 C 133.7 80 80 133.7 80 200 C 80 266.3 133.7 320 200 320 C 255 320 301 283 315 233 L 265 233 C 253 258 228 276 200 276 C 158 276 124 242 124 200 C 124 158 158 124 200 124 C 228 124 253 142 265 167 L 315 167 C 301 117 255 80 200 80 Z"
            fill="url(#goldGradient)"
          />
          {/* Inner H Crossbar Structure */}
          <path
            d="M 165 155 L 195 155 L 195 245 L 165 245 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M 205 155 L 235 155 L 235 245 L 205 245 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M 185 185 L 215 185 L 215 215 L 185 215 Z"
            fill="url(#goldGradient)"
          />

          {/* Top Traditional Crest Medallion */}
          <circle cx="200" cy="115" r="46" fill="#FAF8F5" stroke="url(#goldGradient)" strokeWidth="3" />
          {/* Traditional Auspicious Crest Details (Trident, Conch, Bow, Bangle) */}
          <path d="M 200 80 L 200 150 M 190 92 L 200 75 L 210 92" stroke="#B54E0E" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="178" cy="112" r="10" stroke="#B54E0E" strokeWidth="2" fill="none" />
          <path d="M 216 100 Q 230 115 220 130 Q 212 118 216 100 Z" fill="#B54E0E" />
          <path d="M 185 138 C 175 125 175 105 185 92" stroke="#B54E0E" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left justify-center shrink-0 min-w-max">
          <span
            className={`font-cinzel tracking-[0.14em] font-bold uppercase leading-tight whitespace-nowrap block ${textColors[theme]} ${
              size === "sm" ? "text-sm" : size === "md" ? "text-lg" : size === "lg" ? "text-2xl" : "text-3xl"
            }`}
          >
            Gayan Gold House
          </span>
          <span
            className={`font-sans tracking-[0.24em] text-[10px] sm:text-xs font-semibold uppercase whitespace-nowrap block mt-0.5 ${subtitleColors[theme]}`}
          >
            Jem And Jewellery
          </span>
        </div>
      )}
    </div>
  );
};
