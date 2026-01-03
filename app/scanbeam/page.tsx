"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// AI Fotoğraf Analiz Tarama Animasyonu
// PNG wireframe kafa üzerine animasyonlu beam overlay

// AI Fotoğraf Analiz Tarama Animasyonu
// PNG wireframe kafa üzerine animasyonlu beam overlay

export default function AIScanAnimation({ paused = false }: { paused?: boolean }) {
    const [scanPhase, setScanPhase] = useState<'idle' | 'scanning' | 'complete'>('idle');
    const [showResults, setShowResults] = useState(false);
    const pausedRef = useRef(paused);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    // Otomatik başlat ve loop
    useEffect(() => {
        let timer1: NodeJS.Timeout;
        let timer2: NodeJS.Timeout;
        let timer3: NodeJS.Timeout;

        const runCycle = () => {
            if (pausedRef.current) {
                // If paused, re-check later or just wait.
                // Simple approach: try again in 1s to see if unpaused
                timer3 = setTimeout(runCycle, 1000);
                return;
            }

            setScanPhase('scanning');
            setShowResults(false);

            // Tarama bitince sonuçları göster
            timer1 = setTimeout(() => {
                if (pausedRef.current) {
                    // If paused mid-scan, maybe hold state? 
                    // For simplicity, we complete the phase but hold the cycle
                }
                setScanPhase('complete');
                setShowResults(true);
            }, 2000);

            // Loop için reset
            timer2 = setTimeout(() => {
                runCycle();
            }, 6000);
        };

        runCycle();

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className="w-full h-full relative bg-white overflow-hidden bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] flex items-center justify-center p-8">
            <div className="relative w-full max-w-lg mx-auto transform scale-85 origin-center mt-8">
                {/* Title inside the component for context - Scaled normally */}
                <div className="absolute -top-20 left-0 right-0 text-center pointer-events-none">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">AI Fotoğraf Analizi</h1>
                    <p className="text-gray-500 text-sm">Saniyeler içinde saç analizi</p>
                </div>

                {/* Container with perspective for 3D feel */}
                <div
                    className="relative"
                    style={{ perspective: '1000px' }}
                >
                    {/* Ambient Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-blue-500/5 blur-3xl rounded-full opacity-50" />

                    {/* Main Content */}
                    <div className="relative z-10">
                        {/* Wireframe Head PNG */}
                        <div className="relative">
                            <Image
                                src="/images/wireframe_n5.webp"
                                alt="AI Hair Analysis Wireframe"
                                width={500}
                                height={600}
                                className="w-full h-auto object-contain opacity-90 mix-blend-multiply"
                                priority
                            />

                            {/* Scan Beam Overlay - Partial Scan (to eyes/50%) */}
                            <motion.div
                                className="absolute inset-x-0 pointer-events-none"
                                initial={{ top: '-15%' }}
                                // Scan goes from -15% to 50% (eyes) and back? 
                                // User said: "adamın gözüne kadar insin geri çıksın... yarıya kadar indir"
                                // We'll animate top: -15% -> 50% -> -15%
                                animate={
                                    scanPhase === 'scanning' && !paused
                                        ? { top: ['-15%', '50%', '-15%'] }
                                        : { top: '-15%' }
                                }
                                transition={{
                                    duration: 2.5,
                                    ease: 'easeInOut',
                                    repeat: scanPhase === 'scanning' && !paused ? Infinity : 0
                                }}
                            >
                                {/* Main Beam */}
                                <div className="relative h-28">
                                    {/* Beam Gradient Background */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.08) 20%, rgba(16, 185, 129, 0.25) 50%, rgba(16, 185, 129, 0.08) 80%, transparent 100%)',
                                        }}
                                    />

                                    {/* Beam Line */}
                                    <div
                                        className="absolute left-0 right-0 h-1"
                                        style={{
                                            top: '50%',
                                            background: 'linear-gradient(90deg, transparent 0%, #10b981 15%, #34d399 50%, #10b981 85%, transparent 100%)',
                                            boxShadow: '0 0 20px #10b981, 0 0 40px #10b981, 0 0 60px rgba(16, 185, 129, 0.5)',
                                        }}
                                    />

                                    {/* Glow Effect */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Scan Lines Effect (during scan) - clipped to top half */}
                            <AnimatePresence>
                                {scanPhase === 'scanning' && !paused && (
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none overflow-hidden"
                                        style={{ clipPath: 'inset(0 0 50% 0)' }} // Clip to top half
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {[...Array(12)].map((_, i) => ( // Fewer lines since half height
                                            <motion.div
                                                key={i}
                                                className="absolute left-0 right-0 h-px bg-emerald-400/30"
                                                style={{ top: `${(i + 1) * 4}%` }}
                                                initial={{ scaleX: 0, opacity: 0 }}
                                                animate={{
                                                    scaleX: [0, 1, 1, 0],
                                                    opacity: [0, 0.6, 0.6, 0]
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    delay: i * 0.08,
                                                    ease: 'easeInOut',
                                                    repeat: Infinity
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Result Labels */}
                        <AnimatePresence>
                            {showResults && !paused && (
                                <>
                                    {/* Norwood Label */}
                                    <ResultLabel
                                        label="Norwood 3-4 Tespit Edildi"
                                        color="emerald"
                                        top="18%"
                                        delay={0.1}
                                        connectorWidth="w-10"
                                    />

                                    {/* Graft Label */}
                                    <ResultLabel
                                        label="Greft: 3,000 - 3,500"
                                        color="blue"
                                        top="32%"
                                        delay={0.3}
                                        connectorWidth="w-14"
                                    />

                                    {/* Technique Label */}
                                    <ResultLabel
                                        label="FUE + DHI Önerilen"
                                        color="purple"
                                        top="46%"
                                        delay={0.5}
                                        connectorWidth="w-12"
                                    />

                                    {/* Session Label - YENİ */}
                                    <ResultLabel
                                        label="Seans: 1"
                                        color="orange"
                                        top="60%"
                                        delay={0.7}
                                        connectorWidth="w-10"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        {/* Scanning Status - Adjusted Position */}
                        <motion.div
                            className="absolute bottom-[2%] left-1/2 -translate-x-1/2 z-20"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {scanPhase === 'scanning' ? (
                                <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-500/30">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-emerald-400"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 0.6, repeat: Infinity }}
                                    />
                                    <span className="text-xs font-medium text-white">AI Analiz Ediyor...</span>
                                </div>
                            ) : scanPhase === 'complete' ? (
                                <div className="flex items-center gap-2 bg-emerald-500 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg shadow-emerald-500/30">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-xs font-medium text-white">Analiz Tamamlandı</span>
                                </div>
                            ) : null}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Result Label Component
function ResultLabel({
    label,
    color,
    top,
    delay,
    connectorWidth = "w-8"
}: {
    label: string;
    color: 'emerald' | 'blue' | 'purple' | 'orange';
    top: string;
    delay: number;
    connectorWidth?: string;
}) {
    const colorStyles = {
        emerald: {
            dot: 'bg-emerald-500',
            border: 'border-emerald-200/50',
            glow: 'shadow-emerald-500/20'
        },
        blue: {
            dot: 'bg-blue-500',
            border: 'border-blue-200/50',
            glow: 'shadow-blue-500/20'
        },
        purple: {
            dot: 'bg-purple-500',
            border: 'border-purple-200/50',
            glow: 'shadow-purple-500/20'
        },
        orange: {
            dot: 'bg-orange-500',
            border: 'border-orange-200/50',
            glow: 'shadow-orange-500/20'
        },
    };

    const styles = colorStyles[color];

    return (
        <motion.div
            className="absolute right-0 z-20"
            style={{ top }}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15, delay }}
        >
            <div className={`bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg ${styles.glow} border ${styles.border}`}>
                <div className="flex items-center gap-2.5">
                    <motion.div
                        className={`w-2 h-2 rounded-full ${styles.dot}`}
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{label}</span>
                </div>
            </div>

            {/* Connector Line */}
            <motion.div
                className={`absolute left-0 top-1/2 ${connectorWidth} h-px bg-gradient-to-l from-gray-300 to-transparent`}
                style={{ transform: 'translateX(-100%) translateY(-50%)' }}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.3 }}
            />
        </motion.div>
    );
}
