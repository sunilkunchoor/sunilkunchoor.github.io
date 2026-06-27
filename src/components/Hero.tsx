"use client";

import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">Senior MLOps & AI Platform Engineer</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Engineering Production-Grade <span className="text-gradient-blue">MLOps & AI Platforms</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Bridging the gap between Data Science innovation and Production reliability. Deployed on Azure, Databricks, and Edge AI. Focused on LLMOps, Model Governance, and Cost Optimization.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Button asChild className="btn-primary h-12 px-8">
            <Link href="#projects">
              View Projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild className="btn-secondary h-12 px-8">
            <Link href="https://www.linkedin.com/in/sunilkunchoor" target="_blank">
              Contact Me
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

