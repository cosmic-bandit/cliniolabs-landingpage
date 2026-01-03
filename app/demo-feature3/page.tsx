"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react"
import { AnimatedBeam } from "@/components/ui/animated-beam"

// ===== APPLE iPHONE STYLE FEATURE SECTION =====

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
// Absolute positioning ile tam ortalama

const VerticalIntegrationsBeam = () => {
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
            />

            {/* Center to Bottom - Simetrik fan-out: [-60, -20, +20, +60] */}
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
            />

            {/* ===== NODES - Absolute Positioning ===== */}

            {/* TOP - WhatsApp */}
            <div
                ref={topRef}
                className="absolute left-1/2 -translate-x-1/2 top-8 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md z-10"
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

            {/* BOTTOM - 4 icons (her biri ayrı absolute) */}
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

// ===== APPLE STYLE FEATURE TAB =====

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

// ===== MAIN COMPONENT =====

export default function AppleFeatureSection() {
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
        <div className="min-h-screen bg-[#f5f5f7]" style={appleFont}>
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <a
                        href="/v2"
                        className="text-[#06c] hover:underline transition-colors"
                        style={{ ...appleFont, fontSize: '14px' }}
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
                        <h2
                            className="text-[#1d1d1f] mb-3"
                            style={{
                                ...appleFont,
                                fontSize: '48px',
                                fontWeight: 600,
                                letterSpacing: '-0.003em',
                                lineHeight: '1.1',
                            }}
                        >
                            Özellikler
                        </h2>
                        <p
                            className="text-[#86868b]"
                            style={{
                                ...appleFont,
                                fontSize: '21px',
                                fontWeight: 400,
                                letterSpacing: '0.011em',
                                lineHeight: '1.381',
                            }}
                        >
                            Tüm ihtiyaçlarınız tek platformda.
                        </p>
                    </div>

                    {/* Apple-Style Container */}
                    <div className="bg-white rounded-[28px] shadow-sm overflow-hidden relative">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-[#e8e8ed] hover:bg-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] hover:text-[#000] transition-colors"
                        >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>

                        {/* Content Grid */}
                        <div className="flex min-h-[600px]">

                            {/* LEFT SIDE - Tabs with Scroll Indicator */}
                            <div className="w-[45%] p-10 pr-6 flex items-center">
                                <ScrollIndicator
                                    className="mr-6 flex-shrink-0"
                                    onPrev={handlePrev}
                                    onNext={handleNext}
                                    canGoPrev={activeIndex > 0 || activeIndex === -1}
                                    canGoNext={activeIndex < features.length - 1}
                                />

                                <LayoutGroup>
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
                                </LayoutGroup>
                            </div>

                            {/* RIGHT SIDE - Visual */}
                            <div className="w-[55%] relative flex items-center justify-center p-10">
                                <AnimatePresence mode="wait">
                                    {activeFeature === null ? (
                                        <motion.div
                                            key="default"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="w-full h-[450px]"
                                        >
                                            <VerticalIntegrationsBeam />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={activeFeature}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="relative w-full h-full flex items-center justify-center"
                                        >
                                            {activeFeatureData?.image && (
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
