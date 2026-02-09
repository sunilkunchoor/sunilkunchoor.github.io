"use client";

import { useEffect, useState } from 'react';
import { generateDataBackground } from '@/ai/flows/generate-data-background';

export default function Background() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBackground() {
      try {
        const result = await generateDataBackground({
          prompt: "Subtle dark engineering grid with floating blue and purple data particles, cinematic, 4k."
        });
        setVideoUri(result.backgroundDataUri);
      } catch (error) {
        console.error("Failed to generate background:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBackground();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Animated Video Background */}
      {videoUri && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
        >
          <source src={videoUri} type="video/mp4" />
        </video>
      )}

      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
    </div>
  );
}
