"use client";

import { ShieldCheck, Cloud, Zap, Database } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Total Experience', value: '10+ Years', icon: Database },
    { label: 'MLOps Specialization', value: '3.5+ Years', icon: Zap },
    { label: 'Cloud Focus', value: 'Azure & Databricks', icon: Cloud },
    { label: 'Reliability', value: 'Self-healing Systems', icon: ShieldCheck },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              From Notebooks to <span className="text-primary">Scalable Platforms</span>
            </h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                I specialize in building scalable, secure, and self-healing AI platforms. I help enterprises navigate the complex transition from experimental Jupyter notebooks to robust, production-grade cloud environments.
              </p>
              <p>
                My approach focuses on creating automated governance and robust monitoring systems that empower Data Scientists rather than slowing them down. I believe that MLOps isn't just about automation—it's about building trust in AI.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-12">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-xl hover:bg-white/10 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass-card aspect-square rounded-2xl overflow-hidden flex items-center justify-center p-12">
              <div className="relative w-full h-full border border-white/10 rounded-xl flex flex-col items-center justify-center text-center space-y-6 bg-slate-900/40">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Cloud className="w-12 h-12 text-primary" />
                </div>
                <div className="px-8">
                  <div className="text-2xl font-bold mb-2">Enterprise Ready</div>
                  <p className="text-slate-400">Deploying LLMs and Computer Vision models to edge and cloud with zero-downtime architectures.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
