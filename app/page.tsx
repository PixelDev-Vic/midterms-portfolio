"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Ambient mesh gradient */}
      <div className="mesh-gradient" aria-hidden="true" />

      <Navbar />

      <Hero />

      <section id="about">
        <About />
      </section>

      <section id="services">
        <Services />
      </section>

      <section id="portfolio">
        <Portfolio />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />

      {/* Floating AI chatbot */}
      <Chatbot />
    </main>
  );
}
