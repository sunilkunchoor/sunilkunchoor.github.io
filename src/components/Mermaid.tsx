"use client";

import { useEffect } from 'react';

export default function Mermaid() {
  useEffect(() => {
    const initMermaid = async () => {
      // Dynamically import mermaid on the client side
      const mermaid = (await import('mermaid')).default;
      
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
          background: '#0b0f19',
          primaryColor: '#7df9ff',
          primaryTextColor: '#f8fafc',
          lineColor: '#334155',
          secondaryColor: '#9d00ff',
        }
      });
      
      const elements = document.querySelectorAll('pre code.language-mermaid');
      if (elements.length === 0) return;

      elements.forEach((el, index) => {
        const code = el.textContent;
        if (code) {
          const container = document.createElement('div');
          container.className = 'mermaid my-8 flex justify-center bg-slate-950/60 p-6 rounded-xl border border-white/5';
          container.id = `mermaid-${index}`;
          container.textContent = code.trim();
          
          const pre = el.parentElement;
          if (pre && pre.tagName === 'PRE') {
            pre.parentNode?.replaceChild(container, pre);
          }
        }
      });
      
      // Run mermaid rendering manually on the new elements
      await mermaid.run();
    };

    initMermaid().catch((err) => console.error("Mermaid initialization failed:", err));
  }, []);

  return null;
}
