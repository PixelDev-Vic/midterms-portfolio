"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleScrollToWork = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden border-b border-[var(--border)]"
    >
      {/* Halftone Dot Motif Background Accent */}
      <div
        className="absolute inset-0 halftone-pattern halftone-fade pointer-events-none opacity-60"
        aria-hidden="true"
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Micro-label tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="chip-inverted inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            00 // VISUAL STUDIO & ART DIRECTION
          </div>
        </motion.div>

        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="headline-xl font-bold uppercase tracking-tight mb-6 text-[var(--text-primary)]"
        >
          VISUALS THAT SPEAKS.
        </motion.h1>

        {/* Body Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="body-large max-w-2xl mx-auto mb-10 text-[var(--text-secondary)] font-sans"
        >
          JinzuuVisuals designs editorial brand identities, high-impact digital artworks, and motion graphics with restrained minimalism and spatial clarity.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={handleScrollToWork}
            className="btn-primary group font-mono text-xs uppercase tracking-wider py-3 px-6"
          >
            explore gallery
            <ArrowDownRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </button>
          <button
            onClick={handleScrollToContact}
            className="btn-secondary group font-mono text-xs uppercase tracking-wider py-3 px-6"
          >
            start a project
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>

        {/* Stat Grid with 1px Hairline Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl grid grid-cols-3 border border-[var(--border)] rounded-xl divide-x divide-[var(--border)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm"
        >
          {[
            { tag: "01 // DELIVERED", val: "120+", label: "selected works" },
            { tag: "02 // CLIENT RATING", val: "4.9★", label: "satisfaction" },
            { tag: "03 // PRACTICE", val: "3+ YEARS", label: "visual direction" },
          ].map((st) => (
            <div key={st.tag} className="p-5 text-center flex flex-col items-center justify-center">
              <span className="micro-label mb-1 text-[10px] opacity-70">{st.tag}</span>
              <span className="font-sans font-bold text-2xl tracking-tight text-[var(--text-primary)]">
                {st.val}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-secondary)] mt-0.5">
                {st.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
