"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { generateDataBackground } from '@/ai/flows/generate-data-background';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Background() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fallbackImage = PlaceHolderImages.find(img => img.id === 'mlops-bg');

  useEffect(() => {
    async function loadBackground() {
      try {
        const result = await generateDataBackground({
          prompt: "Subtle dark engineering grid with floating blue and purple data particles, cinematic, 4k."
        });
        if (result.backgroundDataUri) {
          setVideoUri(result.backgroundDataUri);
        }
      } catch (error) {
        // Silent failure as we have a robust fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadBackground();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950">
      {/* Base Fallback Image */}
      {fallbackImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={fallbackImage.imageUrl}
            alt="Background"
            fill
            className="object-cover grayscale"
            priority
            data-ai-hint={fallbackImage.imageHint}
          />
        </div>
      )}

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Animated Video Background (Overlay) */}
      {videoUri && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale transition-opacity duration-1000"
        >
          <source src={videoUri} type="video/mp4" />
        </video>
      )}

      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
    </div>
  );
}
