"use client"

import React, { useState, useEffect, useRef, useCallback, useId } from "react"
import Image from "next/image"
import {
    Link as LinkIcon,
    Gear,
    RocketLaunch,
} from "@phosphor-icons/react"
import { ChevronRight, Star, ArrowRight, Phone, Mail, Check, Menu, Lock, Lightbulb } from "lucide-react"
import { Linkedin, Twitter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PillTabs } from "@/components/ui/animated-tabs"
import { AnimatedList } from "@/components/ui/animated-list"
import { Meteors } from "@/components/ui/meteors"
import { Button } from "@/components/ui/button"
import { AnimatedBeam, Circle } from "@/components/ui/animated-beam"
import { motion, useScroll, useTransform } from "framer-motion"

// ===== METABALL LOGO COMPONENT (From Demo 4) =====

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
}

export function MetaballLogo({
    size = 400,
    autoPlay = true,
}: MetaballLogoProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [centerState, setCenterState] = useState({ x: 0, y: 0, scale: 1, opacity: 1 });
    const [topRightState, setTopRightState] = useState({ x: 0, y: 0, borderRadius: SQUARE_RADIUS, scale: 1, opacity: 1 });
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const [bridgeOpacity, setBridgeOpacity] = useState(1);
    const gooFilterId = "goo-v2";

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
    }, [phase, autoPlay]);

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
                <linearGradient id="logoGradient-v2" gradientUnits="userSpaceOnUse" x1="-300" y1="-300" x2="1100" y2="1100">
                    <stop offset="0%" stopColor="#fd2d6a" />
                    <stop offset="33%" stopColor="#fea52d" />
                    <stop offset="66%" stopColor="#19a8fa" />
                    <stop offset="100%" stopColor="#f979d0" />
                    <animateTransform attributeName="gradientTransform" type="rotate" from="0 400 400" to="360 400 400" dur="5s" repeatCount="indefinite" />
                </linearGradient>
                <mask id="metaball-mask-v2">
                    <rect width="100%" height="100%" fill="black" />
                    <g filter={`url(#${gooFilterId})`}>
                        <rect x={380} y={215} width={350} height={50} fill="white" style={{ opacity: bridgeOpacity, transform: `rotate(315deg) scale(${bridgeOpacity})`, transformBox: "fill-box", transformOrigin: "center center" }} />
                        <rect x={CENTER_SQUARE.x} y={CENTER_SQUARE.y} width={SQUARE_SIZE} height={SQUARE_SIZE} rx={SQUARE_RADIUS} fill="white" style={{ transform: `translate(${centerState.x}px, ${centerState.y}px) scale(${centerState.scale})`, transformOrigin: `${CENTER_SQUARE_CENTER.x}px ${CENTER_SQUARE_CENTER.y}px`, opacity: centerState.opacity, }} />
                        <rect x={TOP_RIGHT_SQUARE.x} y={TOP_RIGHT_SQUARE.y} width={SQUARE_SIZE} height={SQUARE_SIZE} rx={topRightState.borderRadius} fill="white" style={{ transform: `translate(${topRightState.x}px, ${topRightState.y}px) scale(${topRightState.scale})`, transformOrigin: `${TOP_RIGHT_SQUARE_CENTER.x}px ${TOP_RIGHT_SQUARE_CENTER.y}px`, opacity: topRightState.opacity, }} />
                    </g>
                </mask>
            </defs>
            <path d={MAIN_L_PATH} fill="url(#logoGradient-v2)" className="transition-all duration-300" transform="scale(2)" />
            <rect x="-300" y="-300" width="1400" height="1400" fill="url(#logoGradient-v2)" mask="url(#metaball-mask-v2)" />
        </svg>
    );
}

// ===== LANDING PAGE COMPONENTS =====

// AnimatedBeam for Integrations
const IntegrationsBeam = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const leftTopRef = useRef<HTMLDivElement>(null)
    const leftBottomRef = useRef<HTMLDivElement>(null)
    const centerRef = useRef<HTMLDivElement>(null)
    const rightTop1Ref = useRef<HTMLDivElement>(null)
    const rightTop2Ref = useRef<HTMLDivElement>(null)
    const rightBottom1Ref = useRef<HTMLDivElement>(null)
    const rightBottom2Ref = useRef<HTMLDivElement>(null)

    return (
        <div ref={containerRef} className="relative flex h-[500px] w-full items-center justify-between overflow-hidden rounded-lg bg-transparent p-10 max-w-4xl mx-auto">
            <AnimatedBeam containerRef={containerRef} fromRef={leftTopRef} toRef={centerRef} curvature={0} gradientStartColor="#10b981" gradientStopColor="#34d399" />
            <AnimatedBeam containerRef={containerRef} fromRef={leftBottomRef} toRef={centerRef} curvature={0} gradientStartColor="#10b981" gradientStopColor="#34d399" />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={rightTop1Ref} curvature={0} reverse gradientStartColor="#10b981" gradientStopColor="#34d399" />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={rightTop2Ref} curvature={0} reverse gradientStartColor="#10b981" gradientStopColor="#34d399" />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={rightBottom1Ref} curvature={0} reverse gradientStartColor="#10b981" gradientStopColor="#34d399" />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={rightBottom2Ref} curvature={0} reverse gradientStartColor="#10b981" gradientStopColor="#34d399" />

            <div className="flex flex-col justify-center gap-16 z-10">
                <div ref={leftTopRef} className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <Image src="/logos/camera.fill.svg" alt="Camera" width={32} height={32} />
                </div>
                <div ref={leftBottomRef} className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <Image src="/logos/whatsapp-8.svg" alt="WhatsApp" width={32} height={32} />
                </div>
            </div>

            <div className="flex flex-col justify-center z-20">
                <div ref={centerRef} className="flex h-24 w-24 items-center justify-center rounded-full border border-gray-200 bg-white shadow-2xl">
                    <Image src="/logos/cliniolabs-logo-vertical.svg" alt="ClinicLabs Logo" width={64} height={64} className="object-contain" />
                </div>
            </div>

            <div className="flex flex-col justify-center gap-8 z-10">
                <div ref={rightTop1Ref} className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <Image src="/logos/chatgpt-6.svg" alt="Chat GPT" width={32} height={32} />
                </div>
                <div ref={rightTop2Ref} className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <Image src="/logos/new-logo-drive-google.svg" alt="Google Drive" width={32} height={32} />
                </div>
                <div ref={rightBottom1Ref} className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <Image src="/logos/google-sheets-logo-icon.svg" alt="Google Sheets" width={28} height={28} />
                </div>
                <div ref={rightBottom2Ref} className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <Image src="/logos/google-calendar-icon-2020-.svg" alt="Google Calendar" width={32} height={32} />
                </div>
            </div>
        </div>
    )
}

// Testimonial Card
const TestimonialCard = ({ quote, name, role, clinic }: { quote: string; name: string; role: string; clinic: string }) => (
    <div className="testimonial-card">
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
        <p className="testimonial-quote">{quote}</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {name.charAt(0)}
            </div>
            <div>
                <p className="testimonial-author">{name}</p>
                <p className="testimonial-role">{role} • {clinic}</p>
            </div>
        </div>
    </div>
)

// Sliding Navigation
const SlidingNav = () => {
    const [hoveredNav, setHoveredNav] = useState<string | null>(null)
    const navItems = [
        { label: "Özellikler", href: "#features" },
        { label: "Nasıl Çalışır", href: "#how-it-works" },
        { label: "Referanslar", href: "#testimonials" },
        { label: "Fiyatlandırma", href: "#pricing" },
    ]

    return (
        <div className="hidden md:flex items-center gap-1 relative" onMouseLeave={() => setHoveredNav(null)}>
            {navItems.map((item) => (
                <a key={item.href} href={item.href} className="nav-link" onMouseEnter={() => setHoveredNav(item.href)}>
                    {item.label}
                    {hoveredNav === item.href && (
                        <motion.span layoutId="navHoverSlide" className="absolute inset-0 bg-gray-100 rounded-lg" style={{ zIndex: -1 }} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                </a>
            ))}
        </div>
    )
}

// ===== FLOATING CONVERSATION BUBBLES =====

const SCENARIOS = [
    {
        // 1. Sol Orta - Türkçe (Fiyat)
        id: 1,
        position: "left-middle",
        lang: "tr",
        q: "Merhaba, saç ekimi fiyatınız nedir?",
        a: "Merhaba, ben Cliniolabs saç ekim danışmanı Mila. Her tedavi kişiye özel olduğu için size birkaç kısa sorum olacak."
    },
    {
        // 2. Sağ Alt - Almanca (Devam - Ekim geçmişi)
        id: 2,
        position: "right-bottom",
        lang: "de",
        q: "Haben Sie bereits eine Haartransplantation durchführen lassen?", // AI soruyor aslında senaryoda
        a: "Nein, das ist das erste Mal.", // Hasta cevaplıyor
        isAiFirst: true // Bu senaryoda önce AI soruyor
    },
    {
        // 3. Sol Alt - Türkçe (Aile hikayesi)
        id: 3,
        position: "left-bottom",
        lang: "tr",
        q: "Ailenizde saç dökülmesi yaşayan başka birileri var mı?", // AI soruyor
        a: "Evet, amcamda var.", // Hasta cevaplıyor
        isAiFirst: true
    },
    {
        // 4. Sağ Üst - Arapça (Fotoğraf) - YENİ SENARYO
        id: 4,
        position: "right-top",
        lang: "ar",
        q: "photo_upload", // Hasta sorusu: Fotoğraflar + "Yeterli mi?"
        qText: "هل هذه الصور الثلاث كافية؟",
        a: "نعم، تحليلنا يظهر: مستوى نوروود 3، يلزم 3500 بصيلة، تقنية DHI، جلسة واحدة.", // AI Cevabı: Analiz
        isAiFirst: false
    },
    {
        // 5. Sol Üst - İtalyanca (Randevu)
        id: 5,
        position: "left-top",
        lang: "it",
        q: "Fissiamo un appuntamento per lei?", // AI soruyor
        a: "Va bene martedì prossimo alle 13:00.", // Hasta cevaplıyor
        isAiFirst: true
    }
];

const POSITIONS: Record<string, string> = {
    // Koordinatlar (Metaball 400x400 merkezli)
    "left-middle": "top-1/2 -left-[80%] -translate-y-1/2", // 1
    "right-bottom": "bottom-0 -right-[100%]", // 2
    "left-bottom": "bottom-0 -left-[60%]", // 3
    "right-top": "top-[15%] -right-[80%]", // 4
    "left-top": "top-0 -left-[60%]", // 5
};

// Typing Indicator Component
const TypingIndicator = () => (
    <div className="flex gap-1 items-center justify-center min-h-[22px]">
        <motion.div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
    </div>
);

// Single Conversation Component (Manages its own enter/exit animation)
function SingleConversation({ scenario, isActive, enterDelay = 0 }: { scenario: typeof SCENARIOS[0], isActive: boolean, enterDelay?: number }) {
    const [step, setStep] = useState(0);
    // 0: Hidden
    // 1: Show Msg 1 (User)
    // 2: Msg 1 Up + Typing (AI)
    // 3: Show Msg 2 (AI)
    // 4: Exit

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isActive) {
            // ENTER SEQUENCE
            if (step === 0 || step === 4) {
                const startSequence = () => {
                    setStep(1); // Start

                    // Show Typing after 1.5s
                    timer = setTimeout(() => {
                        setStep(2);

                        // Show Answer after 1s typing
                        timer = setTimeout(() => {
                            setStep(3);
                        }, 1000);
                    }, 1500);
                };

                if (enterDelay > 0) {
                    timer = setTimeout(startSequence, enterDelay);
                } else {
                    startSequence();
                }
            }
        } else {
            // EXIT SEQUENCE
            // If active and becomes inactive, trigger exit
            if (step > 0 && step < 4) {
                setStep(4); // Exit animation

                // Reset to hidden after animation completes (0.5s)
                timer = setTimeout(() => {
                    setStep(0);
                }, 500);
            }
        }

        return () => clearTimeout(timer);
    }, [isActive]); // Only react to Active/Inactive toggle

    const posClass = POSITIONS[scenario.position];
    const isAiStarting = scenario.isAiFirst || false;

    // Content preparation
    const content1 = scenario.q === "photo_upload" ? (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative"><Image src="/images/layer-201.jpg" alt="Photo" fill className="object-cover" /></div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative"><Image src="/images/layer-203.jpg" alt="Photo" fill className="object-cover" /></div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative"><Image src="/images/layer-202.jpg" alt="Photo" fill className="object-cover" /></div>
            </div>
            {scenario.qText && <span className="text-xs">{scenario.qText}</span>}
        </div>
    ) : scenario.q;

    // Styles
    const aiStyle = "bg-emerald-500/10 border-emerald-200/50 text-gray-800 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-xl border text-sm max-w-[240px] self-end origin-bottom-right text-right";
    const userStyle = "bg-white/70 border-gray-200 text-gray-800 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-xl border text-sm max-w-[240px] self-start origin-bottom-left text-left";

    const box1Style = isAiStarting ? aiStyle : userStyle;
    const box2Style = isAiStarting ? userStyle : aiStyle;

    if (step === 0) return null; // Don't render invisible bubbles

    return (
        <div className={`absolute ${posClass} z-20 flex flex-col w-[320px] pointer-events-none h-[170px] justify-end gap-2`}>
            {/* First Message */}
            <div
                className={`${box1Style} transition-all duration-500`}
                style={{
                    opacity: step >= 1 && step < 4 ? 1 : 0,
                    transform: step >= 1 && step < 4
                        ? (step >= 2 ? "translateY(0)" : "translateY(0)")
                        : "translateY(10px) scale(0.9)",
                }}
            >
                {content1}
            </div>

            {/* Second Message */}
            <div
                className={`${box2Style} transition-all duration-300`}
                style={{
                    opacity: step >= 2 && step < 4 ? 1 : 0,
                    transform: step >= 2 && step < 4 ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
                }}
            >
                {step === 2 && <TypingIndicator />}
                {step >= 3 && scenario.a}
            </div>
        </div>
    );
}

// Orchestrator Component
function FloatingConversation() {
    // Current cycle index (increments every GAP ms)
    const [cycleIndex, setCycleIndex] = useState(0);

    useEffect(() => {
        // Initial start
        setCycleIndex(0);

        const GAP = 4000; // 4 seconds between each new bubble set logic

        const interval = setInterval(() => {
            setCycleIndex(prev => prev + 1);
        }, GAP);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {SCENARIOS.map((scenario, index) => {
                // Determine if this scenario should be active
                // Requirement: 
                // Cycle 0: Show S0
                // Cycle 1: Show S1 (S0 still active)
                // Cycle 2: Show S2 (S0 exits)
                // ...
                // UPDATED: Use len + 1 to create a "Buffer" cycle at the end
                // This ensures Scenario 5 (last) becomes alone, then exits, BEFORE Scenario 1 (first) starts.

                const cycleLen = SCENARIOS.length + 1; // 6 cycles
                const currentScenarioIndex = cycleIndex % cycleLen;
                const previousScenarioIndex = (cycleIndex - 1 + cycleLen) % cycleLen;

                // Check if this scenario index matches either current or previous slot
                const isActive = (index === currentScenarioIndex) || (index === previousScenarioIndex && cycleIndex > 0);

                return (
                    <SingleConversation
                        key={scenario.id}
                        scenario={scenario}
                        isActive={isActive}
                        enterDelay={index === 0 ? 1000 : 0} // Delay first scenario to ensure clean separation
                    />
                );
            })}
        </>
    );
}

// ===== MAIN PAGE V2 =====

export default function V2Page() {
    const [scrollState, setScrollState] = useState({ isScrolled: false })
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

    useEffect(() => {
        const handleScroll = () => {
            setScrollState({ isScrolled: window.scrollY > 50 })
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const monthlyPrices = { starter: 2000, pro: 5000, enterprise: 15000 }
    const yearlyPrices = {
        starter: Math.round(monthlyPrices.starter * 0.75),
        pro: Math.round(monthlyPrices.pro * 0.75),
        enterprise: Math.round(monthlyPrices.enterprise * 0.75),
    }
    const prices = billingPeriod === "monthly" ? monthlyPrices : yearlyPrices

    return (
        <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans">
            <style jsx global>{`
        .gradient-text-apple {
          background: linear-gradient(90deg, #2997FF 0%, #A855F7 35%, #EC4899 65%, #f59023ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .section-badge {
          text-transform: capitalize;
          letter-spacing: .05em;
          background: linear-gradient(90deg, #2997ff 0%, #a855f7 35%, #ec4899 65%, #f59023 100%);
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          font-size: 20px;
          font-weight: 600;
        }
      `}</style>

            {/* ACERNITY GRID BACKGROUND */}
            <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#00000020_1px,transparent_1px),linear-gradient(to_bottom,#00000020_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none fixed z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,transparent_0%,white_100%)]" />
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md ${scrollState.isScrolled ? "shadow-sm border-b border-gray-100" : ""}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="#" className="flex items-center">
                        <Image src="/logos/cliniolabs-logo-horizontal.svg" alt="ClinicLabs" width={154} height={44} className="object-contain" />
                    </a>
                    <SlidingNav />
                    <Button className="btn-primary hidden md:flex items-center gap-2">
                        Ücretsiz deneyin
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] bg-white border-l border-gray-100 p-0">
                                {/* Mobile menu content... */}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION centered with Metaball Logo */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center px-6 mb-10 w-full">
                    <h1 className="text-slate-900 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl leading-tight mb-6 hidden md:block">
                        Kliniğiniz uyurken bile <br />
                        <span className="gradient-text-apple">çalışan akıllı asistan.</span>
                    </h1>
                    {/* Mobile Header */}
                    <h1 className="text-slate-900 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl leading-tight mb-6 md:hidden">
                        Kliniğiniz uyurken bile <br />
                        <span className="gradient-text-apple">çalışan akıllı asistan.</span>
                    </h1>


                    <div className="flex justify-center mb-0 scale-75 md:scale-90 opacity-90 hover:opacity-100 transition-opacity duration-500 relative">
                        {/* Floating Bubbles */}
                        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
                            <div className="relative w-[400px] h-[400px] mx-auto">
                                <FloatingConversation />
                            </div>
                        </div>

                        <MetaballLogo size={400} />
                    </div>

                    <p
                        className="text-black max-w-2xl mx-auto mb-10"
                        style={{
                            fontSize: "19px",
                            lineHeight: 1.4211026316,
                            fontWeight: 400,
                            letterSpacing: ".012em",
                            fontFamily: "SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif"
                        }}
                    >
                        WhatsApp üzerinden 7/24 hasta danışmanlığı, tıbbi düzeyde fotoğraf analizi ve otomatik randevu yönetimi. Tek platformda.
                    </p>


                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="btn-primary inline-flex items-center gap-2">
                            Hemen Başlayın
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button className="inline-flex items-center justify-center px-6 py-3 font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            Demo Talep Edin
                        </button>
                    </div>
                </div>


                <div className="mt-16 flex justify-center gap-8 sm:gap-16">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">50+</p>
                        <p className="text-sm text-gray-500 mt-1">Aktif Klinik</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">150K+</p>
                        <p className="text-sm text-gray-500 mt-1">İşlenen Mesaj</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">%34</p>
                        <p className="text-sm text-gray-500 mt-1">Dönüşüm Artışı</p>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="relative py-24 bg-gray-50/50 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="section-badge">Özellikler</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-4">Her şey tek panelde</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Hasta iletişiminden randevu yönetimine, tüm süreçleriniz otomatik.</p>
                    </div>

                    <IntegrationsBeam />

                    {/* Feature Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-24">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
                            <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                                <RocketLaunch size={24} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Otopilot Yönetim</h3>
                            <p className="text-gray-600 leading-relaxed">Siz kahvenizi içerken AI asistanınız hastaları karşılar, soruları yanıtlar ve randevuları organize eder.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
                            <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                                <Star size={24} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Fotoğraf Analizi</h3>
                            <p className="text-gray-600 leading-relaxed">Gönderilen fotoğrafları saniyeler içinde analiz eder, greft hesaplar ve yaklaşık fiyat teklifi sunar.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
                            <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                                <Gear size={24} weight="fill" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Tam Entegrasyon</h3>
                            <p className="text-gray-600 leading-relaxed">WhatsApp, Google Takvim, Sheets ve Drive ile tam uyumlu çalışır. Ekstra yazılıma gerek yok.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="relative py-32 relative z-10 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="section-badge">Fiyatlandırma</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-4">Kliniğinize uygun planı seçin,<br /> hemen başlayın.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                        {/* Basic Plan */}
                        <div className="pricing-card flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h3 className="pricing-title text-center">Başlangıç</h3>
                            <p className="pricing-description text-center mb-6">Küçük klinikler ve bireysel kullanıcılar için</p>

                            <div className="mb-6 text-center">
                                <span className="text-5xl font-bold text-gray-900 tracking-tight">4.000₺</span>
                                <span className="text-gray-500 text-lg font-medium">/ay</span>
                            </div>

                            <div className="text-center text-xs text-gray-500 mb-6 -mt-4">
                                * Kurulum ayrıca fiyatlandırılır
                            </div>

                            <button className="pricing-button w-full mb-8">
                                Abone Ol
                            </button>

                            <ul className="space-y-4 mb-4 flex-1 px-2">
                                <li className="pricing-feature">
                                    <Check className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                    <span className="text-gray-900 font-bold">1 WhatsApp Numara</span>
                                </li>
                                {["AI Saç Analizi", "7/24 Akıllı Asistan", "50+ Dil Desteği", "Randevu Yönetimi", "CRM Paneli", "Before/After", "Standart Destek"].map((f, i) => (
                                    <li key={i} className="pricing-feature">
                                        <Check className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                        <span className="text-gray-700">{f}</span>
                                    </li>
                                ))}
                                <li className="pricing-feature opacity-50">
                                    <span className="w-5 h-5 flex items-center justify-center font-bold text-sm">✕</span>
                                    <span className="text-gray-700">Kurulum Ayrı</span>
                                </li>
                            </ul>
                        </div>

                        {/* Preferred Plan */}
                        <div className="pricing-card flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-gray-900">
                            <h3 className="pricing-title text-center flex items-center justify-center gap-2">Profesyonel</h3>
                            <p className="pricing-description text-center mb-6">Büyüyen işletmeler için premium plan</p>

                            <div className="mb-6 text-center">
                                <span className="text-5xl font-bold text-gray-900 tracking-tight">5.500₺</span>
                                <span className="text-gray-500 text-lg font-medium">/ay</span>
                            </div>

                            <div className="text-center text-xs text-gray-500 mb-6 -mt-4">
                                12 ay taahhütlü
                            </div>

                            <button className="pricing-button bg-gray-900 text-white hover:bg-gray-800 w-full mb-8 ring-offset-2">
                                Abone Ol
                            </button>

                            <ul className="space-y-4 mb-4 flex-1 px-2">
                                <li className="pricing-feature">
                                    <Check className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                    <span className="text-gray-900 font-bold">1 WhatsApp Numara</span>
                                </li>
                                <li className="pricing-feature">
                                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                    <span className="text-emerald-700 font-bold">Ücretsiz Kurulum</span>
                                </li>
                                {["AI Saç Analizi", "7/24 Akıllı Asistan", "50+ Dil Desteği", "Randevu Yönetimi", "CRM Paneli", "Before/After", "Öncelikli Destek", "Kurulum Dahil", "Eğitim Dahil"].map((f, i) => (
                                    <li key={i} className="pricing-feature">
                                        <Check className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                        <span className="text-gray-700">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="pricing-card flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h3 className="pricing-title text-center">Kurumsal</h3>
                            <p className="pricing-description text-center mb-6">Büyük organizasyonlar için gelişmiş özelliklerle</p>

                            <div className="mb-6 text-center">
                                <span className="text-5xl font-bold text-gray-900 tracking-tight">9.990₺</span>
                                <span className="text-gray-500 text-lg font-medium">/ay'dan</span>
                            </div>

                            <div className="text-center text-xs text-gray-500 mb-6 -mt-4">
                                12 ay taahhütlü
                            </div>

                            <button className="pricing-button w-full mb-8">
                                Abone Ol
                            </button>

                            <ul className="space-y-4 mb-4 flex-1 px-2">
                                <li className="pricing-feature">
                                    <Check className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                    <span className="text-gray-900 font-bold">2+ WhatsApp Numara</span>
                                </li>
                                <li className="pricing-feature">
                                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                    <span className="text-emerald-700 font-bold">Ücretsiz Kurulum</span>
                                </li>
                                {["AI Saç Analizi", "7/24 Akıllı Asistan", "50+ Dil Desteği", "Randevu Yönetimi", "CRM Paneli", "Before/After", "Dedicated Destek", "Çoklu Lokasyon", "Merkezi Raporlama", "Özel Entegrasyonlar", "SLA Garantisi"].map((f, i) => (
                                    <li key={i} className="pricing-feature">
                                        <Check className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                        <span className="text-gray-700">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-20 border-t border-gray-100 pt-12 max-w-2xl mx-auto space-y-6">
                        <div className="flex items-center justify-center gap-3 text-emerald-800 bg-emerald-50 border border-emerald-100 px-6 py-4 rounded-2xl w-fit mx-auto shadow-sm">
                            <Lightbulb className="w-5 h-5 text-emerald-600" />
                            <span className="font-semibold">Profesyonel pakette 25.000₺ kurulum tasarrufu!</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-black text-xs font-medium uppercase tracking-wide">
                            <Lock className="w-3 h-3" />
                            <span>Tüm paketlerde: KVKK uyumlu • SSL korumalı • 7/24 sistem</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* Footer from OLP */}
            <footer className="bg-white border-t border-gray-100 py-16 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Top Main Section */}
                    <div className="py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Left Side - CTA & Branding (2 columns on large screens) */}
                        <div className="lg:col-span-2">
                            <a href="#" className="inline-block mb-6">
                                <Image src="/logos/cliniolabs-logo-horizontal.svg" alt="ClinicLabs" width={140} height={40} className="h-10 w-auto" />
                            </a>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">Hemen başlayın.</h3>
                            <p className="text-gray-500 font-medium mb-6">7 günlük ücretsiz denemeyi başlatın. Kredi kartı gerekmez.</p>
                            <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                                Ücretsiz deneyin
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Right Side - Links Grid (3 columns on large screens) */}
                        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {/* Product Column */}
                            <div>
                                <h4 className="footer-title">ÜRÜN</h4>
                                <ul className="space-y-3">
                                    <li><a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Özellikler</a></li>
                                    <li><a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Nasıl Çalışır</a></li>
                                    <li><a href="#testimonials" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Referanslar</a></li>
                                    <li><a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Fiyatlandırma</a></li>
                                </ul>
                            </div>

                            {/* Company Column */}
                            <div>
                                <h4 className="footer-title">ŞİRKET</h4>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Hakkımızda</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Blog</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Kariyer</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">İletişim</a></li>
                                </ul>
                            </div>

                            {/* Resources Column */}
                            <div>
                                <h4 className="footer-title">KAYNAKLAR</h4>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Dokümantasyon</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Yardım Merkezi</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">API</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Durum</a></li>
                                </ul>
                            </div>

                            {/* Legal Column */}
                            <div>
                                <h4 className="footer-title">YASAL</h4>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Gizlilik</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Kullanım Koşulları</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Çerezler</a></li>
                                    <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Lisanslar</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Social Media Icons */}
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Twitter">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>

                        {/* Copyright */}
                        <p className="text-sm text-gray-500">Copyright © 2025 Cliniolabs. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
