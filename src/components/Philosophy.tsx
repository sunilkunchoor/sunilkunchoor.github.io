"use client";

import { Zap, Shield, Heart } from 'lucide-react';

export default function Philosophy() {
  const cards = [
    {
      title: "Guardrails Enable Speed",
      desc: "Governance isn't a bottleneck—it builds the confidence needed to ship AI at scale without breaking systems.",
      icon: Shield,
      color: "text-primary"
    },
    {
      title: "Frugal Architecture",
      desc: "Optimized inference costs and resource allocation. Every dollar saved on cloud spend is a dollar earned for innovation.",
      icon: Zap,
      color: "text-yellow-400"
    },
    {
      title: "DevEx Focus",
      desc: "Abstracting complexity so Data Scientists can focus on modeling while the platform handles the 'plumbing' automatically.",
      icon: Heart,
      color: "text-secondary"
    }
  ];

  return (
    <section id="philosophy" className="py-24 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineering <span className="text-primary">Philosophy</span></h2>
          <p className="text-slate-400">Principles that guide my work in high-stakes AI production environments.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div key={i} className="glass-card p-10 rounded-2xl group border-transparent hover:border-white/10 transition-all duration-300">
              <div className={`p-4 rounded-full bg-white/5 w-fit mb-8 group-hover:scale-110 transition-transform ${card.color}`}>
                <card.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{card.title}</h3>
              <p className="text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
