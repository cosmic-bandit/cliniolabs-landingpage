"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// ===== 3D GLOBE COMPONENT (Client-only) =====
function Globe3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted || !canvasRef.current) return

        let phi = 0
        let globe: ReturnType<typeof import("cobe").default> | null = null

        // Dynamic import cobe only on client
        import("cobe").then((cobe) => {
            if (!canvasRef.current) return

            globe = cobe.default(canvasRef.current, {
                devicePixelRatio: 2,
                width: 240 * 2,
                height: 240 * 2,
                phi: 0,
                theta: 0.2,
                dark: 0,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 6,
                baseColor: [0.9, 0.95, 0.9],
                markerColor: [0.1, 0.8, 0.5],
                glowColor: [0.85, 0.95, 0.9],
                markers: [
                    { location: [41.0082, 28.9784], size: 0.08 },
                    { location: [52.5200, 13.4050], size: 0.06 },
                    { location: [55.7558, 37.6173], size: 0.06 },
                    { location: [24.7136, 46.6753], size: 0.06 },
                    { location: [51.5074, -0.1278], size: 0.06 },
                    { location: [40.7128, -74.0060], size: 0.05 },
                    { location: [35.6762, 139.6503], size: 0.05 },
                    { location: [-33.8688, 151.2093], size: 0.05 },
                    { location: [25.2048, 55.2708], size: 0.05 },
                ],
                onRender: (state) => {
                    state.phi = phi
                    phi += 0.005
                },
            })
        })

        return () => {
            if (globe) globe.destroy()
        }
    }, [isMounted])

    if (!isMounted) {
        return <div className="w-[240px] h-[240px] bg-gray-100 rounded-full animate-pulse" />
    }

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: 240,
                height: 240,
            }}
        />
    )
}


// ===== 50+ DİL DESTEĞİ - MULTILINGUAL DEMO =====
// v2 hero section'daki mesaj baloncukları animasyonunu referans alır

interface Scenario {
    id: number
    lang: string
    flag: string
    position: string
    q: string  // Hasta sorusu
    a: string  // AI cevabı
}

const SCENARIOS: Scenario[] = [
    {
        id: 1,
        lang: "tr",
        flag: "🇹🇷",
        position: "left-top",
        q: "Merhaba saç ekimi hakkında bilgi alabilir miyim?",
        a: "Merhaba, saç ekimi fiyatları kişiye özel belirleniyor. Size sağlıklı bir fiyat verebilmem için saç yapınızı analiz etmemiz gerekiyor."
    },
    {
        id: 2,
        lang: "de",
        flag: "🇩🇪",
        position: "right-top",
        q: "Hallo, kann ich Informationen über Haartransplantation bekommen?",
        a: "Hallo, die Preise für Haartransplantationen werden individuell festgelegt. Um Ihnen einen genauen Preis nennen zu können, müssen wir Ihre Haarstruktur analysieren."
    },
    {
        id: 3,
        lang: "ru",
        flag: "🇷🇺",
        position: "left-bottom",
        q: "Здравствуйте, могу ли я получить информацию о пересадке волос?",
        a: "Здравствуйте, цены на пересадку волос определяются индивидуально. Чтобы назвать вам точную цену, нам нужно проанализировать структуру ваших волос."
    },
    {
        id: 4,
        lang: "ar",
        flag: "🇸🇦",
        position: "right-bottom",
        q: "مرحباً، هل يمكنني الحصول على معلومات حول زراعة الشعر؟",
        a: "مرحباً، أسعار زراعة الشعر تُحدد بشكل فردي. لكي أعطيك سعراً دقيقاً، نحتاج إلى تحليل بنية شعرك."
    },
    {
        id: 5,
        lang: "en",
        flag: "🇬🇧",
        position: "right-top",
        q: "Hello, can I get information about hair transplant?",
        a: "Hello, hair transplant prices are determined individually. To give you an accurate price, we need to analyze your hair structure."
    },
]

// Pozisyonlar - Responsive (Edges)
const POSITIONS: Record<string, string> = {
    "left-top": "top-12 left-2",
    "right-top": "top-28 right-2",
    "left-bottom": "bottom-24 left-2",
    "right-bottom": "bottom-24 right-2",
    "center-bottom": "bottom-24 left-1/2 -translate-x-1/2",
}

// Typing Indicator Component
const TypingIndicator = () => (
    <div className="flex gap-1 items-center justify-center min-h-[22px]">
        <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
    </div>
)

// Single Conversation Component
function SingleConversation({
    scenario,
    isActive,
    enterDelay = 0,
    paused = false
}: {
    scenario: Scenario
    isActive: boolean
    enterDelay?: number
    paused?: boolean
}) {
    const [step, setStep] = useState(0)
    const pausedRef = useRef(paused)

    // Update ref to access latest paused state in timeouts without re-triggering effects
    useEffect(() => {
        pausedRef.current = paused
    }, [paused])

    // 0: Hidden
    // 1: Show Msg 1 (User question)
    // 2: Msg 1 visible + Typing indicator
    // 3: Show Msg 2 (AI answer)
    // 4: Exit animation

    useEffect(() => {
        let timer: NodeJS.Timeout

        if (isActive) {
            // ENTER SEQUENCE
            if (step === 0 || step === 4) {
                const startSequence = () => {
                    if (pausedRef.current) return // Don't start if paused

                    setStep(1) // Show user question

                    // Show Typing after 1.5s
                    timer = setTimeout(() => {
                        if (pausedRef.current) return
                        setStep(2)

                        // Show AI answer after 1s typing
                        timer = setTimeout(() => {
                            if (pausedRef.current) return
                            setStep(3)
                        }, 1000)
                    }, 1500)
                }

                if (enterDelay > 0) {
                    timer = setTimeout(startSequence, enterDelay)
                } else {
                    startSequence()
                }
            }
        } else {
            // EXIT SEQUENCE
            if (step > 0 && step < 4) {
                // If paused, don't exit yet? Or force exit?
                // Let's allow exit even if paused to clean up, or maybe hold?
                // For now, let's respect rotation cycle.

                setStep(4) // Exit animation

                // Reset to hidden after animation completes
                timer = setTimeout(() => {
                    setStep(0)
                }, 500)
            }
        }

        return () => clearTimeout(timer)
    }, [isActive]) // Only react to Active/Inactive toggle

    // Pause effect on active step? 
    // Implementing full pause mid-animation is complex with timeouts.
    // simpler approach: stop the cycle in parent, so `isActive` doesn't change.

    const posClass = POSITIONS[scenario.position]
    const isRTL = scenario.lang === "ar"

    // Responsive widths
    const userStyle = "bg-white/90 border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm px-3 py-2 shadow-lg backdrop-blur-xl border text-xs sm:text-sm w-[220px] self-start origin-bottom-left relative"
    const aiStyle = "bg-emerald-500/10 border-emerald-200/50 text-gray-800 rounded-2xl rounded-br-sm px-3 py-2 shadow-lg backdrop-blur-xl border text-xs sm:text-sm w-[220px] self-end origin-bottom-right"

    if (step === 0 && !isActive) return null

    return (
        <div
            className={`absolute ${posClass} z-20 flex flex-col w-[220px] pointer-events-none h-[180px] justify-end gap-2`}
            style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
            {/* First Message */}
            <motion.div
                className={`${userStyle} ${isRTL ? 'text-right' : 'text-left'}`}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{
                    opacity: step >= 1 && step < 4 ? 1 : 0,
                    y: step >= 1 && step < 4 ? 0 : 10,
                    scale: step >= 1 && step < 4 ? 1 : 0.9
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Flag Badge */}
                <div
                    className={`absolute -top-4 ${isRTL ? 'right-2' : 'left-2'} bg-white rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-md border border-gray-100 flex items-center gap-1`}
                >
                    <span className="text-sm">{scenario.flag}</span>
                    <span className="text-gray-600">{scenario.lang.toUpperCase()}</span>
                </div>

                {/* Message Text */}
                <span className="block mt-1">{scenario.q}</span>
            </motion.div>

            {/* Second Message */}
            <motion.div
                className={`${aiStyle} ${isRTL ? 'text-right' : 'text-left'}`}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{
                    opacity: step >= 2 && step < 4 ? 1 : 0,
                    y: step >= 2 && step < 4 ? 0 : 10,
                    scale: step >= 2 && step < 4 ? 1 : 0.9
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {step === 2 && <TypingIndicator />}
                {step >= 3 && scenario.a}
            </motion.div>
        </div>
    )
}

// Orchestrator Component
function MultilingualConversations({ paused = false }: { paused?: boolean }) {
    const [cycleIndex, setCycleIndex] = useState(0)

    useEffect(() => {
        if (paused) return

        const GAP = 5000 // 5 seconds between each new bubble

        const interval = setInterval(() => {
            setCycleIndex(prev => prev + 1)
        }, GAP)

        return () => clearInterval(interval)
    }, [paused])

    return (
        <>
            {SCENARIOS.map((scenario, index) => {
                // v2 circle logic
                const cycleLen = SCENARIOS.length + 1 // 6 cycles (5 scenarios + 1 buffer)
                const currentScenarioIndex = cycleIndex % cycleLen
                const previousScenarioIndex = (cycleIndex - 1 + cycleLen) % cycleLen

                const isActive = (index === currentScenarioIndex) || (index === previousScenarioIndex && cycleIndex > 0)

                return (
                    <SingleConversation
                        key={scenario.id}
                        scenario={scenario}
                        isActive={isActive}
                        enterDelay={index === 0 && cycleIndex === 0 ? 500 : 0}
                        paused={paused}
                    />
                )
            })}
        </>
    )
}

// ===== MAIN PAGE =====

export default function MultilingualPage({ paused = false }: { paused?: boolean }) {
    return (
        <div className="w-full h-full relative bg-white overflow-hidden bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            {/* Header - Absolute Top */}
            <div className="absolute top-4 left-0 right-0 text-center z-30 pointer-events-none">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">50+ Dil Desteği</h1>
                <p className="text-[#86868b] text-xs sm:text-sm max-w-xs mx-auto px-4">Hasta hangi dilde yazarsa yazsın, AI aynı dilde yanıt verir.</p>
            </div>

            {/* Center 3D Globe - Smaller Size */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="relative" style={{ width: 200, height: 200 }}>
                    {/* Globe */}
                    <div
                        className="absolute"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {/* Scale down the 240px canvas using transform - Reduced from 0.8 to 0.7 */}
                        <div style={{ transform: 'scale(0.7)' }}>
                            <Globe3D />
                        </div>
                    </div>
                    {/* Label */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="text-xs font-semibold text-emerald-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">50+ Dil</span>
                    </div>
                </div>
            </div>

            {/* Floating Conversations Container */}
            <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="relative w-full h-full max-w-2xl">
                    <MultilingualConversations paused={paused} />
                </div>
            </div>

            {/* Language Pills - Lower bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 w-max max-w-full px-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {SCENARIOS.map((s) => (
                        <div
                            key={s.id}
                            className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium border border-gray-200 shadow-sm flex items-center gap-1 flex-shrink-0"
                        >
                            <span className="text-base">{s.flag}</span>
                            <span className="text-gray-700">{s.lang.toUpperCase()}</span>
                        </div>
                    ))}
                </div>

                {/* Plus Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm flex items-center justify-center text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
