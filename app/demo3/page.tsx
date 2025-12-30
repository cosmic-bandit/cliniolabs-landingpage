'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// ===== CLINIOLABS METABALL LOGO (GRID SYSTEM) =====
// 
// 6x6 Grid Sistemi (600x600 Canvas)
// 1 Birim = 100px
// Kareler = 2x2 Birim (200x200px)
// Radius = 30px
//
// Layout:
// - Sol Kol: 2x6 Birim (200x600)
// - Alt Kol: 4x2 Birim (400x200) - L'nin uzantısı
// - Merkez Kare: (200, 200) konumunda 200x200
// - Sağ Üst Kare: (400, 0) konumunda 200x200

type Phase = 'idle' | 'merge' | 'launch' | 'orbit' | 'return' | 'split';

const VIEWBOX_SIZE = 800;
const ORIGIN = { x: 400, y: 400 };
const ORBIT_RADIUS = 566; // Viewbox köşesine temas (400 * sqrt(2))

const SQUARE_SIZE = 200;
const SQUARE_RADIUS = 0;

// Grid Guide (800x800) ve Orijinal Boşluk Hizalaması:
// Merkez Kare: 230, 230 (L-body ile flush olması için)
const CENTER_SQUARE = { x: 300, y: 300 };
// Sağ Üst: 530, 30 (L-body'nin üst koluyla hizalı)
const TOP_RIGHT_SQUARE = { x: 600, y: 0 };

// Orijinal L-Gövde Path (color.svg'den birebir - Scale 1x):
const MAIN_L_PATH = "M114.99,400.17c-8.26,0-14.99-6.72-14.99-14.99v-60.05c0-13.81-11.19-25-25-25H14.99c-8.26,0-14.99-10.09-14.99-22.48V115.03c0-8.26,6.72-14.99,14.99-14.99h60.01c13.81,0,25-11.19,25-25V14.99c0-8.26,6.72-14.99,14.99-14.99h120.02c8.26,0,14.99,6.72,14.99,14.99v70.07c0,8.26-6.72,14.99-14.99,14.99h-110.01c-13.81,0-25,11.19-25,25v150.09c0,13.81,11.19,25,25,25h150c13.81,0,25-11.19,25-25v-110.08c0-8.26,6.72-14.99,14.99-14.99h70.02c8.26,0,14.99,6.72,14.99,14.99v120.09c0,8.26-6.72,14.99-14.99,14.99h-60.01c-13.81,0-25,11.19-25,25v60.05c0,8.4-9.11,14.99-20.74,14.99H114.99Z";

const CENTER_SQUARE_CENTER = {
    x: CENTER_SQUARE.x + SQUARE_SIZE / 2,
    y: CENTER_SQUARE.y + SQUARE_SIZE / 2,
};
const TOP_RIGHT_SQUARE_CENTER = {
    x: TOP_RIGHT_SQUARE.x + SQUARE_SIZE / 2,
    y: TOP_RIGHT_SQUARE.y + SQUARE_SIZE / 2,
};

// Bezier Curve Helper
function getCubicBezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
    const k = 1 - t;
    return (
        k * k * k * p0 +
        3 * k * k * t * p1 +
        3 * k * t * t * p2 +
        t * t * t * p3
    );
}

// Animation Constants
const LAUNCH_START = { x: 600, y: 0 };
const LAUNCH_END = { x: 400, y: -166 }; // Top of Orbit
const ORBIT_CENTER = { x: 400, y: 400 };

// Bezier Control Points for Launch (Rocket-like curve)
const LAUNCH_CP1 = { x: 600, y: -100 }; // Start going UP
const LAUNCH_CP2 = { x: 500, y: -166 }; // Approach horizontal

// Orbit End Point (after 270 deg from Top) -> Right Side
const ORBIT_END = { x: 966, y: 400 };

// Bezier Control Points for Return (Soft landing)
const RETURN_CP1 = { x: 966, y: 100 }; // Leave orbit going UP (Stronger momentum with longer handle)
const RETURN_CP2 = { x: 600, y: 100 }; // Approach target from below

interface MetaballLogoProps {
    size?: number;
    autoPlay?: boolean;
    showPhaseIndicator?: boolean;
}

export function MetaballLogo({
    size = 400, // Ekranda görünecek boyut
    autoPlay = true,
}: MetaballLogoProps) {
    const [phase, setPhase] = useState<Phase>('idle');

    const [centerState, setCenterState] = useState({
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
    });

    const [topRightState, setTopRightState] = useState({
        x: 0,
        y: 0,
        borderRadius: SQUARE_RADIUS,
        scale: 1,
        opacity: 1,
    });

    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const [bridgeOpacity, setBridgeOpacity] = useState(1); // Köprü görünürlüğü

    // Filter params
    const blur = 30;
    const alpha = 50;
    const shift = -18;
    const gooFilterId = "goo";

    const TIMINGS = {
        idle: 2000,
        merge: 700,
        launch: 1350, // Calculated for 445px/s orbit match
        orbit: 8000,
        return: 2500, // Calculated for 445px/s braking
        split: 700,
    };

    const easeInQuart = (t: number) => t * t * t * t;
    const easeInQuad = (t: number) => t * t;
    const easeOutQuad = (t: number) => t * (2 - t);
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3); // Softer easing

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

            // Merge destination: Center move towards Top Right
            const tx = (TOP_RIGHT_SQUARE.x - CENTER_SQUARE.x) * ease;
            const ty = (TOP_RIGHT_SQUARE.y - CENTER_SQUARE.y) * ease;

            setCenterState(prev => ({ ...prev, x: tx, y: ty, scale: 1 - 0.2 * ease }));

            // Merge sırasında köprüyü yavaşça kaybet
            setBridgeOpacity(1 - ease);

            if (t >= 1) {
                setPhase('launch');
                startTimeRef.current = time;
            }
        } else if (phase === 'launch') {
            const t = Math.min(elapsed / TIMINGS.launch, 1);
            const ease = easeInQuad(t); // Match orbital velocity at end

            // Bezier Path Movement
            const bx = getCubicBezierPoint(ease, LAUNCH_START.x, LAUNCH_CP1.x, LAUNCH_CP2.x, LAUNCH_END.x);
            const by = getCubicBezierPoint(ease, LAUNCH_START.y, LAUNCH_CP1.y, LAUNCH_CP2.y, LAUNCH_END.y);

            // Relatif hareket (TopRightSquare başlangıç noktasına göre ne kadar kaymalı)
            const tx = bx - TOP_RIGHT_SQUARE.x;
            const ty = by - TOP_RIGHT_SQUARE.y;

            setTopRightState(prev => ({
                ...prev,
                x: tx,
                y: ty,
                borderRadius: SQUARE_RADIUS + (SQUARE_SIZE / 2 - SQUARE_RADIUS) * ease, // Circle Morph
                scale: 1 - 0.5 * ease // Shrink
            }));

            // Center square should disappear (merge into rocket)
            setCenterState(prev => ({ ...prev, opacity: 0 }));

            if (t >= 1) {
                setPhase('orbit');
                startTimeRef.current = time;
            }
        } else if (phase === 'orbit') {
            const t = Math.min(elapsed / TIMINGS.orbit, 1);

            // Fixed Path: Start from Top (-90 deg), Go CCW 270 deg
            const startAngle = -Math.PI / 2; // -90 deg (Top)
            const totalTravel = -Math.PI * 3.5; // 1 Full Lap + 270 deg (Total 630 deg)
            const currentAngle = startAngle + totalTravel * t;

            // Orbit Position
            const ox = Math.cos(currentAngle) * ORBIT_RADIUS;
            const oy = Math.sin(currentAngle) * ORBIT_RADIUS;

            const targetX = ORBIT_CENTER.x + ox - SQUARE_SIZE / 2;
            const targetY = ORBIT_CENTER.y + oy - SQUARE_SIZE / 2;

            const tx = targetX - TOP_RIGHT_SQUARE.x;
            const ty = targetY - TOP_RIGHT_SQUARE.y;

            setTopRightState(prev => ({ ...prev, x: tx, y: ty }));

            // Center Square stays hidden during orbit
            // setCenterState is removed to prevent ghost movement

            if (t >= 1) {
                setPhase('return');
                startTimeRef.current = time;
            }
        } else if (phase === 'return') {
            const t = Math.min(elapsed / TIMINGS.return, 1);
            const ease = easeOutQuad(t); // Match orbital velocity at start, brake to stop

            // Bezier Path Movement
            const bx = getCubicBezierPoint(ease, ORBIT_END.x, RETURN_CP1.x, RETURN_CP2.x, LAUNCH_START.x);
            const by = getCubicBezierPoint(ease, ORBIT_END.y, RETURN_CP1.y, RETURN_CP2.y, LAUNCH_START.y);

            const tx = bx - TOP_RIGHT_SQUARE.x;
            const ty = by - TOP_RIGHT_SQUARE.y;

            setTopRightState(prev => ({
                ...prev,
                x: tx,
                y: ty,
                borderRadius: SQUARE_SIZE / 2 - (SQUARE_SIZE / 2 - SQUARE_RADIUS) * ease, // Morph back to Square
                scale: 0.5 + (1 - 0.5) * ease // Grow back
            }));

            // Keep Center hidden until landing
            setCenterState(prev => ({ ...prev, opacity: 0 }));

            if (t >= 1) {
                setPhase('split');
                startTimeRef.current = time;
            }
        } else if (phase === 'split') {
            const t = Math.min(elapsed / TIMINGS.split, 1);
            const ease = 1 - Math.pow(1 - t, 4);

            // Calculate start position (Merged state) based on constants
            const startX = TOP_RIGHT_SQUARE.x - CENTER_SQUARE.x;
            const startY = TOP_RIGHT_SQUARE.y - CENTER_SQUARE.y;

            setCenterState({
                x: startX * (1 - ease),
                y: startY * (1 - ease),
                scale: 0.8 + 0.2 * ease,
                opacity: 1, // Re-appear
            });

            // Köprüyü geri getir (Gooey effect for splitting)
            setBridgeOpacity(ease);

            if (t >= 1) {
                setPhase('idle');
                setBridgeOpacity(1); // Idle'a dönünce köprüyü geri getir
                startTimeRef.current = time;
            }
        }

        animationRef.current = requestAnimationFrame(update);
    }, [phase, autoPlay]);

    useEffect(() => {
        if (autoPlay) {
            animationRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [autoPlay, update]);

    return (
        <div className="relative flex flex-col items-center gap-8">
            <svg
                width={size}
                height={size}
                viewBox="-300 -300 1400 1400"
                className="overflow-visible"
            >
                <defs>
                    {/* Grid Pattern */}
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    </pattern>

                    {/* Metaball Filtresi */}
                    <filter id={gooFilterId}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -24" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>

                    <linearGradient id="logoGradient" gradientUnits="userSpaceOnUse" x1="-300" y1="-300" x2="1100" y2="1100">
                        <stop offset="0%" stopColor="#fd2d6a" />
                        <stop offset="33%" stopColor="#fea52d" />
                        <stop offset="66%" stopColor="#19a8fa" />
                        <stop offset="100%" stopColor="#f979d0" />

                        {/* Gradient Rotasyonu (Hareket) */}
                        <animateTransform
                            attributeName="gradientTransform"
                            type="rotate"
                            from="0 400 400"
                            to="360 400 400"
                            dur="5s"
                            repeatCount="indefinite"
                        />
                    </linearGradient>

                    <mask id="metaball-mask">
                        <rect width="100%" height="100%" fill="black" />
                        <g filter="url(#goo)">
                            {/* Bridge (Köprü) - Maske için Beyaz */}
                            <rect
                                x={380}
                                y={215}
                                width={350}
                                height={50}
                                fill="white"
                                style={{
                                    opacity: bridgeOpacity,
                                    transform: `rotate(125deg) scale(${bridgeOpacity})`,
                                    transformBox: "fill-box",
                                    transformOrigin: "center center"
                                }}
                            />

                            {/* Merkez Kare - Maske için Beyaz */}
                            <rect
                                x={CENTER_SQUARE.x}
                                y={CENTER_SQUARE.y}
                                width={SQUARE_SIZE}
                                height={SQUARE_SIZE}
                                rx={SQUARE_RADIUS}
                                fill="white"
                                style={{
                                    transform: `translate(${centerState.x}px, ${centerState.y}px) scale(${centerState.scale})`,
                                    transformOrigin: `${CENTER_SQUARE_CENTER.x}px ${CENTER_SQUARE_CENTER.y}px`,
                                    opacity: centerState.opacity,
                                }}
                            />

                            {/* Sağ Üst Kare - Maske için Beyaz */}
                            <rect
                                x={TOP_RIGHT_SQUARE.x}
                                y={TOP_RIGHT_SQUARE.y}
                                width={SQUARE_SIZE}
                                height={SQUARE_SIZE}
                                rx={topRightState.borderRadius}
                                fill="white"
                                style={{
                                    transform: `translate(${topRightState.x}px, ${topRightState.y}px) scale(${topRightState.scale})`,
                                    transformOrigin: `${TOP_RIGHT_SQUARE_CENTER.x}px ${TOP_RIGHT_SQUARE_CENTER.y}px`,
                                    opacity: topRightState.opacity,
                                }}
                            />
                        </g>
                    </mask>
                </defs>

                {/* Statik Katman: L Gövdesi */}
                <path
                    d={MAIN_L_PATH}
                    fill="url(#logoGradient)"
                    className="transition-all duration-300"
                    transform="scale(2)"
                />

                {/* Dinamik Katman: Metaball Güzelliği */}
                {/* Dinamik Katman: Maskelenmiş Global Gradient Rect */}
                <rect
                    x="-300"
                    y="-300"
                    width="1400"
                    height="1400"
                    fill="url(#logoGradient)"
                    mask="url(#metaball-mask)"
                />

                {/* Debug Grid Lines */}
                <rect width="800" height="800" fill="url(#grid)" />
                <rect width="800" height="800" fill="none" stroke="rgba(255,0,0,0.3)" strokeWidth="2" />
            </svg>

            {/* Debug Info */}
            <div className="text-xs font-mono text-white/50 bg-black/20 p-4 rounded-lg flex flex-col gap-1">
                <div>Phase: <span className="text-blue-400 uppercase">{phase}</span></div>
                <div>System: 400x400 Original ViewBox</div>
                <div>Unit: 85px Precise Mesh</div>
            </div>
        </div>
    );
}

// ===== DEMO PAGE =====
export default function Demo3Page() {
    return (
        <div className="min-h-screen bg-[#08080a]">
            <div className="text-center pt-8 pb-3">
                <h1 className="text-white text-2xl font-bold tracking-tight">
                    Cliniolabs Metaball Logo (Experimental Orbit)
                </h1>
                <p className="text-white/40 mt-1.5 text-xs">
                    600x600 Grid System Implementation - Demo 3
                </p>
            </div>

            <div className="py-6 flex justify-center">
                <MetaballLogo
                    size={400}
                    autoPlay={true}
                />
            </div>
        </div>
    );
}
