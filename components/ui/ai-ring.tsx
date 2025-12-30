'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface AIRingProps {
  size?: number;
  showIcon?: boolean;
  variant?: 'apple' | 'cliniolabs' | 'minimal';
}

export function AIRing({ size = 200, showIcon = true, variant = 'cliniolabs' }: AIRingProps) {
  
  // Renk paletleri
  const gradients = {
    apple: 'conic-gradient(from 0deg, #f652bb, #0855ff, #5f2bf6, #ec882d, #f652bb)',
    cliniolabs: 'conic-gradient(from 0deg, #10b981, #06b6d4, #3b82f6, #8b5cf6, #10b981)',
    minimal: 'conic-gradient(from 0deg, #10b981, #059669, #047857, #10b981)',
  };

  const gradient = gradients[variant];

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Dış Glow - Pulse efekti */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: gradient,
          filter: 'blur(30px)',
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orta Blur Layer - Derinlik için */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          background: gradient,
          filter: 'blur(15px)',
          opacity: 0.6,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Ana Ring - Sharp */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          background: gradient,
          padding: '3px',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* İç siyah/koyu alan */}
        <div 
          className="w-full h-full rounded-full bg-black flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}
        >
          {showIcon && (
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <MessageCircle 
                className="text-white" 
                size={size * 0.25} 
                strokeWidth={1.5}
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Parıltı efekti */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 10deg, transparent 20deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Demo sayfası için tüm varyantları gösteren component
export function AIRingDemo() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-16 p-8">
      <h1 className="text-white text-3xl font-bold">AI Ring Variants</h1>
      
      <div className="flex flex-wrap items-center justify-center gap-16">
        <div className="flex flex-col items-center gap-4">
          <AIRing size={180} variant="apple" />
          <span className="text-white/60 text-sm">Apple</span>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <AIRing size={180} variant="cliniolabs" />
          <span className="text-white/60 text-sm">Cliniolabs</span>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <AIRing size={180} variant="minimal" />
          <span className="text-white/60 text-sm">Minimal</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <AIRing size={300} variant="cliniolabs" />
        <span className="text-white/60 text-sm">Large (300px)</span>
      </div>
    </div>
  );
}
