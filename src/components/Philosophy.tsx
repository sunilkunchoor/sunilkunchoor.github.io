"use client";

import { Zap, Shield, Heart, Layers } from 'lucide-react';

export default function Philosophy() {
  const cards = [
    {
      title: "Zero-Friction for Data Scientists",
      desc: "Abstract away Kubernetes, Docker, and infrastructure entirely. Data Scientists should think in models and mathematics — not YAML files.",
      icon: Heart,
      color: "text-secondary"
    },
    {
      title: "Structure Begets Speed",
      desc: "Ad-hoc scripts don't scale to 50+ models in production. Enforcing strict project templates and CI/CD contracts makes every deployment repeatable, audit-ready, and automated.",
      icon: Layers,
      color: "text-blue-400"
    },
    {
      title: "Guardrails Enable Confidence",
      desc: "Strict governance (like the Traffic Light system) lets teams deploy faster — not slower — because safety is baked in, not bolted on.",
      icon: Shield,
      color: "text-primary"
    },
    {
      title: "Frugal Architecture",
      desc: "Cloud costs should not grow linearly with model usage. Optimised inference (ONNX, quantization, edge deployment) is not a nice-to-have; it's a first-class engineering concern.",
      icon: Zap,
      color: "text-yellow-400"
    }
  ];

  return (
    <section id="philosophy" className="py-24 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineering <span className="text-primary">Philosophy</span></h2>
          <p className="text-slate-400">Principles that guide my work in high-stakes AI production environments.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl group border-transparent hover:border-white/10 transition-all duration-300 flex flex-col h-full">
              <div className={`p-4 rounded-full bg-white/5 w-fit mb-8 group-hover:scale-110 transition-transform ${card.color}`}>
                <card.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors min-h-[56px] flex items-center">{card.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

