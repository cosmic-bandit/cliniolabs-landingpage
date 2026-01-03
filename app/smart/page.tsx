"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ===== METABALL LOGO WITH DAY/NIGHT CYCLE =====

type Phase = 'idle' | 'merge' | 'launch' | 'orbit' | 'return' | 'split';

const ORBIT_RADIUS = 566;
const SQUARE_SIZE = 200;
const SQUARE_RADIUS = 0;

const CENTER_SQUARE = { x: 300, y: 300 };
const TOP_RIGHT_SQUARE = { x: 600, y: 0 };

const MAIN_L_PATH = "M114.99,400.17c-8.26,0-14.99-6.72-14.99-14.99v-60.05c0-13.81-11.19-25-25-25H14.99c-8.26,0-14.99-10.09-14.99-22.48V115.03c0-8.26,6.72-14.99,14.99-14.99h60.01c13.81,0,25-11.19,25-25V14.99c0-8.26,6.72-14.99,14.99-14.99h120.02c8.26,0,14.99,6.72,14.99,14.99v70.07c0,8.26-6.72,14.99-14.99,14.99h-110.01c-13.81,0-25,11.19-25,25v150.09c0,13.81,11.19,25,25,25h150c13.81,0,25-11.19,25-25v-110.08c0-8.26,6.72-14.99,14.99-14.99h70.02c8.26,0,14.99,6.72,14.99,14.99v120.09c0,8.26-6.72,14.99-14.99,14.99h-60.01c-13.81,0-25,11.19-25,25v60.05c0,8.4-9.11,14.99-20.74,14.99H114.99Z";

const CENTER_SQUARE_CENTER = {
    x: CENTER_SQUARE.x + SQUARE_SIZE / 2,
    y: CENTER_SQUARE.y + SQUARE_SIZE / 2,
};
const TOP_RIGHT_SQUARE_CENTER = {
    x: TOP_RIGHT_SQUARE.x + SQUARE_SIZE / 2,
    y: TOP_RIGHT_SQUARE.y + SQUARE_SIZE / 2,
};

function getCubicBezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
    const k = 1 - t;
    return (
        k * k * k * p0 +
        3 * k * k * t * p1 +
        3 * k * t * t * p2 +
        t * t * t * p3
    );
}

const LAUNCH_START = { x: 600, y: 0 };
const LAUNCH_END = { x: 400, y: -166 };
const ORBIT_CENTER = { x: 400, y: 400 };
const LAUNCH_CP1 = { x: 600, y: -100 };
const LAUNCH_CP2 = { x: 500, y: -166 };
const ORBIT_END = { x: 966, y: 400 };
const RETURN_CP1 = { x: 966, y: 100 };
const RETURN_CP2 = { x: 600, y: 100 };

interface MetaballLogoProps {
    size?: number;
    autoPlay?: boolean;
    onOrbitProgress?: (progress: number, lap: number) => void; // 0-1 progress, lap 1 or 2
}

function MetaballLogo({
    size = 400,
    autoPlay = true,
    onOrbitProgress,
}: MetaballLogoProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [centerState, setCenterState] = useState({ x: 0, y: 0, scale: 1, opacity: 1 });
    const [topRightState, setTopRightState] = useState({ x: 0, y: 0, borderRadius: SQUARE_RADIUS, scale: 1, opacity: 1 });
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const [bridgeOpacity, setBridgeOpacity] = useState(1);
    const gooFilterId = "goo-smart";

    // 2 tur için orbit süresi (her tur 8 saniye = toplam 16 saniye)
    const TIMINGS = {
        idle: 2000,
        merge: 700,
        launch: 1350,
        orbit: 8000, // 2 tur = 16 saniye
        return: 2500,
        split: 700,
    };

    const easeInQuart = (t: number) => t * t * t * t;
    const easeInQuad = (t: number) => t * t;
    const easeOutQuad = (t: number) => t * (2 - t);

    const update = useCallback((time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;

        if (phase === 'idle') {
            setCenterState({ x: 0, y: 0, scale: 1, opacity: 1 });
            setTopRightState({ x: 0, y: 0, scale: 1, opacity: 1, borderRadius: SQUARE_RADIUS });
            if (elapsed > TIMINGS.idle && autoPlay) {
                setPhase('merge');
                startTimeRef.current = time;
            }
        } else if (phase === 'merge') {
            const t = Math.min(elapsed / TIMINGS.merge, 1);
            const ease = easeInQuart(t);
            const tx = (TOP_RIGHT_SQUARE.x - CENTER_SQUARE.x) * ease;
            const ty = (TOP_RIGHT_SQUARE.y - CENTER_SQUARE.y) * ease;
            setCenterState(prev => ({ ...prev, x: tx, y: ty, scale: 1 - 0.2 * ease }));
            setBridgeOpacity(1 - ease);
            if (t >= 1) {
                setPhase('launch');
                startTimeRef.current = time;
            }
        } else if (phase === 'launch') {
            const t = Math.min(elapsed / TIMINGS.launch, 1);
            const ease = easeInQuad(t);
            const bx = getCubicBezierPoint(ease, LAUNCH_START.x, LAUNCH_CP1.x, LAUNCH_CP2.x, LAUNCH_END.x);
            const by = getCubicBezierPoint(ease, LAUNCH_START.y, LAUNCH_CP1.y, LAUNCH_CP2.y, LAUNCH_END.y);
            const tx = bx - TOP_RIGHT_SQUARE.x;
            const ty = by - TOP_RIGHT_SQUARE.y;
            setTopRightState(prev => ({
                ...prev,
                x: tx, y: ty,
                borderRadius: SQUARE_RADIUS + (SQUARE_SIZE / 2 - SQUARE_RADIUS) * ease,
                scale: 1 - 0.5 * ease
            }));
            setCenterState(prev => ({ ...prev, opacity: 0 }));
            if (t >= 1) {
                setPhase('orbit');
                startTimeRef.current = time;
            }
        } else if (phase === 'orbit') {
            const t = Math.min(elapsed / TIMINGS.orbit, 1);
            const startAngle = -Math.PI / 2;
            // 2 tam tur = 4π (7 yerine)
            const totalTravel = -Math.PI * 4;
            const currentAngle = startAngle + totalTravel * t;
            const ox = Math.cos(currentAngle) * ORBIT_RADIUS;
            const oy = Math.sin(currentAngle) * ORBIT_RADIUS;
            const targetX = ORBIT_CENTER.x + ox - SQUARE_SIZE / 2;
            const targetY = ORBIT_CENTER.y + oy - SQUARE_SIZE / 2;
            const tx = targetX - TOP_RIGHT_SQUARE.x;
            const ty = targetY - TOP_RIGHT_SQUARE.y;
            setTopRightState(prev => ({ ...prev, x: tx, y: ty }));

            // Orbit progress callback (hangi tur, ne kadar ilerledi)
            if (onOrbitProgress) {
                const lap = t < 0.5 ? 1 : 2; // İlk yarı = 1. tur, ikinci yarı = 2. tur
                const lapProgress = t < 0.5 ? t * 2 : (t - 0.5) * 2; // Her tur için 0-1
                onOrbitProgress(lapProgress, lap);
            }

            if (t >= 1) {
                setPhase('return');
                startTimeRef.current = time;
            }
        } else if (phase === 'return') {
            const t = Math.min(elapsed / TIMINGS.return, 1);
            const ease = easeOutQuad(t);
            const bx = getCubicBezierPoint(ease, ORBIT_END.x, RETURN_CP1.x, RETURN_CP2.x, LAUNCH_START.x);
            const by = getCubicBezierPoint(ease, ORBIT_END.y, RETURN_CP1.y, RETURN_CP2.y, LAUNCH_START.y);
            const tx = bx - TOP_RIGHT_SQUARE.x;
            const ty = by - TOP_RIGHT_SQUARE.y;
            setTopRightState(prev => ({
                ...prev,
                x: tx, y: ty,
                borderRadius: SQUARE_SIZE / 2 - (SQUARE_SIZE / 2 - SQUARE_RADIUS) * ease,
                scale: 0.5 + (1 - 0.5) * ease
            }));
            setCenterState(prev => ({ ...prev, opacity: 0 }));
            if (t >= 1) {
                setPhase('split');
                startTimeRef.current = time;
            }
        } else if (phase === 'split') {
            const t = Math.min(elapsed / TIMINGS.split, 1);
            const ease = 1 - Math.pow(1 - t, 4);
            const startX = TOP_RIGHT_SQUARE.x - CENTER_SQUARE.x;
            const startY = TOP_RIGHT_SQUARE.y - CENTER_SQUARE.y;
            setCenterState({
                x: startX * (1 - ease),
                y: startY * (1 - ease),
                scale: 0.8 + 0.2 * ease,
                opacity: 1,
            });
            setBridgeOpacity(Math.min(ease * 4, 1));
            if (t >= 1) {
                setPhase('idle');
                setBridgeOpacity(1);
                startTimeRef.current = time;
            }
        }
        animationRef.current = requestAnimationFrame(update);
    }, [phase, autoPlay, onOrbitProgress]);

    useEffect(() => {
        if (autoPlay) {
            animationRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [autoPlay, update]);

    return (
        <svg width={size} height={size} viewBox="-300 -300 1400 1400" className="overflow-visible">
            <defs>
                <filter id={gooFilterId}>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -24" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
                <linearGradient id="logoGradient-smart" gradientUnits="userSpaceOnUse" x1="-300" y1="-300" x2="1100" y2="1100">
                    <stop offset="0%" stopColor="#fd2d6a" />
                    <stop offset="33%" stopColor="#fea52d" />
                    <stop offset="66%" stopColor="#19a8fa" />
                    <stop offset="100%" stopColor="#f979d0" />
                    <animateTransform attributeName="gradientTransform" type="rotate" from="0 400 400" to="360 400 400" dur="5s" repeatCount="indefinite" />
                </linearGradient>
                <mask id="metaball-mask-smart">
                    <rect width="100%" height="100%" fill="black" />
                    <g filter={`url(#${gooFilterId})`}>
                        <rect x={380} y={215} width={350} height={50} fill="white" style={{ opacity: bridgeOpacity, transform: `rotate(315deg) scale(${bridgeOpacity})`, transformBox: "fill-box", transformOrigin: "center center" }} />
                        <rect x={CENTER_SQUARE.x} y={CENTER_SQUARE.y} width={SQUARE_SIZE} height={SQUARE_SIZE} rx={SQUARE_RADIUS} fill="white" style={{ transform: `translate(${centerState.x}px, ${centerState.y}px) scale(${centerState.scale})`, transformOrigin: `${CENTER_SQUARE_CENTER.x}px ${CENTER_SQUARE_CENTER.y}px`, opacity: centerState.opacity, }} />
                        <rect x={TOP_RIGHT_SQUARE.x} y={TOP_RIGHT_SQUARE.y} width={SQUARE_SIZE} height={SQUARE_SIZE} rx={topRightState.borderRadius} fill="white" style={{ transform: `translate(${topRightState.x}px, ${topRightState.y}px) scale(${topRightState.scale})`, transformOrigin: `${TOP_RIGHT_SQUARE_CENTER.x}px ${TOP_RIGHT_SQUARE_CENTER.y}px`, opacity: topRightState.opacity, }} />
                    </g>
                </mask>
            </defs>
            <path d={MAIN_L_PATH} fill="url(#logoGradient-smart)" className="transition-all duration-300" transform="scale(2)" />
            <rect x="-300" y="-300" width="1400" height="1400" fill="url(#logoGradient-smart)" mask="url(#metaball-mask-smart)" />
        </svg>
    );
}

// ===== TYPING INDICATOR =====
const TypingIndicator = () => (
    <div className="flex gap-1.5 items-center justify-start px-4 py-3">
        <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
        />
        <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
        />
    </div>
)

// ===== MESSAGE BUBBLE =====
interface MessageBubbleProps {
    message: string;
    isVisible: boolean;
    isTyping: boolean;
}

function MessageBubble({ message, isVisible, isTyping }: MessageBubbleProps) {
    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl rounded-bl-sm shadow-lg max-w-[400px]"
                >
                    {isTyping ? (
                        <TypingIndicator />
                    ) : (
                        <p className="px-4 py-3 text-gray-800 text-sm leading-relaxed">
                            {message}
                        </p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ===== MAIN PAGE =====
export default function SmartPage({ paused = false }: { paused?: boolean }) {
    const [currentLap, setCurrentLap] = useState(1); // 1 = gündüz, 2 = gece
    const [lapProgress, setLapProgress] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [messageKey, setMessageKey] = useState(0); // Force re-render for new message
    const prevLapRef = useRef(1);

    // Orbit progress callback
    const handleOrbitProgress = useCallback((progress: number, lap: number) => {
        setLapProgress(progress);

        // Tur değişti mi?
        if (lap !== prevLapRef.current) {
            prevLapRef.current = lap;
            setCurrentLap(lap);
            setMessageKey(prev => prev + 1);

            // Yeni tur başladığında typing başlat (eğer pause değilse)
            if (!paused) {
                setShowMessage(true);
                setIsTyping(true);

                // 1.5 saniye sonra mesajı göster
                setTimeout(() => {
                    setIsTyping(false);
                }, 1500);
            }
        }
    }, [paused]);

    // Mesaj animasyonu için pause kontrolü (typing durdurmak için değil, akışın kesilmesi için)
    useEffect(() => {
        if (!paused && !showMessage) {
            // Resume logic if needed, currently driven by orbit progress
        }
    }, [paused, showMessage]);

    // İlk yüklemede gündüz mesajını göster
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(true);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1500);
        }, 3000); // Orbit başladıktan 3 saniye sonra

        return () => clearTimeout(timer);
    }, []);

    // Arka plan stilleri (Opacity Gradient)
    const getBackgroundStyle = () => {
        // Gündüz: Neredeyse şeffaf / Çok hafif mavi
        // Gece: Sadece merkezde siyahlık var, kenarlar şeffaf.
        // Gradient: Radial Gradient from center (black/color) to transparent edges.

        let opacity = 0;
        let centerColor = "0, 0, 0"; // RGB string

        if (currentLap === 1) {
            // === GÜNDÜZ -> GECE ===
            // Gündüz (0-0.3): Opacity 0 (Tamamen şeffaf/beyazımsı)
            // Gün batımı (0.3-0.6): Opacity artar, renk turuncu
            // Geceye geçiş (0.6-1.0): Opacity artar, renk siyahlaşır

            if (lapProgress <= 0.3) {
                opacity = 0;
            } else if (lapProgress <= 0.6) {
                const t = (lapProgress - 0.3) / 0.3;
                opacity = t * 0.4; // %40 opacity'ye kadar
                centerColor = "255, 160, 122"; // Light Salmon
            } else {
                const t = (lapProgress - 0.6) / 0.4;
                opacity = 0.4 + (t * 0.5); // %90 opacity'ye kadar (Tam siyah değil)
                centerColor = "0, 0, 0";
            }
        } else {
            // === GECE -> GÜNDÜZ ===
            // Gece (0-0.2): Yüksek opacity
            // Sabaha doğru: Opacity azalır

            if (lapProgress <= 0.5) {
                const t = lapProgress / 0.5;
                opacity = 0.9 - (t * 0.5); // 0.9 -> 0.4
                centerColor = "0, 0, 0";
            } else {
                const t = (lapProgress - 0.5) / 0.5;
                opacity = 0.4 - (t * 0.4); // 0.4 -> 0
                centerColor = "255, 160, 122";
            }
        }

        return {
            background: `radial-gradient(circle at center, rgba(${centerColor}, ${opacity}) 0%, rgba(${centerColor}, 0) 70%)`
        };
    };

    // Mesaj içeriği
    const getMessage = () => {
        if (currentLap === 1) {
            return "İyi günler. Ben Mila. Cliniolabs saç ekim danışmanı. Size nasıl yardımcı olabilirim?";
        } else {
            return "İyi geceler. Ben Mila. Cliniolabs saç ekim danışmanı. Size nasıl yardımcı olabilirim?";
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Background Layer - Absolute to prevent layout shift */}
            <div
                className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
                style={getBackgroundStyle()}
            />

            {/* Content Container - Relative z-10 */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-[400px]">
                {/* Header - Fixed Height to prevent shift */}
                <div className="mb-4 text-center h-[60px] flex flex-col justify-end">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">7/24 Akıllı Asistan</h1>
                    <p className="text-gray-600 text-sm">Gece gündüz demeden hastalarınıza yanıt verir.</p>
                </div>

                {/* Metaball Logo - Fixed Container */}
                <div className="relative flex items-center justify-center h-[300px] w-full">
                    <MetaballLogo
                        size={300}
                        autoPlay={!paused}
                        onOrbitProgress={handleOrbitProgress}
                    />
                </div>

                {/* Message Bubble - Fixed Height Container */}
                <div className="h-[90px] w-full flex items-start justify-center mt-2">
                    <MessageBubble
                        key={messageKey}
                        message={getMessage()}
                        isVisible={showMessage}
                        isTyping={isTyping}
                    />
                </div>
            </div>
            {/* Removed Buttons and Back Link */}
        </div>
    )
}
