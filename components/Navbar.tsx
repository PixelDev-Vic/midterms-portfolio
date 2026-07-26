"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "#about", num: "01", label: "about" },
  { href: "#services", num: "02", label: "services" },
  { href: "#portfolio", num: "03", label: "gallery" },
  { href: "#contact", num: "04", label: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-[var(--bg)]/90 backdrop-blur-md border-[var(--border)] py-3 shadow-sm"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-10 flex items-center justify-between relative">
          
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 group cursor-pointer"
            whileHover={{ scale: 1.01 }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)] animate-pulse" />
            <span className="font-bold tracking-tight text-lg uppercase text-[var(--text-primary)]">
              jinzuu<span className="font-mono text-xs font-normal text-[var(--text-tertiary)] ml-1">.visuals</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="group flex items-center gap-1.5 text-xs font-mono tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-transparent border-none cursor-pointer"
              >
                <span className="text-[10px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {link.num}
                </span>
                <span className="lowercase font-sans text-sm font-medium">
                  {link.label}
                </span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-8 h-8 rounded-md flex items-center justify-center border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}

            <button
              onClick={() => handleNavClick("#contact")}
              className="hidden md:flex btn-primary text-xs font-mono uppercase tracking-wider py-1.5 px-3.5"
            >
              inquire <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              className="md:hidden w-8 h-8 rounded-md flex items-center justify-center border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-4 right-4 z-40 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-6 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center justify-between text-left py-2 border-b border-[var(--border)] text-[var(--text-primary)] bg-transparent font-sans text-base font-medium"
                >
                  <span className="lowercase">{link.label}</span>
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">{link.num}</span>
                </button>
              ))}
              <button
                onClick={() => handleNavClick("#contact")}
                className="btn-primary w-full py-3 justify-center text-xs font-mono uppercase tracking-wider mt-2"
              >
                inquire project <ArrowUpRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
