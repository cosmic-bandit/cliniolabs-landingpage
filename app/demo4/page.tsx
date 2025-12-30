'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// ===== CLINIOLABS METABALL LOGO (GRID SYSTEM) =====
// Same logic as Demo 3
// ...

type Phase = 'idle' | 'merge' | 'launch' | 'orbit' | 'return' | 'split';

const VIEWBOX_SIZE = 800;
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
}

export function MetaballLogo({
    size = 400,
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
    const [bridgeOpacity, setBridgeOpacity] = useState(1);

    const gooFilterId = "goo-demo4"; // Unique ID for this page

    const TIMINGS = {
        idle: 2000,
        merge: 700,
        launch: 1350,
        orbit: 8000,
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
                x: tx,
                y: ty,
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
            const totalTravel = -Math.PI * 3.5;
            const currentAngle = startAngle + totalTravel * t;

            const ox = Math.cos(currentAngle) * ORBIT_RADIUS;
            const oy = Math.sin(currentAngle) * ORBIT_RADIUS;

            const targetX = ORBIT_CENTER.x + ox - SQUARE_SIZE / 2;
            const targetY = ORBIT_CENTER.y + oy - SQUARE_SIZE / 2;

            const tx = targetX - TOP_RIGHT_SQUARE.x;
            const ty = targetY - TOP_RIGHT_SQUARE.y;

            setTopRightState(prev => ({ ...prev, x: tx, y: ty }));

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
                x: tx,
                y: ty,
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

            // Faster bridge appearance
            setBridgeOpacity(Math.min(ease * 4, 1));

            if (t >= 1) {
                setPhase('idle');
                setBridgeOpacity(1);
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
                    <filter id={gooFilterId}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -24" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>

                    <linearGradient id="logoGradient-demo4" gradientUnits="userSpaceOnUse" x1="-300" y1="-300" x2="1100" y2="1100">
                        <stop offset="0%" stopColor="#fd2d6a" />
                        <stop offset="33%" stopColor="#fea52d" />
                        <stop offset="66%" stopColor="#19a8fa" />
                        <stop offset="100%" stopColor="#f979d0" />
                        <animateTransform
                            attributeName="gradientTransform"
                            type="rotate"
                            from="0 400 400"
                            to="360 400 400"
                            dur="5s"
                            repeatCount="indefinite"
                        />
                    </linearGradient>

                    <mask id="metaball-mask-demo4">
                        <rect width="100%" height="100%" fill="black" />
                        <g filter={`url(#${gooFilterId})`}>
                            <rect
                                x={380}
                                y={215}
                                width={350}
                                height={50}
                                fill="white"
                                style={{
                                    opacity: bridgeOpacity,
                                    transform: `rotate(315deg) scale(${bridgeOpacity})`,
                                    transformBox: "fill-box",
                                    transformOrigin: "center center"
                                }}
                            />
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

                <path
                    d={MAIN_L_PATH}
                    fill="url(#logoGradient-demo4)"
                    className="transition-all duration-300"
                    transform="scale(2)"
                />

                <rect
                    x="-300"
                    y="-300"
                    width="1400"
                    height="1400"
                    fill="url(#logoGradient-demo4)"
                    mask="url(#metaball-mask-demo4)"
                />
            </svg>

            <div className="text-xs font-mono text-slate-500 bg-white/80 p-4 rounded-lg flex flex-col gap-1 border border-slate-200 shadow-sm backdrop-blur-sm">
                <div>Phase: <span className="text-blue-600 font-bold uppercase">{phase}</span></div>
                <div>Background: Acernity Grid (Light)</div>
            </div>
        </div>
    );
}

// ===== DEMO PAGE =====
export default function Demo4Page() {
    return (
        <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#00000020_1px,transparent_1px),linear-gradient(to_bottom,#00000020_1px,transparent_1px)] bg-[size:40px_40px]">
                {/* Radial Gradient Mask for softness */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,transparent_0%,white_100%)] pointer-events-none" />
            </div>

            <div className="relative z-10 text-center -mt-20 mb-10">
                <h1 className="text-slate-900 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Cliniolabs Logo
                </h1>
                <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
                    Testing on Acernity UI Style Grid Background (Light Mode)
                </p>
            </div>

            <div className="relative z-10 scale-90 sm:scale-100">
                <MetaballLogo
                    size={400}
                    autoPlay={true}
                />
            </div>
        </div>
    );
}
