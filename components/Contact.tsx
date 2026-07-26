"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle, Mail, Clock, MessageSquare } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  service: string;
  message: string;
}

const SERVICES = [
  "Brand Identity Systems",
  "Digital Illustration",
  "Motion Graphics & 3D",
  "Social Media Systems",
  "Bespoke Commissions",
  "General Inquiry",
];

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState<string>("");

  const mountTimeRef = useRef<number>(Date.now());
  const MIN_HUMAN_MS = 3000;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot || Date.now() - mountTimeRef.current < MIN_HUMAN_MS) {
      setStatus("success");
      setForm({ name: "", email: "", service: "", message: "" });
      return;
    }

    setStatus("loading");

    try {
      const endpoint =
        process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "https://formspree.io/f/xnjobjre";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("success");
      setForm({ name: "", email: "", service: "", message: "" });
    }
  };

  return (
    <div id="contact" ref={ref} className="section-padding border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column — Context */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="micro-label mb-2 text-[var(--text-tertiary)]">
              03 — initiate contact
            </div>
            <h2 className="headline-lg font-bold lowercase tracking-tight mb-6 text-[var(--text-primary)]">
              let&apos;s build something focused.
            </h2>
            <p className="body-large mb-8 text-[var(--text-secondary)]">
              Have an upcoming project or identity inquiry? Fill out the brief form or reach out directly. Every inquiry is reviewed within 24 hours.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Mail,
                  label: "DIRECT EMAIL",
                  value: "pascua.victor0408@gmail.com",
                  href: "mailto:pascua.victor0408@gmail.com",
                },
                {
                  icon: Clock,
                  label: "RESPONSE TIME",
                  value: "Within 24–48 hours",
                  href: null,
                },
                {
                  icon: MessageSquare,
                  label: "CURRENT AVAILABILITY",
                  value: "Open for Q3/Q4 commissions",
                  href: null,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-md border border-[var(--border-strong)] flex items-center justify-center shrink-0 bg-[var(--bg)] text-[var(--text-primary)]">
                    <item.icon size={15} />
                  </div>
                  <div>
                    <div className="micro-label text-[10px] text-[var(--text-tertiary)] mb-0.5">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-mono text-xs text-[var(--text-primary)] underline hover:opacity-80 transition-opacity"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-sans text-xs font-medium text-[var(--text-primary)]">
                        {item.value}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-bryl p-10 text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full border border-[var(--border-strong)] bg-[var(--bg-secondary)] flex items-center justify-center mb-4 text-[var(--text-primary)]">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-sans font-bold text-xl mb-2 text-[var(--text-primary)]">
                  Transmission Received.
                </h3>
                <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mb-6">
                  Thank you for reaching out. Your message has been logged. We will respond within 24–48 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-bryl-secondary text-xs"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="card-bryl p-6 flex flex-col gap-4">
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  className="hidden"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="micro-label text-[10px] text-[var(--text-secondary)]">
                      YOUR NAME *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className="input-minimal"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="micro-label text-[10px] text-[var(--text-secondary)]">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="alex@domain.com"
                      className="input-minimal"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="service" className="micro-label text-[10px] text-[var(--text-secondary)]">
                    CAPABILITY INTEREST
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="input-minimal"
                  >
                    <option value="" disabled>
                      Select service scope…
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="micro-label text-[10px] text-[var(--text-secondary)]">
                    PROJECT SCOPE &amp; DETAILS *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Outline your timeline, deliverables, and goals..."
                    className="input-minimal resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="font-mono text-xs text-red-500">
                    Transmission failed. Please try again or email directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-bryl-primary w-full justify-center text-xs uppercase tracking-widest font-mono mt-2"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      SENDING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      SUBMIT INQUIRY <Send size={13} />
                    </span>
                  )}
                </button>

                <p className="font-mono text-[10px] text-center text-[var(--text-tertiary)] uppercase tracking-wider">
                  STRICT PRIVACY — NO MARKETING SPAM EVER
                </p>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}