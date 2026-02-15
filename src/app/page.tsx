"use client";

import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Philosophy from '@/components/Philosophy';
import TechStack from '@/components/TechStack';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Background />
      <Navbar />
      
      <div className="relative z-10">
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <Philosophy />
        <Footer />
      </div>
    </main>
  );
}
