"use client";

import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      company: "TATA CONSULTANCY SERVICES",
      location: "London, UK",
      period: "Sep 2022 – Present",
      role: "Senior MLOps Engineer",
      description: "Deployed and managed end-to-end ML infrastructure for a Tier-1 UK Retailer.",
      achievements: [
        "Architected a 'Traffic Light' deployment validation system, reducing deployment lead time by 83% (from 2 hours to 20 minutes).",
        "Managed a robust ML platform on Azure Cloud, utilizing Databricks and Azure Kubernetes Service (AKS).",
        "Consolidated fragmented feature tables into a centralized Feature Store, accelerating feature engineering lifecycle by 40%.",
        "Enforced strict compliance and GDPR standards across the Data Science lifecycle.",
        "Designed operational dashboards for model drift and system health monitoring."
      ]
    },
    {
      company: "DAVE.AI",
      location: "Bangalore, India",
      period: "Aug 2021 – Aug 2022",
      role: "Data Scientist (ML Engineer Focus)",
      description: "Focused on Edge AI optimization and cost-effective infrastructure.",
      achievements: [
        "Partnered with Intel to optimize ASR and NLP models using OpenVINO for edge device deployment.",
        "Reduced infrastructure cost per store by 40% through re-architected inference engines.",
        "Developed ASR models achieving a Word Error Rate (WER) of 0.1–0.2 across Banking and Retail domains."
      ]
    },
    {
      company: "ANSRSOURCE",
      location: "Bangalore, India",
      period: "Apr 2016 – Aug 2021",
      role: "Business Analyst / Product Lead",
      description: "Led product strategy and automation initiatives.",
      achievements: [
        "Built and trained a team of 70 professionals, generating an ARR of $1.5 Million USD.",
        "Developed 'Skywalker,' an in-house QA tool that reduced manual effort by 60% and improved accuracy to 99.5%."
      ]
    },
    {
      company: "ANSRSOURCE",
      location: "Bangalore, India",
      period: "June 2014 – Apr 2016",
      role: "Content Programmer",
      description: "Foundation in software engineering and web platforms.",
      achievements: [
        "Developed interactive e-learning platforms using Python, Django, and Flask."
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional <span className="text-primary">Experience</span></h2>
          <p className="text-slate-400">A decade of engineering excellence across the UK and India.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 md:pl-0">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
              
              <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-slate-950 md:-translate-x-1/2 z-10 shadow-[0_0_10px_rgba(125,249,255,0.5)]" />
                
                <div className="w-full md:w-1/2">
                  <div className={`glass-card p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all duration-500 group ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`flex items-center gap-2 mb-2 text-primary font-mono text-sm ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </div>
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{exp.role}</h3>
                    <div className={`flex items-center gap-2 text-slate-300 font-semibold mb-4 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <Briefcase className="w-4 h-4" />
                      {exp.company}
                      <span className="text-slate-500">•</span>
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </div>
                    <p className="text-slate-400 mb-6 italic">{exp.description}</p>
                    
                    <ul className={`space-y-3 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className={`flex items-start gap-3 text-slate-400 text-sm leading-relaxed ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : 'text-left'}`}>
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:block w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
