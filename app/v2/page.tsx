"use client"

import React, { useState, useEffect, useRef, useCallback, useId } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Link as LinkIcon,
    Gear,
    RocketLaunch,
} from "@phosphor-icons/react"
import { motion, useScroll, useTransform, AnimatePresence, LayoutGroup } from "framer-motion"
import { ChevronRight, Star, ArrowRight, Phone, Mail, Check, Menu, Lock, Lightbulb, Plus, X, ChevronUp, ChevronDown, Play, Pause, Linkedin, Twitter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { BackgroundBeams } from "@/components/ui/background-beams"

import SmartPage from "../smart2/page"
import MultilingualPage from "../multilingual/page"
import AIScanAnimation from "../scanbeam/page"
import DrivePage from "../drive/page"
import BeforeAfterPage from "../before-after/page"
import { CRMMockup, PatientSummaryMockup, PurchaseIntentMockup, AppointmentMockup } from "../crm-summary-score-randevu/page"

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

// ===== FEATURE TABS SECTION COMPONENTS =====

interface Feature {
    id: string
    iconType: "plus" | "color"
    colorGradient?: string
    title: string
    description: string
    image: string
}

const features: Feature[] = [
    {
        id: "smart-assistant",
        iconType: "plus",
        title: "7/24 Akıllı Asistan",
        description: "Gece 3'te gelen hastayı da karşılar, sorularını yanıtlar, ikna eder. Satış odaklı, empatik ve profesyonel bir danışman gibi konuşur.",
        image: "/images/2x/cliniolabs-hasta-yonetim.webp"
    },
    {
        id: "multilingual",
        iconType: "plus",
        title: "50+ Dil Desteği",
        description: "Hasta hangi dilde yazarsa yazsın, AI aynı dilde yanıt verir. Türkçe, İngilizce, Arapça, Rusça ve 50'den fazla dilde akıcı iletişim.",
        image: "/images/2x/cliniolabs-smart-filter.webp"
    },
    {
        id: "ai-analysis",
        iconType: "plus",
        title: "AI Fotoğraf Analizi",
        description: "Hasta fotoğraflarını saniyeler içinde analiz eder. Norwood seviyesi, greft tahmini, donör yoğunluğu ve uygun teknik önerisi sunar.",
        image: "/images/2x/cliniolabs-foto-analiz.webp"
    },
    {
        id: "drive",
        iconType: "plus",
        title: "Drive Entegrasyonu",
        description: "Tüm hasta fotoğrafları otomatik olarak Google Drive'da düzenli bir arşive akar; klasörleme ve dosya isimleri süreçle uyumlu şekilde standartlaşır.",
        image: "/images/2x/cliniolabs-oto-arsiv.webp"
    },
    {
        id: "before-after",
        iconType: "plus",
        title: "Before/After Paylaşımı",
        description: "Saç analizi tamamlanınca sistem, hastanın Norwood seviyesi ve saç tipine en yakın önceki vakaları Google Drive arşivinden otomatik bulur. Ardından hastaya benzer vaka bağlamında gönderir.",
        image: "/images/2x/cliniolabs-oto-arsiv.webp"
    },
    {
        id: "crm",
        iconType: "plus",
        title: "CRM Entegrasyonu",
        description: "Google Sheets üzerinde her vaka için hasta paneli oluşturarak lead'lerden operasyon sonrası takibe kadar tüm statüleri tek tabloya taşır.",
        image: "/images/2x/cliniolabs-oto-arsiv.webp"
    },
    {
        id: "summary",
        iconType: "plus",
        title: "Hasta Özeti",
        description: "WhatsApp ve foto analiz verilerini Google Sheets'te tek satırda toplar: İsim, yaş, önceki ekim durumu, dökülme seviyesi, genetik faktörler, ilaç kullanımı gibi temel verilerin yanında Norwood seviyesi, greft aralığı, donör kalitesi ve teknik öneri bilgilerini içeren bir özet oluşturur.",
        image: "/images/2x/cliniolabs-oto-arsiv.webp"
    },
    {
        id: "purchase-rate",
        iconType: "plus",
        title: "Satın Alma Niyet Skoru",
        description: "Sohbetlerden otomatik satın alma niyet skoru çıkarır: kim sıcak, kim kararsız, kim uzaklaşıyor netleşir. Sentiment analizi de mesajların tonunu izleyip pozitif/negatif/nötr duygu analizi yapar.",
        image: "/images/2x/cliniolabs-oto-arsiv.webp"
    },
    {
        id: "appointment",
        iconType: "plus",
        title: "Randevu Otomasyonu",
        description: "Google Calendar ile müsaitlik otomatik kontrol edilir; hasta doğal dille randevu alır ve gerekirse kolayca değiştirir. Daha az mesaj, daha hızlı randevu.",
        image: "/images/2x/cliniolabs-sonuc.webp"
    },
]

// Apple Font Styles
const appleFont = {
    fontFamily: '"SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif',
}

const appleFontTitle = {
    ...appleFont,
    fontSize: '17px',
    fontWeight: 500,
    letterSpacing: '-0.374px',
    lineHeight: '21px',
}

const appleFontBody = {
    ...appleFont,
    fontSize: '17px',
    fontWeight: 400,
    letterSpacing: '-0.374px',
    lineHeight: '25px',
}

// ===== VERTICAL INTEGRATIONS BEAM (Default Visual) =====
const VerticalIntegrationsBeam = ({ paused = false }: { paused?: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const topRef = useRef<HTMLDivElement>(null)
    const centerRef = useRef<HTMLDivElement>(null)
    const bottom1Ref = useRef<HTMLDivElement>(null)
    const bottom2Ref = useRef<HTMLDivElement>(null)
    const bottom3Ref = useRef<HTMLDivElement>(null)
    const bottom4Ref = useRef<HTMLDivElement>(null)

    // FORCE UPDATE fix for scale animation layout shift
    const [tick, setTick] = useState(0)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTick(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        >
            {/* ===== ANIMATED BEAMS ===== */}

            {/* Top to Center (WhatsApp → Cliniolabs) */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={topRef}
                toRef={centerRef}
                curvature={0}
                vertical={true}
                gradientStartColor="#25D366"
                gradientStopColor="#128C7E"
                pathWidth={2}
                pathOpacity={0.12}
                startXOffset={tick ? 0.001 : 0}
                duration={4}
                paused={paused}
            />

            {/* Center to Bottom - Simetrik fan-out */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={centerRef}
                toRef={bottom1Ref}
                curvature={-80}
                vertical={true}
                reverse={true}
                gradientStartColor="#10b981"
                gradientStopColor="#34d399"
                pathWidth={2}
                pathOpacity={0.12}
                startXOffset={tick ? 0.001 : 0}
                duration={5}
                paused={paused}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={centerRef}
                toRef={bottom2Ref}
                curvature={-30}
                vertical={true}
                reverse={true}
                gradientStartColor="#10b981"
                gradientStopColor="#34d399"
                pathWidth={2}
                pathOpacity={0.12}
                startXOffset={tick ? 0.001 : 0}
                duration={4.5}
                paused={paused}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={centerRef}
                toRef={bottom3Ref}
                curvature={30}
                vertical={true}
                reverse={true}
                gradientStartColor="#10b981"
                gradientStopColor="#34d399"
                pathWidth={2}
                pathOpacity={0.12}
                startXOffset={tick ? 0.001 : 0}
                duration={5.5}
                paused={paused}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={centerRef}
                toRef={bottom4Ref}
                curvature={80}
                vertical={true}
                reverse={true}
                gradientStartColor="#10b981"
                gradientStopColor="#34d399"
                pathWidth={2}
                pathOpacity={0.12}
                startXOffset={tick ? 0.001 : 0}
                duration={4.8}
                paused={paused}
            />

            {/* ===== NODES - Absolute Positioning ===== */}

            {/* TOP - WhatsApp */}
            <div
                ref={topRef}
                className="absolute left-1/2 -translate-x-1/2 top-24 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10"
            >
                <Image src="/logos/whatsapp-8.svg" alt="WhatsApp" width={28} height={28} />
            </div>

            {/* CENTER - Cliniolabs Logo */}
            <div
                ref={centerRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-24 w-24 items-center justify-center rounded-full border border-gray-200 bg-white shadow-2xl z-20"
            >
                <Image
                    src="/logos/cliniolabs-logo-vertical.svg"
                    alt="Cliniolabs Logo"
                    width={56}
                    height={56}
                    className="object-contain"
                />
            </div>

            {/* BOTTOM - 4 icons */}
            <div
                ref={bottom1Ref}
                className="absolute bottom-8 left-[calc(50%-180px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10"
            >
                <Image src="/logos/chatgpt-6.svg" alt="ChatGPT" width={28} height={28} />
            </div>
            <div
                ref={bottom2Ref}
                className="absolute bottom-8 left-[calc(50%-60px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10"
            >
                <Image src="/logos/new-logo-drive-google.svg" alt="Google Drive" width={28} height={28} />
            </div>
            <div
                ref={bottom3Ref}
                className="absolute bottom-8 left-[calc(50%+60px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10"
            >
                <Image src="/logos/google-sheets-logo-icon.svg" alt="Google Sheets" width={24} height={24} />
            </div>
            <div
                ref={bottom4Ref}
                className="absolute bottom-8 left-[calc(50%+180px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10"
            >
                <Image src="/logos/google-calendar-icon-2020-.svg" alt="Google Calendar" width={26} height={28} />
            </div>
        </div>
    )
}

function FeatureTab({
    feature,
    isActive,
    onClick
}: {
    feature: Feature
    isActive: boolean
    onClick: () => void
}) {
    return (
        <motion.div
            layout
            onClick={onClick}
            className={`
                cursor-pointer select-none
                ${isActive
                    ? 'bg-[#f5f5f7] rounded-[18px] p-5'
                    : 'bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] rounded-[18px] py-3 px-5'
                }
            `}
            style={{
                width: isActive ? '100%' : 'fit-content',
            }}
            initial={false}
            transition={{
                layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
            }}
        >
            <motion.div layout="position" className="flex items-start gap-3">
                <AnimatePresence mode="popLayout">
                    {!isActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="flex-shrink-0 mt-0.5"
                        >
                            {feature.iconType === "color" ? (
                                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.colorGradient}`} />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-[2px] border-[#1d1d1f] flex items-center justify-center">
                                    <Plus className="w-3 h-3 text-[#1d1d1f]" strokeWidth={3} />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div layout="position" className="flex-1">
                    {isActive ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            style={appleFontBody}
                        >
                            <span style={{ fontWeight: 600 }} className="text-[#1d1d1f]">
                                {feature.title}.
                            </span>{" "}
                            <span className="text-[#86868b]">
                                {feature.description}
                            </span>
                        </motion.p>
                    ) : (
                        <span
                            style={appleFontTitle}
                            className="text-[#1d1d1f] whitespace-nowrap"
                        >
                            {feature.title}
                        </span>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

function ScrollIndicator({
    className,
    onPrev,
    onNext,
    canGoPrev,
    canGoNext
}: {
    className?: string
    onPrev: () => void
    onNext: () => void
    canGoPrev: boolean
    canGoNext: boolean
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <button
                onClick={onPrev}
                disabled={!canGoPrev}
                className={`w-9 h-9 rounded-full border border-[#d2d2d7] bg-white flex items-center justify-center transition-all duration-200 ${canGoPrev ? 'text-[#1d1d1f] hover:border-[#86868b] cursor-pointer' : 'text-[#d2d2d7] cursor-not-allowed'}`}
            >
                <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`w-9 h-9 rounded-full border border-[#d2d2d7] bg-white flex items-center justify-center transition-all duration-200 ${canGoNext ? 'text-[#1d1d1f] hover:border-[#86868b] cursor-pointer' : 'text-[#d2d2d7] cursor-not-allowed'}`}
            >
                <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
            </button>
        </div>
    )
}

function FeatureTabsSection() {
    const [isPlaying, setIsPlaying] = useState(true)
    const [activeFeature, setActiveFeature] = useState<string | null>(null)
    const activeFeatureData = activeFeature ? features.find(f => f.id === activeFeature) : null
    const activeIndex = activeFeature ? features.findIndex(f => f.id === activeFeature) : -1

    const handleClick = (featureId: string) => {
        setActiveFeature(featureId)
    }

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveFeature(features[activeIndex - 1].id)
        } else if (activeIndex === -1) {
            setActiveFeature(features[features.length - 1].id)
        }
    }

    const handleNext = () => {
        if (activeIndex === -1) {
            setActiveFeature(features[0].id)
        } else if (activeIndex < features.length - 1) {
            setActiveFeature(features[activeIndex + 1].id)
        }
    }

    const handleClose = () => {
        setActiveFeature(null)
    }

    return (
        <div className="bg-white rounded-[28px] shadow-sm overflow-hidden relative" style={appleFont}>
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-[#e8e8ed] hover:bg-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] hover:text-[#000] transition-colors"
            >
                <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Content Grid */}
            <div className="flex min-h-[600px] flex-col md:flex-row">

                {/* LEFT SIDE - Tabs with Scroll Indicator */}
                <div className="w-full md:w-[45%] p-6 md:p-10 md:pr-6 flex items-center order-2 md:order-1">
                    <ScrollIndicator
                        className="mr-6 flex-shrink-0"
                        onPrev={handlePrev}
                        onNext={handleNext}
                        canGoPrev={activeIndex > 0 || activeIndex === -1}
                        canGoNext={activeIndex < features.length - 1}
                    />

                    <LayoutGroup>
                        <div className="flex flex-col gap-2.5 flex-1 max-h-[400px] md:max-h-none overflow-y-auto md:overflow-visible">
                            {features.map((feature) => (
                                <FeatureTab
                                    key={feature.id}
                                    feature={feature}
                                    isActive={activeFeature === feature.id}
                                    onClick={() => handleClick(feature.id)}
                                />
                            ))}
                        </div>
                    </LayoutGroup>
                </div>

                {/* RIGHT SIDE - Visual - Fixed Size 600x600 (Responsive) */}
                <div className="flex-shrink-0 relative flex items-center justify-center md:justify-start pr-0 md:pr-[34px] py-[35px] pl-0 order-1 md:order-2 w-full md:w-auto">
                    <div
                        className="relative overflow-hidden mx-auto md:mx-0"
                        style={{
                            width: 600,
                            height: 600,
                            borderRadius: "48px"
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {activeFeature === null ? (
                                <motion.div
                                    key="default"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-full h-full"
                                >
                                    <VerticalIntegrationsBeam paused={!isPlaying} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={activeFeature}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="relative w-full h-full flex items-center justify-center overflow-hidden"
                                >
                                    {/* 1. TAB: SMART ASSISTANT */}
                                    {activeFeature === "smart-assistant" ? (
                                        <SmartPage paused={!isPlaying} />
                                    )
                                        /* 2. TAB: MULTILINGUAL */
                                        : activeFeature === "multilingual" ? (
                                            <MultilingualPage paused={!isPlaying} />
                                        )
                                            /* 3. TAB: AI ANALYSIS */
                                            : activeFeature === "ai-analysis" ? (
                                                <AIScanAnimation paused={!isPlaying} />
                                            )
                                                /* 4. TAB: DRIVE INTEGRATION */
                                                : activeFeature === "drive" ? (
                                                    <DrivePage paused={!isPlaying} />
                                                )
                                                    /* 5. TAB: BEFORE/AFTER */
                                                    : activeFeature === "before-after" ? (
                                                        <BeforeAfterPage paused={!isPlaying} />
                                                    )
                                                        /* 6. TAB: CRM INTEGRATION */
                                                        : activeFeature === "crm" ? (
                                                            <div className="transform scale-[0.9]">
                                                                <CRMMockup />
                                                            </div>
                                                        )
                                                            /* 7. TAB: PATIENT SUMMARY */
                                                            : activeFeature === "summary" ? (
                                                                <div className="transform scale-[0.85]">
                                                                    <PatientSummaryMockup />
                                                                </div>
                                                            )
                                                                /* 8. TAB: PURCHASE INTENT */
                                                                : activeFeature === "purchase-rate" ? (
                                                                    <div className="transform scale-[0.85]">
                                                                        <PurchaseIntentMockup />
                                                                    </div>
                                                                )
                                                                    /* 9. TAB: APPOINTMENT */
                                                                    : activeFeature === "appointment" ? (
                                                                        <div className="transform scale-[0.85]">
                                                                            <AppointmentMockup />
                                                                        </div>
                                                                    )
                                                                        /* DEFAULT: IMAGE FALLBACK FOR OTHERS */
                                                                        : activeFeatureData?.image && (
                                                                            <div className="relative w-[320px] h-[500px]">
                                                                                <Image
                                                                                    src={activeFeatureData.image}
                                                                                    alt={activeFeatureData.title}
                                                                                    fill
                                                                                    className="object-contain"
                                                                                />
                                                                            </div>
                                                                        )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Play/Pause Button */}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="absolute bottom-6 left-6 z-50 flex items-center justify-center w-10 h-10 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full text-black/70 transition-all border border-black/5"
                        >
                            {isPlaying ? (
                                <Pause className="w-4 h-4" fill="currentColor" />
                            ) : (
                                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
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
                        <Link href="/demo-dashboard" className="inline-flex items-center justify-center px-6 py-3 font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            Demo Dashboard
                        </Link>
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
            <section id="features" className="relative py-24 bg-gray-300/10 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="section-badge">Özellikler</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">Her şey tek panelde</h2>
                        <p className="text-lg text-black max-w-2xl mx-auto">Hasta iletişiminden randevu yönetimine, tüm süreçleriniz otomatik.</p>
                    </div>

                    <FeatureTabsSection />

                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="relative py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <span className="section-badge">Nasıl Çalışır</span>
                    </div>

                    {/* 12 Column Grid: Responsive - flex mobile, grid desktop */}
                    <div
                        className="flex flex-col md:grid md:grid-cols-12 gap-4"
                        style={{
                            gridTemplateRows: 'repeat(6, 70px)',
                        }}
                    >

                        {/* LEFT: Title & Text - Full width mobile, 7 cols desktop */}
                        <div className="min-h-[300px] md:min-h-0 md:col-span-7 md:row-span-3 rounded-3xl p-8 flex flex-col justify-start">
                            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                                Dakikalar İçinde Kurulur,<br />Saniyeler İçinde Yanıtlar
                            </h2>
                            <p className="text-lg text-black font-medium leading-relaxed">
                                Karmaşık entegrasyonlar yok. WhatsApp ve Google hattınızı bağlayın, gerisini AI halletsin.
                            </p>
                        </div>

                        {/* RIGHT TOP: Bağlantı Card - Full width mobile, 5 cols desktop */}
                        <div className="min-h-[350px] md:min-h-0 md:col-span-5 md:row-span-3 relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
                            <Image
                                src="/images/2x/cliniolabs-baglantı.webp"
                                alt="Bağlantı"
                                fill
                                className="object-cover z-0"
                            />
                            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-start">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-md font-semibold text-black mb-2">Bağlantı</h3>
                                        <p className="text-xl font-semibold text-black leading-7">
                                            Hasta WhatsApp hattınıza yazar<br />veya fotoğraf gönderir.
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/90 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg font-bold text-black">1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LEFT BOTTOM: Veri İşleme Card - Full width mobile, 7 cols desktop */}
                        <div className="min-h-[400px] md:min-h-0 md:col-span-7 md:row-span-3 relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
                            <Image
                                src="/images/2x/cliniolabs-veri-isleme.webp"
                                alt="Veri İşleme"
                                fill
                                className="object-cover z-0"
                            />
                            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-start">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-md font-semibold text-black mb-3">Veri İşleme</h3>
                                        <p className="text-xl font-semibold text-black leading-7 max-w-md">
                                            AI motorumuz görseli analiz eder, greft hesaplar, kliniğinizin fiyat politikasına göre yanıt hazırlar.
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/90 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg font-bold text-black">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT BOTTOM: Sonuç Card - Full width mobile, 5 cols desktop */}
                        <div className="min-h-[350px] md:min-h-0 md:col-span-5 md:row-span-3 relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
                            <Image
                                src="/images/2x/cliniolabs-sonuc.webp"
                                alt="Sonuç"
                                fill
                                className="object-cover z-0"
                            />
                            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-start">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-md font-semibold text-black mb-2">Sonuç</h3>
                                        <p className="text-xl font-semibold text-black leading-7">
                                            Hasta analizi panelinize gelir, tüm<br />veriler anında klinik panelinize işlenir.
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/90 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg font-bold text-black">3</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className="relative py-24 bg-gray-50/50 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="section-badge">Referanslar</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">Klinikler Ne Diyor?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="Gece 2'de gelen hastalarımızı artık kaybetmiyoruz. AI saniyeler içinde yanıt veriyor ve sabaha randevu alınmış oluyor."
                            name="Dr. Mehmet Yılmaz"
                            role="Klinik Direktörü"
                            clinic="Premium Hair Clinic"
                        />
                        <TestimonialCard
                            quote="Dönüşüm oranımız %40 arttı. Özellikle yabancı hastalarla iletişimde AI'ın çoklu dil desteği harika çalışıyor."
                            name="Ayşe Demir"
                            role="Hasta İlişkileri Müdürü"
                            clinic="Istanbul Hair Center"
                        />
                        <TestimonialCard
                            quote="Before/after eşleştirme özelliği hastalarımızı çok etkiliyor. Kendi durumlarına benzer vakaları görmek güven veriyor."
                            name="Dr. Can Özkan"
                            role="Baş Hekim"
                            clinic="Aesthetic Plus"
                        />
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="relative py-32 relative z-10 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="section-badge">Fiyatlandırma</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-4">Kliniğinize uygun planı seçin,<br /> hemen başlayın.</h2>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-3 mt-8">
                            <span className="text-sm font-medium text-gray-700">Yıllık</span>
                            <button
                                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${billingPeriod === "yearly" ? "bg-gray-900" : "bg-gray-300"}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === "yearly" ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                                <span className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide">
                                    İlk Hafta Ücretsiz
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                        {/* Basic Plan */}
                        <div className="pricing-card flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h3 className="pricing-title text-center">Başlangıç</h3>
                            <p className="pricing-description text-center mb-6">Küçük klinikler ve bireysel kullanıcılar için</p>

                            <div className="mb-6 text-center">
                                <span className="text-5xl font-bold text-gray-900 tracking-tight">{billingPeriod === "yearly" ? "3.000" : "4.000"}₺</span>
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
                                <span className="text-5xl font-bold text-gray-900 tracking-tight">{billingPeriod === "yearly" ? "4.125" : "5.500"}₺</span>
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
                                <span className="text-5xl font-bold text-gray-900 tracking-tight">{billingPeriod === "yearly" ? "7.493" : "9.990"}₺</span>
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

            {/* CTA SECTION */}
            <section className="relative py-24 bg-white overflow-hidden relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-black rounded-[32px] px-8 py-16 md:px-16 md:py-20 text-center relative overflow-hidden">
                        {/* Background Beams Effect */}
                        <BackgroundBeams />

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 mb-8">
                            <span className="text-sm font-semibold">Hemen Başlayın</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Kliniğinizi Dönüştürmeye<br />Hazır mısınız?
                        </h2>

                        {/* Description */}
                        <p className="text-md text-gray-300 font-regular mb-10 max-w-2xl mx-auto">
                            Hemen demo talep edin, dakikalar içinde sistem kurulumunu tamamlayalım. Karmaşık entegrasyonlar yok, sadece WhatsApp ve Google hesabınızı bağlayın.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <button className="inline-flex items-center justify-center gap-2 bg-white border-2 border-white text-black font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <Phone className="w-5 h-5" />
                                Bizi Arayın
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                                Ücretsiz Deneyin
                                <ArrowRight className="w-5 h-5" />
                            </button>
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
