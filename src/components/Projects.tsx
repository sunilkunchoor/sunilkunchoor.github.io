"use client";

import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Code2, Bot, Eye, Radio } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      id: 'traffic-light',
      title: '🚦 MLOps Traffic Light',
      description: 'Automated Governance System. Validates models for accuracy, latency, and security (Snyk) before production deployment.',
      tech: ['Python', 'GitHub Actions', 'Snyk', 'Pytest'],
      icon: Radio,
      size: 'large',
      gradient: 'from-[#7DF9FF]/20 to-transparent'
    },
    {
      id: 'adgenie',
      title: '🧞 AdGenie LLMOps',
      description: "GenAI Pipeline treating 'Prompts as Code' with automated LLM-as-a-judge evaluation loops.",
      tech: ['LangChain', 'MLflow', 'Azure OpenAI'],
      icon: Bot,
      size: 'small',
      gradient: 'from-[#9D00FF]/20 to-transparent'
    },
    {
      id: 'retail-lens',
      title: '👁️ Retail-Lens Edge',
      description: 'Self-healing Computer Vision. Detects data drift on edge devices and syncs hard examples to cloud for retraining.',
      tech: ['ONNX', 'Docker', 'OpenVINO', 'FastAPI'],
      icon: Eye,
      size: 'small',
      gradient: 'from-blue-500/20 to-transparent'
    }
  ];

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-gradient-blue">Projects</span></h2>
            <p className="text-slate-400 max-w-xl">Deep engineering dive into automated governance, LLMOps, and edge intelligence.</p>
          </div>
          <div className="flex space-x-4">
            <Badge variant="outline" className="px-4 py-1">MLOps</Badge>
            <Badge variant="outline" className="px-4 py-1">LLMOps</Badge>
            <Badge variant="outline" className="px-4 py-1">Cloud</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`glass-card rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:bg-white/[0.08] transition-all duration-500 ${
                project.size === 'large' ? 'md:col-span-2' : ''
              }`}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${project.gradient} -z-10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-125`}></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <project.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                  <ExternalLink className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
