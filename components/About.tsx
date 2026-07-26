"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Compass, Sparkles, Sliders } from "lucide-react";

const VALUES = [
  {
    icon: Compass,
    tag: "01 // CRAFT",
    title: "Precision Craftsmanship",
    desc: "Every pixel is intentional. Obsessive attention to typographic rhythm, negative space, and contrast balance.",
  },
  {
    icon: Sparkles,
    tag: "02 // IMPACT",
    title: "Restrained Impact",
    desc: "Visuals that resonate without shouting. Stripping away non-essentials to reveal pure graphic substance.",
  },
  {
    icon: Sliders,
    tag: "03 // PURPOSE",
    title: "Strategic Clarity",
    desc: "Connecting brand vision with editorial direction through clear design systems and reproducible standards.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div id="about" ref={ref} className="section-padding border-b border-[var(--border)] relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column — Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="micro-label mb-2 text-[var(--text-tertiary)]">
              01 — about studio
            </div>
            <h2 className="headline-lg font-bold lowercase tracking-tight mb-6 text-[var(--text-primary)]">
              designing clarity through visual discipline.
            </h2>
            <p className="body-large mb-6">
              JinzuuVisuals is an independent visual practice led by passion for minimalist typography, monochrome art direction, and editorial visual structures.
            </p>
            <p className="font-sans text-sm leading-relaxed mb-8 text-[var(--text-secondary)]">
              With over three years of dedicated work crafting brand identities, motion clips, and digital editorial systems, we reduce complexity into quiet, high-impact aesthetic statements.
            </p>

            {/* Core Values */}
            <div className="flex flex-col gap-4">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-md border border-[var(--border-strong)] flex items-center justify-center shrink-0 bg-[var(--bg)] text-[var(--text-primary)]">
                    <v.icon size={15} />
                  </div>
                  <div>
                    <div className="micro-label text-[10px] text-[var(--text-tertiary)] mb-0.5">{v.tag}</div>
                    <h3 className="font-sans font-bold text-sm text-[var(--text-primary)] mb-1">
                      {v.title}
                    </h3>
                    <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Abstract Halftone Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] p-8 flex flex-col justify-between shadow-bryl-resting">
              {/* Background Halftone Pattern */}
              <div className="absolute inset-0 halftone-pattern opacity-40 pointer-events-none" />

              {/* Top Card Info */}
              <div className="relative z-10 flex items-center justify-between font-mono text-xs">
                <span className="chip-inverted">EST. 2023</span>
                <span className="text-[var(--text-tertiary)] uppercase tracking-widest text-[10px]">
                  [MONOCHROME SPECS]
                </span>
              </div>

              {/* Center Monogram Typography */}
              <div className="relative z-10 text-center my-auto">
                <div className="font-sans font-bold text-7xl md:text-8xl tracking-tighter text-[var(--text-primary)] lowercase mb-2">
                  jinzuu
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
                  ART DIRECTION &amp; VISUAL DESIGN
                </div>
              </div>

              {/* Bottom Inset Frame */}
              <div className="relative z-10 pt-4 border-t border-[var(--border)] flex items-center justify-between font-mono text-[11px] text-[var(--text-secondary)]">
                <span>SYSTEM: SPACE GROTESK</span>
                <span>STATUS: AVAILABLE</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
