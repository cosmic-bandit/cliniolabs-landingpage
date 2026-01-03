"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react"
import { AnimatedBeam } from "@/components/ui/animated-beam"

// ===== APPLE iPHONE STYLE FEATURE SECTION =====
// 🍎 Pure CSS Transitions - No Framer Motion layout animations

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
        description: "Saç analizi tamamlanınca sistem, hastanın Norwood seviyesi ve saç tipine en yakın önceki vakaları Google Drive arşivinden otomatik bulur.",
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
        description: "WhatsApp ve foto analiz verilerini Google Sheets'te tek satırda toplar: İsim, yaş, Norwood seviyesi, greft aralığı ve teknik öneri bilgilerini içerir.",
        image: "/images/2x/cliniolabs-oto-arsiv.webp"
    },
    {
        id: "purchase-rate",
        iconType: "plus",
        title: "Satın Alma Niyet Skoru",
        description: "Sohbetlerden otomatik satın alma niyet skoru çıkarır: kim sıcak, kim kararsız, kim uzaklaşıyor netleşir.",
        image: "/images/2x/cliniolabs-oto-arsiv.webp"
    },
    {
        id: "appointment",
        iconType: "plus",
        title: "Otomatik Randevu",
        description: "Hasta ikna olduğunda otomatik randevu oluşturur. Google Calendar entegrasyonu ile anında senkronize.",
        image: "/images/2x/cliniolabs-sonuc.webp"
    },
]

// ===== VERTICAL INTEGRATIONS BEAM =====

const VerticalIntegrationsBeam = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const topRef = useRef<HTMLDivElement>(null)
    const centerRef = useRef<HTMLDivElement>(null)
    const bottom1Ref = useRef<HTMLDivElement>(null)
    const bottom2Ref = useRef<HTMLDivElement>(null)
    const bottom3Ref = useRef<HTMLDivElement>(null)
    const bottom4Ref = useRef<HTMLDivElement>(null)

    const [tick, setTick] = useState(0)
    useEffect(() => {
        const timer = setTimeout(() => setTick(1), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        >
            <AnimatedBeam containerRef={containerRef} fromRef={topRef} toRef={centerRef} curvature={0} vertical={true} gradientStartColor="#25D366" gradientStopColor="#128C7E" pathWidth={2} pathOpacity={0.12} startXOffset={tick ? 0.001 : 0} duration={4} />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={bottom1Ref} curvature={-80} vertical={true} reverse={true} gradientStartColor="#10b981" gradientStopColor="#34d399" pathWidth={2} pathOpacity={0.12} startXOffset={tick ? 0.001 : 0} duration={5} />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={bottom2Ref} curvature={-30} vertical={true} reverse={true} gradientStartColor="#10b981" gradientStopColor="#34d399" pathWidth={2} pathOpacity={0.12} startXOffset={tick ? 0.001 : 0} duration={4.5} />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={bottom3Ref} curvature={30} vertical={true} reverse={true} gradientStartColor="#10b981" gradientStopColor="#34d399" pathWidth={2} pathOpacity={0.12} startXOffset={tick ? 0.001 : 0} duration={5.5} />
            <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={bottom4Ref} curvature={80} vertical={true} reverse={true} gradientStartColor="#10b981" gradientStopColor="#34d399" pathWidth={2} pathOpacity={0.12} startXOffset={tick ? 0.001 : 0} duration={4.8} />

            <div ref={topRef} className="absolute left-1/2 -translate-x-1/2 top-8 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10">
                <Image src="/logos/whatsapp-8.svg" alt="WhatsApp" width={28} height={28} />
            </div>
            <div ref={centerRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-24 w-24 items-center justify-center rounded-full border border-gray-200 bg-white shadow-2xl z-20">
                <Image src="/logos/cliniolabs-logo-vertical.svg" alt="Cliniolabs Logo" width={56} height={56} className="object-contain" />
            </div>
            <div ref={bottom1Ref} className="absolute bottom-8 left-[calc(50%-180px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10">
                <Image src="/logos/chatgpt-6.svg" alt="ChatGPT" width={28} height={28} />
            </div>
            <div ref={bottom2Ref} className="absolute bottom-8 left-[calc(50%-60px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10">
                <Image src="/logos/new-logo-drive-google.svg" alt="Google Drive" width={28} height={28} />
            </div>
            <div ref={bottom3Ref} className="absolute bottom-8 left-[calc(50%+60px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10">
                <Image src="/logos/google-sheets-logo-icon.svg" alt="Google Sheets" width={24} height={24} />
            </div>
            <div ref={bottom4Ref} className="absolute bottom-8 left-[calc(50%+180px)] -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10">
                <Image src="/logos/google-calendar-icon-2020-.svg" alt="Google Calendar" width={26} height={28} />
            </div>
        </div>
    )
}

// ===== 🍎 APPLE STYLE FEATURE TAB - PURE CSS =====

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
        <div
            onClick={onClick}
            className={`
                cursor-pointer select-none rounded-[18px] 
                transition-all duration-600 ease-out
                ${isActive
                    ? 'bg-[#f5f5f7] p-5'
                    : 'bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] py-3 px-5'
                }
            `}
            style={{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Collapsed State - Title Only */}
            <div
                className={`
                    flex items-center gap-3 overflow-hidden
                    transition-all duration-600
                    ${isActive ? 'max-h-0 opacity-0' : 'max-h-[50px] opacity-100'}
                `}
                style={{
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {feature.iconType === "color" ? (
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.colorGradient} flex-shrink-0`} />
                ) : (
                    <div className="w-5 h-5 rounded-full border-[2px] border-[#1d1d1f] flex items-center justify-center flex-shrink-0">
                        <Plus className="w-3 h-3 text-[#1d1d1f]" strokeWidth={3} />
                    </div>
                )}
                <span className="text-[17px] font-medium text-[#1d1d1f] whitespace-nowrap tracking-[-0.374px]">
                    {feature.title}
                </span>
            </div>

            {/* Expanded State - Title + Description */}
            <div
                className={`
                    overflow-hidden
                    transition-all duration-600
                    ${isActive ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}
                `}
                style={{
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <p className="text-[17px] leading-[25px] tracking-[-0.374px]">
                    <span className="font-semibold text-[#1d1d1f]">
                        {feature.title}.
                    </span>{" "}
                    <span className="text-[#86868b]">
                        {feature.description}
                    </span>
                </p>
            </div>
        </div>
    )
}

// ===== SCROLL INDICATOR =====

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
                className={`
                    w-9 h-9 rounded-full border border-[#d2d2d7] bg-white 
                    flex items-center justify-center 
                    transition-all duration-200 
                    active:scale-95
                    ${canGoPrev
                        ? 'text-[#1d1d1f] hover:border-[#86868b] hover:scale-105 cursor-pointer'
                        : 'text-[#d2d2d7] cursor-not-allowed'
                    }
                `}
            >
                <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`
                    w-9 h-9 rounded-full border border-[#d2d2d7] bg-white 
                    flex items-center justify-center 
                    transition-all duration-200 
                    active:scale-95
                    ${canGoNext
                        ? 'text-[#1d1d1f] hover:border-[#86868b] hover:scale-105 cursor-pointer'
                        : 'text-[#d2d2d7] cursor-not-allowed'
                    }
                `}
            >
                <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
            </button>
        </div>
    )
}

// ===== 🍎 IMAGE PANEL - ALL IMAGES PRELOADED =====

function ImagePanel({ activeFeature }: { activeFeature: string | null }) {
    return (
        <div className="relative w-full h-full">
            {/* Default Beam - Always in DOM */}
            <div
                className={`
                    absolute inset-0 flex items-center justify-center
                    transition-all duration-600
                    ${activeFeature === null
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }
                `}
                style={{
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div className="w-full h-[450px]">
                    <VerticalIntegrationsBeam />
                </div>
            </div>

            {/* All Feature Images - Always in DOM, Toggle Opacity */}
            {features.map((feature) => (
                <div
                    key={feature.id}
                    className={`
                        absolute inset-0 flex items-center justify-center
                        transition-all duration-600
                        ${activeFeature === feature.id
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-95 pointer-events-none'
                        }
                    `}
                    style={{
                        transitionTimingFunction: 'cubic-bezier(0, 0, 0.25, 1)',
                    }}
                >
                    <div className="relative w-[320px] h-[500px]">
                        <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

// ===== MAIN COMPONENT =====

export default function AppleFeatureSection() {
    const [activeFeature, setActiveFeature] = useState<string | null>(null)
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
        <div className="min-h-screen bg-[#f5f5f7]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <a
                        href="/v2"
                        className="text-[#06c] hover:underline transition-colors text-sm"
                    >
                        ← V2 Sayfasına Dön
                    </a>
                </div>
            </div>

            {/* Main Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-[#1d1d1f] mb-3 text-5xl font-semibold tracking-tight">
                            Özellikler
                        </h2>
                        <p className="text-[#86868b] text-xl">
                            Tüm ihtiyaçlarınız tek platformda.
                        </p>
                    </div>

                    {/* Apple-Style Container */}
                    <div className="bg-white rounded-[28px] shadow-sm overflow-hidden relative">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="
                                absolute top-5 right-5 z-20 w-8 h-8 rounded-full 
                                bg-[#e8e8ed] hover:bg-[#d2d2d7] 
                                flex items-center justify-center 
                                text-[#1d1d1f] hover:text-[#000] 
                                transition-all duration-200
                                hover:scale-110 active:scale-95
                            "
                        >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>

                        {/* Content Grid */}
                        <div className="flex min-h-[600px]">

                            {/* LEFT SIDE - Tabs */}
                            <div className="w-[45%] p-10 pr-6 flex items-center">
                                <ScrollIndicator
                                    className="mr-6 flex-shrink-0"
                                    onPrev={handlePrev}
                                    onNext={handleNext}
                                    canGoPrev={activeIndex > 0 || activeIndex === -1}
                                    canGoNext={activeIndex < features.length - 1}
                                />

                                <div className="flex flex-col gap-2.5 flex-1">
                                    {features.map((feature) => (
                                        <FeatureTab
                                            key={feature.id}
                                            feature={feature}
                                            isActive={activeFeature === feature.id}
                                            onClick={() => handleClick(feature.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT SIDE - Visual */}
                            <div className="w-[55%] relative flex items-center justify-center p-10">
                                <ImagePanel activeFeature={activeFeature} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
