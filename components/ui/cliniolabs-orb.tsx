'use client';

import { motion } from 'framer-motion';

interface CliniolabsOrbProps {
  size?: number;
  colorScheme?: 'cliniolabs' | 'apple';
  showOrbit?: boolean;
  softEdge?: boolean;
  theme?: 'dark' | 'light';
  logoBlendMode?: 'normal' | 'overlay' | 'soft-light' | 'screen' | 'hard-light';
}

// Cliniolabs Logo SVG Component
const CliniolabsLogo = ({ 
  size = 80, 
  color = 'white', 
}: { 
  size?: number; 
  color?: string; 
}) => (
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

// Renk paletleri
const colorPalettes = {
  cliniolabs: {
    blob1: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
    blob3: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
    blob4: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
  },
  apple: {
    blob1: 'radial-gradient(circle, #f652bb 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, #0855ff 0%, transparent 70%)',
    blob3: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
    blob4: 'radial-gradient(circle, #ec882d 0%, transparent 70%)',
  },
};

export function CliniolabsOrb({ 
  size = 300, 
  colorScheme = 'apple',
  showOrbit = true,
  softEdge = false,
  theme = 'dark',
  logoBlendMode = 'overlay'
}: CliniolabsOrbProps) {
  
  const colors = colorPalettes[colorScheme];
  const sphereSize = size * 0.65;
  const satelliteSize = size * 0.12;
  const orbitRadius = size * 0.45;
  
  // Blur miktarları - sadece kenar için, logo etkilenmeyecek
  const edgeBlur = softEdge ? 1 : 0;
  const satelliteBlur = softEdge ? 0.5 : 0;
  
  // Theme based styles
  const isDark = theme === 'dark';
  const sphereBg = isDark 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f0f0f5 100%)';
  const highlightColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)';
  const satelliteGlow = isDark ? 'rgba(100,200,255,0.5)' : 'rgba(100,150,255,0.4)';

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Yörünge Çizgisi - sadece keskin modda */}
      {showOrbit && !softEdge && (
        <svg 
          className="absolute"
          width={orbitRadius * 2 + 4}
          height={orbitRadius * 2 + 4}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`orbitGrad-${colorScheme}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {colorScheme === 'apple' ? (
                <>
                  <stop offset="0%" stopColor="#f652bb" stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="25%" stopColor="#0855ff" stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="75%" stopColor="#ec882d" stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="100%" stopColor="#f652bb" stopOpacity={isDark ? 0.5 : 0.7} />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#10b981" stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="33%" stopColor="#06b6d4" stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="66%" stopColor="#3b82f6" stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={isDark ? 0.5 : 0.7} />
                </>
              )}
            </linearGradient>
          </defs>
          <circle
            cx={orbitRadius + 2}
            cy={orbitRadius + 2}
            r={orbitRadius}
            fill="none"
            stroke={`url(#orbitGrad-${colorScheme}-${theme})`}
            strokeWidth="1.5"
          />
        </svg>
      )}

      {/* Ana Küre (Sphere) */}
      <div
        className="absolute rounded-full overflow-hidden flex items-center justify-center"
        style={{
          width: sphereSize,
          height: sphereSize,
          background: sphereBg,
          boxShadow: isDark 
            ? `inset 0 0 ${sphereSize * 0.3}px rgba(0,0,0,0.5)`
            : `inset 0 0 ${sphereSize * 0.2}px rgba(0,0,0,0.1), 0 4px 30px rgba(0,0,0,0.1)`,
          filter: softEdge ? `blur(${edgeBlur}px)` : 'none',
        }}
      >
        {/* Blob 1 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '120%',
            height: '120%',
            background: colors.blob1,
            filter: 'blur(30px)',
            opacity: isDark ? 1 : 0.8,
          }}
          animate={{
            x: ['-20%', '30%', '-10%', '20%', '-20%'],
            y: ['10%', '-20%', '30%', '-10%', '10%'],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Blob 2 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '100%',
            height: '100%',
            background: colors.blob2,
            filter: 'blur(25px)',
            opacity: isDark ? 1 : 0.8,
          }}
          animate={{
            x: ['30%', '-20%', '10%', '-30%', '30%'],
            y: ['-10%', '20%', '-30%', '10%', '-10%'],
            scale: [1.1, 0.9, 1.2, 1, 1.1],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Blob 3 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '90%',
            height: '90%',
            background: colors.blob3,
            filter: 'blur(20px)',
            opacity: isDark ? 1 : 0.8,
          }}
          animate={{
            x: ['-10%', '25%', '-25%', '15%', '-10%'],
            y: ['25%', '-15%', '10%', '-25%', '25%'],
            scale: [0.9, 1.15, 1, 1.2, 0.9],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Blob 4 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '80%',
            height: '80%',
            background: colors.blob4,
            filter: 'blur(25px)',
            opacity: isDark ? 1 : 0.8,
          }}
          animate={{
            x: ['20%', '-15%', '30%', '-20%', '20%'],
            y: ['-20%', '30%', '-10%', '20%', '-20%'],
            scale: [1, 1.1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Üst Highlight - 3D efekt */}
        <div
          className="absolute"
          style={{
            width: '60%',
            height: '60%',
            top: '5%',
            left: '10%',
            background: `radial-gradient(ellipse at 30% 30%, ${highlightColor} 0%, transparent 60%)`,
            borderRadius: '50%',
          }}
        />

        {/* Logo - Kürenin içinde, blend mode ile, blur yok */}
        <motion.div
          className="relative z-10"
          style={{
            mixBlendMode: logoBlendMode,
          }}
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <CliniolabsLogo 
            size={sphereSize * 0.32} 
            color="rgba(255,255,255,1)" 
          />
        </motion.div>
      </div>

      {/* Uydu (Satellite) */}
      {showOrbit && (
        <motion.div
          className="absolute"
          style={{
            width: orbitRadius * 2,
            height: orbitRadius * 2,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Uydu Küre */}
          <div
            className="absolute rounded-full overflow-hidden"
            style={{
              width: satelliteSize,
              height: satelliteSize,
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              background: sphereBg,
              boxShadow: `0 0 ${satelliteSize * 0.6}px ${satelliteGlow}`,
              filter: softEdge ? `blur(${satelliteBlur}px)` : 'none',
            }}
          >
            {/* Uydu içi bloblar */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '150%',
                height: '150%',
                top: '-25%',
                left: '-25%',
                background: colors.blob1,
                filter: 'blur(8px)',
                opacity: isDark ? 1 : 0.8,
              }}
              animate={{
                x: ['-10%', '20%', '-10%'],
                y: ['10%', '-15%', '10%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '120%',
                height: '120%',
                top: '-10%',
                left: '-10%',
                background: colors.blob2,
                filter: 'blur(6px)',
                opacity: isDark ? 1 : 0.8,
              }}
              animate={{
                x: ['15%', '-15%', '15%'],
                y: ['-10%', '15%', '-10%'],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Uydu highlight */}
            <div
              className="absolute"
              style={{
                width: '50%',
                height: '50%',
                top: '10%',
                left: '15%',
                background: `radial-gradient(ellipse at 30% 30%, ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)'} 0%, transparent 70%)`,
                borderRadius: '50%',
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Demo component - Yan yana layout
export function CliniolabsOrbDemo() {
  return (
    <div className="min-h-screen">
      {/* ==================== DARK THEME - YAN YANA ==================== */}
      <div className="bg-black py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-white text-3xl font-bold tracking-tight">Dark Theme</h1>
          </div>
          
          <div className="flex justify-center items-center gap-8">
            {/* Soft Edge */}
            <div className="flex flex-col items-center gap-3">
              <CliniolabsOrb size={300} colorScheme="apple" showOrbit={true} softEdge={true} theme="dark" logoBlendMode="overlay" />
              <span className="text-white/50 text-sm">Soft Edge</span>
            </div>
            
            {/* Keskin */}
            <div className="flex flex-col items-center gap-3">
              <CliniolabsOrb size={300} colorScheme="apple" showOrbit={true} softEdge={false} theme="dark" logoBlendMode="overlay" />
              <span className="text-white/50 text-sm">Keskin</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== LIGHT THEME - YAN YANA ==================== */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-gray-900 text-3xl font-bold tracking-tight">Light Theme</h2>
          </div>
          
          <div className="flex justify-center items-center gap-8">
            {/* Soft Edge */}
            <div className="flex flex-col items-center gap-3">
              <CliniolabsOrb size={300} colorScheme="apple" showOrbit={true} softEdge={true} theme="light" logoBlendMode="overlay" />
              <span className="text-gray-500 text-sm">Soft Edge</span>
            </div>
            
            {/* Keskin */}
            <div className="flex flex-col items-center gap-3">
              <CliniolabsOrb size={300} colorScheme="apple" showOrbit={true} softEdge={false} theme="light" logoBlendMode="overlay" />
              <span className="text-gray-500 text-sm">Keskin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
