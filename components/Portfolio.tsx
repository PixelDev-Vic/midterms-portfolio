"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ZoomIn, Loader2, ChevronDown, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface MediaItem {
  id: string;
  src: string;
  name: string;
  category: "photo" | "motion" | "brand";
  type: string;
  year?: string;
  dimensions?: string;
}

const FALLBACK_PORTFOLIO: MediaItem[] = [
  {
    id: "f1",
    name: "Aetheria Monochrome Editorial",
    category: "photo",
    type: "image",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    year: "2026",
    dimensions: "3840 x 2160",
  },
  {
    id: "f2",
    name: "KINETIC TYPE // MOTION REEL",
    category: "motion",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    year: "2025",
    dimensions: "1920 x 1080 • 60 FPS",
  },
  {
    id: "f3",
    name: "Architectural Form Study 09",
    category: "photo",
    type: "image",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    year: "2026",
    dimensions: "4000 x 3000",
  },
  {
    id: "f4",
    name: "VORTEX BRAND IDENTITY SYSTEM",
    category: "brand",
    type: "image",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    year: "2025",
    dimensions: "5000 x 3333",
  },
  {
    id: "f5",
    name: "FLUID DYNAMICS // 3D LOOP",
    category: "motion",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    year: "2026",
    dimensions: "3840 x 2160 • 4K",
  },
  {
    id: "f6",
    name: "Minimalist Typographic Poster",
    category: "brand",
    type: "image",
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    year: "2025",
    dimensions: "2400 x 3600",
  },
  {
    id: "f7",
    name: "Monochrome Studio Portraiture",
    category: "photo",
    type: "image",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    year: "2026",
    dimensions: "4500 x 3000",
  },
  {
    id: "f8",
    name: "SYNTHESIS // BRAND identity",
    category: "brand",
    type: "image",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    year: "2026",
    dimensions: "3200 x 2400",
  },
  {
    id: "f9",
    name: "Subtle Geometry // Spatial Art",
    category: "photo",
    type: "image",
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    year: "2025",
    dimensions: "3840 x 2560",
  },
];

export default function Portfolio() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "photo" | "motion" | "brand">("all");
  const [displayLimit, setDisplayLimit] = useState(9);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/upload");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: MediaItem[] = data.map((item: any) => ({
            id: item.id || item.src,
            src: item.src,
            name: item.name || "Untitled Work",
            category: (item.type?.toLowerCase().includes("video") ? "motion" : item.category ? item.category : "photo") as "motion" | "photo" | "brand",
            type: (item.type?.toLowerCase().includes("video") ? "video" : "image") as "image" | "video",
            year: item.year || "2026",
            dimensions: item.dimensions || "2400 x 1600",
          }));
          // Use Cloudinary uploaded assets as the primary portfolio source
          setItems(mapped);
        } else {
          setItems(FALLBACK_PORTFOLIO);
        }
      } catch {
        setItems(FALLBACK_PORTFOLIO);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  return (
    <>
      <div ref={ref} className="section-padding border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <div className="micro-label mb-2 text-[var(--text-tertiary)]">
                03 — gallery
              </div>
              <h2 className="headline-lg font-bold lowercase tracking-tight text-[var(--text-primary)]">
                selected works.
              </h2>
            </div>
            <p className="body-large max-w-md text-sm text-[var(--text-secondary)]">
              Curated collection of brand identity systems, digital visual art, motion experiments, and typography designs.
            </p>
          </motion.div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[var(--border)]">
            {[
              { id: "all", label: "01 // all works" },
              { id: "photo", label: "02 // photography & art" },
              { id: "motion", label: "03 // motion & 3d" },
              { id: "brand", label: "04 // brand identity" },
            ].map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id as any);
                    setDisplayLimit(9);
                  }}
                  className={active ? "chip-inverted cursor-pointer" : "chip-minimal cursor-pointer"}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Gallery Items Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 size={24} className="animate-spin text-[var(--text-tertiary)]" />
              <span className="micro-label text-[10px]">loading gallery index...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-24 border border-[var(--border)] rounded-xl">
              <p className="font-mono text-xs text-[var(--text-tertiary)]">
                [NO WORKS MATCH THE SELECTED CATEGORY]
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.slice(0, displayLimit).map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxIndex(i)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-bryl-resting hover:shadow-bryl-hover hover:border-[var(--border-strong)] transition-all duration-200"
                  >
                      {/* Inset Framing Accent */}
                      <div className="framed-inset aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/5 relative">
                        {item.type === "video" ? (
                          <div className="relative w-full h-full">
                            <video
                              src={item.src}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                              onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                            />
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                              <Play size={10} fill="currentColor" /> video
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            loading="lazy"
                          />
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between text-white">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                              {item.category === "motion" ? "MOTION // 3D" : item.category === "brand" ? "BRANDING" : "PHOTOGRAPHY"}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400">
                              {item.year || "2026"}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-sans font-bold text-base tracking-tight mb-1">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-1 font-mono text-[11px] text-gray-300">
                              <ZoomIn size={13} />
                              <span>INSPECT WORK ↗</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Caption */}
                      <div className="p-3.5 flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg)] font-mono text-xs">
                        <span className="truncate text-[var(--text-primary)] font-medium text-[13px]">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] shrink-0 ml-2 uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Load More Button */}
              {filteredItems.length > displayLimit && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 6)}
                    className="btn-secondary group font-mono text-xs uppercase tracking-wider py-2.5 px-6"
                  >
                    LOAD MORE WORKS
                    <ChevronDown size={14} className="transition-transform group-hover:translate-y-0.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Lightbox Modal with Next/Prev and ESC Controls */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all z-20 cursor-pointer"
              aria-label="Previous item"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all z-20 cursor-pointer"
              aria-label="Next item"
            >
              <ChevronRight size={20} />
            </button>

            {/* Main Lightbox Content Card */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full bg-[#111115] border border-white/10 rounded-2xl overflow-hidden shadow-bryl-modal text-white flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="uppercase text-gray-400">
                    {lightboxIndex + 1} / {filteredItems.length} — {activeItem.category}
                  </span>
                </div>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Media Body */}
              <div className="flex-1 overflow-auto flex items-center justify-center bg-black/60 p-4">
                {activeItem.type === "video" ? (
                  <video
                    src={activeItem.src}
                    controls
                    autoPlay
                    className="max-w-full max-h-[65vh] rounded-lg shadow-2xl"
                  />
                ) : (
                  <img
                    src={activeItem.src}
                    alt={activeItem.name}
                    className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-2xl"
                  />
                )}
              </div>

              {/* Bottom Details Footer */}
              <div className="p-5 border-t border-white/10 bg-[#16161c] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sans font-bold text-lg tracking-tight text-white mb-1">
                    {activeItem.name}
                  </h3>
                  <p className="font-mono text-xs text-gray-400">
                    JinzuuVisuals Art Direction &amp; Craft Collection
                  </p>
                </div>
                <div className="font-mono text-[11px] text-gray-400 flex items-center gap-4">
                  <span>{activeItem.dimensions || "High Resolution"}</span>
                  <span>•</span>
                  <span>{activeItem.year || "2026"}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
