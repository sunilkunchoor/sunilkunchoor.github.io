"use client";

import { Badge } from '@/components/ui/badge';
import { Github, Bot, Eye, Radio, Activity } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      id: 'traffic-light',
      title: '🚦 MLOps Traffic Light',
      description: 'Automated Model Governance as Code. A GitHub Actions "Gatekeeper" that enforces a quality gate on every PR — validating code quality, security posture (Snyk/Semgrep), and model performance regressions before a single line reaches production.',
      tech: ['Python', 'GitHub Actions', 'PyTest', 'Snyk', 'Semgrep'],
      icon: Radio,
      githubUrl: 'https://github.com/skunchoor/traffic-light-governance',
      gradient: 'from-[#7DF9FF]/20 to-transparent'
    },
    {
      id: 'adgenie',
      title: '🧞 AdGenie LLMOps',
      description: 'LLM Lifecycle Management with "Prompts as Code". End-to-end LLM pipeline with automated evaluation loops — GPT-4 acts as a judge to score prompt quality, enabling data-driven prompt engineering at scale with full MLflow lineage tracking.',
      tech: ['LangChain', 'MLflow', 'OpenAI', 'Azure', 'Python'],
      icon: Bot,
      githubUrl: 'https://github.com/skunchoor/ad-genie',
      gradient: 'from-[#9D00FF]/20 to-transparent'
    },
    {
      id: 'devops-monitor',
      title: '📡 Dynatrace DevOps Monitor',
      description: 'Unified Observability for ML Pipelines. A lightweight telemetry bridge that instruments every stage of a GitHub Actions ML workflow — sending metrics, traces, and events to Dynatrace for full pipeline visibility without vendor lock-in boilerplate.',
      tech: ['Python', 'GitHub Actions', 'Dynatrace', 'OpenTelemetry'],
      icon: Activity,
      githubUrl: 'https://github.com/skunchoor/dt-devops-monitor',
      gradient: 'from-pink-500/20 to-transparent'
    },
    {
      id: 'retail-lens',
      title: '👁️ Retail-Lens',
      description: 'AI-Powered Smart Shelf Vision. Computer vision system that empowers store associates to instantly identify out-of-stock items, misplaced products, and incorrect price tags — reducing shelf compliance issues in real time.',
      tech: ['Azure Vision', 'OpenCV', 'Docker', 'Python', 'Edge AI'],
      icon: Eye,
      githubUrl: 'https://github.com/skunchoor/retail-lens',
      gradient: 'from-blue-500/20 to-transparent'
    }
  ];

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-gradient-blue">Projects</span></h2>
            <p className="text-slate-400 max-w-xl">Deep engineering dive into automated governance, LLMOps, telemetry, and edge intelligence.</p>
          </div>
          <div className="flex space-x-4">
            <Badge variant="outline" className="px-4 py-1">MLOps</Badge>
            <Badge variant="outline" className="px-4 py-1">LLMOps</Badge>
            <Badge variant="outline" className="px-4 py-1">Cloud</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="glass-card rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:bg-white/[0.08] transition-all duration-500 min-h-[380px]"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${project.gradient} -z-10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-125`}></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <project.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all inline-block">
                    <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
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

