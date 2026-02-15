"use client";

import { GraduationCap, Calendar, BookOpen } from 'lucide-react';

export default function Education() {
  const education = [
    {
      degree: "Post Graduate Program – AI & ML",
      institution: "Great Learning (University of Texas, Austin)",
      period: "2021 – 2022",
      description: "Specialized training in Artificial Intelligence and Machine Learning, focusing on deep learning, computer vision, and NLP."
    },
    {
      degree: "Master of Science (Mathematics)",
      institution: "Bangalore University",
      period: "2012 – 2014",
      description: "Advanced mathematics degree providing the theoretical and statistical foundation for machine learning algorithms and data science."
    }
  ];

  return (
    <section id="education" className="py-24 relative bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Academic <span className="text-primary">Background</span></h2>
          <p className="text-slate-400">The theoretical foundations of my engineering practices.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <div key={index} className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap className="w-16 h-16 text-primary" />
              </div>
              
              <div className="flex items-center gap-2 text-primary font-mono text-sm mb-4">
                <Calendar className="w-4 h-4" />
                {edu.period}
              </div>
              
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{edu.degree}</h3>
              
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-4">
                <BookOpen className="w-4 h-4 text-primary/70" />
                {edu.institution}
              </div>
              
              <p className="text-slate-400 leading-relaxed text-sm">
                {edu.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
