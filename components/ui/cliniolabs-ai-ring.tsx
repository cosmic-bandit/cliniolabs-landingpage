'use client';

import { motion } from 'framer-motion';

interface CliniolabsAIRingProps {
  size?: number;
  colorScheme?: 'cliniolabs' | 'apple' | 'ocean' | 'sunset';
  showDial?: boolean;
  dialStyle?: 'full' | 'quarters';
  theme?: 'dark' | 'light';
}

// Cliniolabs Logo SVG Component
const CliniolabsLogo = ({ size = 80, color = 'white' }: { size?: number; color?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 599.15 599.15" 
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M172.86,599.15c-15.17,0-27.51-12.34-27.51-27.51v-78.55c0-21.7-17.59-39.3-39.3-39.3H27.51c-15.17,0-27.51-12.34-27.51-27.51v-253.43c0-15.17,12.34-27.51,27.51-27.51h78.55c21.7,0,39.3-17.59,39.3-39.3V27.51c0-15.17,12.34-27.51,27.51-27.51h175.32c15.17,0,27.51,12.34,27.51,27.51v90.34c0,15.17-12.34,27.51-27.51,27.51h-163.53c-21.7,0-39.3,17.59-39.3,39.3v229.86c0,21.7,17.59,39.3,39.3,39.3h229.86c21.7,0,39.3-17.59,39.3-39.3v-168.93c0-13.16,10.7-23.86,23.86-23.86h97.63c13.16,0,23.86,10.71,23.86,23.86v184.37c0,13.16-10.7,23.86-23.86,23.86h-82.19c-21.7,0-39.3,17.59-39.3,39.3v78.55c0,15.17-12.34,27.51-27.51,27.51h-253.44Z"/>
    <path d="M247.91,372.87c-11.99,0-22.11-10.12-22.11-22.11v-102.85c0-11.99,10.12-22.11,22.11-22.11h46.51c86.81,0,157.19-70.37,157.19-157.18V22.11C451.61,10.12,461.73,0,473.71,0h102.85c11.98,0,22.11,10.12,22.11,22.11v102.85c0,11.98-10.12,22.11-22.11,22.11h-46.51c-86.81,0-157.19,70.37-157.19,157.18v46.51c0,11.99-10.12,22.11-22.11,22.11h-102.85Z"/>
  </svg>
);

// Minimal Saat Kadranı
const WatchDial = ({ size, id, style = 'full', theme = 'dark' }: { size: number; id: string; style?: 'full' | 'quarters'; theme?: 'dark' | 'light' }) => {
  const ticks = [];
  const gradientDefs = [];
  const center = size / 2;
  const outerRadius = size / 2 - 4;
  const innerRadius = size / 2 * 0.68;

  const hours = style === 'quarters' ? [0, 3, 6, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  
  // Renk ayarları
  const tickColor = theme === 'light' ? '#374151' : 'white'; // gray-700 vs white

  for (const hour of hours) {
    const angleDeg = (hour * 30) - 90;
    const angleRad = angleDeg * (Math.PI / 180);
    
    const outerX = center + outerRadius * Math.cos(angleRad);
    const outerY = center + outerRadius * Math.sin(angleRad);
    const innerX = center + innerRadius * Math.cos(angleRad);
    const innerY = center + innerRadius * Math.sin(angleRad);

    gradientDefs.push(
      <linearGradient
        key={`grad-${hour}`}
        id={`tickGradient-${id}-${hour}`}
        x1={innerX}
        y1={innerY}
        x2={outerX}
        y2={outerY}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor={tickColor} stopOpacity="0.05" />
        <stop offset="40%" stopColor={tickColor} stopOpacity="0.25" />
        <stop offset="70%" stopColor={tickColor} stopOpacity="0.55" />
        <stop offset="100%" stopColor={tickColor} stopOpacity="0.9" />
      </linearGradient>
    );

    ticks.push(
      <line
        key={`tick-${hour}`}
        x1={innerX}
        y1={innerY}
        x2={outerX}
        y2={outerY}
        stroke={`url(#tickGradient-${id}-${hour})`}
        strokeWidth={style === 'quarters' ? 2.5 : 2}
        strokeLinecap="round"
      />
    );
  }

  return (
    <svg width={size} height={size} className="absolute">
      <defs>
        {gradientDefs}
      </defs>
      {ticks}
    </svg>
  );
};

export function CliniolabsAIRing({ 
  size = 200, 
  colorScheme = 'cliniolabs',
  showDial = true,
  dialStyle = 'full',
  theme = 'dark'
}: CliniolabsAIRingProps) {
  
  const gradients = {
    cliniolabs: 'conic-gradient(from 0deg, #10b981, #06b6d4, #3b82f6, #8b5cf6, #10b981)',
    apple: 'conic-gradient(from 0deg, #f652bb, #0855ff, #5f2bf6, #ec882d, #f652bb)',
    ocean: 'conic-gradient(from 0deg, #0ea5e9, #06b6d4, #14b8a6, #0891b2, #0ea5e9)',
    sunset: 'conic-gradient(from 0deg, #f97316, #ef4444, #ec4899, #f59e0b, #f97316)',
  };

  const gradient = gradients[colorScheme];
  const uniqueId = `ring-${colorScheme}-${dialStyle}-${theme}-${Math.random().toString(36).substr(2, 9)}`;

  // Theme bazlı ayarlar
  const isLight = theme === 'light';
  
  // Light: kalın halka (içe doğru), Dark: ince halka
  const ringSize = isLight ? 0.82 : 0.78; // Light'ta daha büyük = daha kalın halka
  const ringPadding = isLight ? size * 0.038 : 3; // Light'ta içi daha geniş = kalın border (tekrar yarıya indirildi)
  const innerBg = isLight ? 'white' : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
  const logoColor = isLight ? '#1f2937' : 'white'; // gray-800 vs white
  
  // Blur radar boyutu - taşmasın
  const blurRadarSize = isLight ? 0.70 : 0.82;
  
  // Glow ayarları
  const glowBlur = isLight ? 25 : 35;
  const glowOpacity = isLight ? [0.3, 0.5, 0.3] : [0.4, 0.75, 0.4];

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
          filter: `blur(${glowBlur}px)`,
        }}
        animate={{
          opacity: glowOpacity,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orta Blur Layer - Taşmayacak şekilde */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * blurRadarSize,
          height: size * blurRadarSize,
          background: gradient,
          filter: 'blur(12px)',
          opacity: isLight ? 0.4 : 0.5,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Ana Ring - Kalın halka */}
      <motion.div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: size * ringSize,
          height: size * ringSize,
          background: gradient,
          padding: ringPadding,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* İç alan - beyaz veya siyah */}
        <div 
          className="w-full h-full rounded-full"
          style={{ background: innerBg }}
        />
      </motion.div>

      {/* Parıltı efekti - Taşmayacak şekilde */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * (isLight ? 0.72 : 0.82),
          height: size * (isLight ? 0.72 : 0.82),
          background: `conic-gradient(from 0deg, transparent 0deg, ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.35)'} 15deg, transparent 30deg)`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Saat Kadranı */}
      {showDial && (
        <div 
          className="absolute flex items-center justify-center"
          style={{ width: size * (isLight ? 0.58 : 0.72), height: size * (isLight ? 0.58 : 0.72) }}
        >
          <WatchDial size={size * (isLight ? 0.58 : 0.72)} id={uniqueId} style={dialStyle} theme={theme} />
        </div>
      )}

      {/* Cliniolabs Logo */}
      <motion.div
        className="absolute z-10"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <CliniolabsLogo size={size * (isLight ? 0.18 : 0.22)} color={logoColor} />
      </motion.div>
    </div>
  );
}

// Demo component
export function CliniolabsAIRingDemo() {
  return (
    <div className="min-h-screen">
      {/* SİYAH ZEMİN */}
      <div className="bg-black py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl font-bold tracking-tight">Siyah Zemin (Dark Theme)</h1>
            <p className="text-white/60 text-lg mt-2">theme="dark"</p>
          </div>

          <div className="flex flex-wrap justify-center gap-16">
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={300} colorScheme="cliniolabs" showDial={true} dialStyle="full" theme="dark" />
              <span className="text-emerald-400 text-base font-semibold">Cliniolabs</span>
            </div>
            
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={300} colorScheme="apple" showDial={true} dialStyle="full" theme="dark" />
              <span className="text-pink-400 text-base font-semibold">Apple</span>
            </div>
          </div>
        </div>
      </div>

      {/* BEYAZ ZEMİN */}
      <div className="bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-gray-900 text-4xl font-bold tracking-tight">Beyaz Zemin (Light Theme)</h1>
            <p className="text-gray-500 text-lg mt-2">theme="light" - Kalın halka, beyaz iç, siyah logo</p>
          </div>

          <div className="flex flex-wrap justify-center gap-16">
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={300} colorScheme="cliniolabs" showDial={true} dialStyle="full" theme="light" />
              <span className="text-emerald-600 text-base font-semibold">Cliniolabs</span>
            </div>
            
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={300} colorScheme="apple" showDial={true} dialStyle="full" theme="light" />
              <span className="text-pink-600 text-base font-semibold">Apple</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRİ ZEMİN */}
      <div className="bg-gray-100 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-gray-900 text-4xl font-bold tracking-tight">Gri Zemin (Light Theme)</h1>
            <p className="text-gray-500 text-lg mt-2">theme="light"</p>
          </div>

          <div className="flex flex-wrap justify-center gap-16">
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={300} colorScheme="cliniolabs" showDial={true} dialStyle="full" theme="light" />
              <span className="text-emerald-600 text-base font-semibold">Cliniolabs</span>
            </div>
            
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={300} colorScheme="apple" showDial={true} dialStyle="full" theme="light" />
              <span className="text-pink-600 text-base font-semibold">Apple</span>
            </div>
          </div>
        </div>
      </div>

      {/* KARŞILAŞTIRMA - Yan yana Dark vs Light */}
      <div className="py-20 px-8 bg-gradient-to-r from-black via-gray-500 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl font-bold tracking-tight drop-shadow-lg">Dark vs Light Karşılaştırma</h1>
          </div>

          <div className="flex flex-wrap justify-center gap-20">
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={280} colorScheme="apple" showDial={true} dialStyle="full" theme="dark" />
              <span className="text-white text-base font-semibold bg-black/50 px-3 py-1 rounded">Dark</span>
            </div>
            
            <div className="flex flex-col items-center gap-5">
              <CliniolabsAIRing size={280} colorScheme="apple" showDial={true} dialStyle="full" theme="light" />
              <span className="text-gray-800 text-base font-semibold bg-white/80 px-3 py-1 rounded">Light</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO PREVIEW */}
      <div className="bg-black py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-white/40 text-sm uppercase tracking-widest">Hero Section Preview</span>
          <div className="mt-8">
            <CliniolabsAIRing size={400} colorScheme="apple" showDial={true} dialStyle="full" theme="dark" />
          </div>
          <div className="mt-8">
            <p className="text-white text-3xl font-semibold">7/24 AI Klinik Asistanı</p>
            <p className="text-white/50 mt-2 text-lg">Siz uyurken bile çalışır</p>
          </div>
        </div>
      </div>
    </div>
  );
}
