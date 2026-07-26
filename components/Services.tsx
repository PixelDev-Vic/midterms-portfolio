"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Layers, Pen, Film, Smartphone, Sparkles, ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    icon: Layers,
    num: "01",
    title: "Brand Identity Systems",
    tagline: "01 // VISUAL DNA",
    desc: "Complete visual design direction: logo marks, typography scales, brand design systems, and editorial guidelines.",
    price: "FROM ₱3,500",
  },
  {
    icon: Pen,
    num: "02",
    title: "Digital Illustration",
    tagline: "02 // ART DIRECTION",
    desc: "Custom vector and raster artwork for editorial spreads, digital assets, package design, and poster graphics.",
    price: "FROM ₱500",
  },
  {
    icon: Film,
    num: "03",
    title: "Motion Graphics & 3D",
    tagline: "03 // MOTION DESIGN",
    desc: "Typographic reels, animated identity marks, and high-impact social clips engineered for visual engagement.",
    price: "FROM ₱2,500",
  },
  {
    icon: Smartphone,
    num: "04",
    title: "Social Media Systems",
    tagline: "04 // CAMPAIGN KITS",
    desc: "Structured content templates, story assets, and grid directions ensuring brand coherence across digital touchpoints.",
    price: "FROM ₱3,000",
  },
  {
    icon: Sparkles,
    num: "05",
    title: "Bespoke Commissions",
    tagline: "05 // SPECIAL PROJECTS",
    desc: "Custom creative briefs demanding high-concept artistic direction, hybrid media, or experimental design.",
    price: "CUSTOM QUOTE",
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="services" ref={ref} className="section-padding border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="micro-label mb-2 text-[var(--text-tertiary)]">
              02 — services &amp; capabilities
            </div>
            <h2 className="headline-lg font-bold lowercase tracking-tight text-[var(--text-primary)]">
              capabilities &amp; offerings.
            </h2>
          </div>
          <p className="body-large max-w-md text-sm text-[var(--text-secondary)]">
            Tailored visual direction executed with minimalist discipline and exacting standard.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card-bryl p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)]">
                    <svc.icon size={18} />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-tertiary)] font-bold">
                    {svc.num}
                  </span>
                </div>

                <div className="micro-label mb-1 text-[10px] text-[var(--text-tertiary)]">
                  {svc.tagline}
                </div>

                <h3 className="font-sans font-bold text-lg text-[var(--text-primary)] tracking-tight mb-3">
                  {svc.title}
                </h3>

                <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                  {svc.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[var(--text-primary)]">
                  {svc.price}
                </span>
                <button
                  onClick={handleContactClick}
                  className="flex items-center gap-1 font-mono text-[11px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors cursor-pointer bg-transparent border-none"
                >
                  INQUIRE <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
