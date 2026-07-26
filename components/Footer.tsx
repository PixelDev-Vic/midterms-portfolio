"use client";

import { motion } from "framer-motion";
import { Facebook, Linkedin, Youtube, ArrowUp } from "lucide-react";

const SOCIAL_LINKS = [
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/xvtreh/"
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/victor-emmanuel-pascua-b3756a346/"
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://www.youtube.com/@jinzuvisuals"
  },
];

const NAV = [
  { label: "01 / ABOUT", href: "#about" },
  { label: "02 / SERVICES", href: "#services" },
  { label: "03 / PORTFOLIO", href: "#portfolio" },
  { label: "04 / CONTACT", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] relative py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[var(--border)]">

          {/* Brand Monogram */}
          <div>
            <div
              onClick={scrollToTop}
              className="flex items-center gap-2 cursor-pointer group mb-2"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--text-primary)]" />
              <span className="font-sans font-bold text-lg tracking-tight lowercase text-[var(--text-primary)]">
                jinzuu visuals
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
              MINIMALIST VISUAL ART DIRECTION
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap gap-6 font-mono text-xs text-[var(--text-secondary)]">
            {NAV.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="hover:text-[var(--text-primary)] transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Socials & Top Action */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-8 h-8 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <social.icon size={14} />
              </motion.a>
            ))}

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-8 h-8 rounded-md border border-[var(--border-strong)] bg-[var(--bg)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <ArrowUp size={14} />
            </button>
          </div>

        </div>

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 font-mono text-[11px] text-[var(--text-tertiary)]">
          <p>© {year} JINZUU VISUALS. ALL RIGHTS RESERVED.</p>
          <p className="uppercase tracking-widest text-[10px]">

          </p>
        </div>
      </div>
    </footer>
  );
}