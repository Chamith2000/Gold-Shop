import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "motion/react";

export interface BreadcrumbItem {
  label: string;
  view?: string;
  params?: Record<string, string>;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-label="Breadcrumb"
      className="py-3 px-4 sm:px-6 max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-stone-500 font-sans overflow-x-auto whitespace-nowrap scrollbar-none"
    >
      <button
        onClick={() => onNavigate("home")}
        className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#5A0F1B] transition-colors font-medium py-1 px-1.5 rounded hover:bg-stone-100/70"
        title="Return to Boutique Home"
      >
        <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="font-cinzel text-[11px] uppercase tracking-wider">Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" />
            {isLast || !item.view ? (
              <span
                className="font-semibold text-[#5A0F1B] py-1 px-1.5 bg-[#FAF3E8] rounded border border-[#D4AF37]/30 text-[11px] font-cinzel tracking-wider uppercase"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.view!, item.params)}
                className="text-stone-600 hover:text-[#5A0F1B] transition-colors py-1 px-1.5 rounded hover:bg-stone-100/70 text-[11px] font-medium"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </motion.nav>
  );
};
