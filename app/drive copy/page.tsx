"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// ===== DRIVE ENTEGRASYONU DEMO =====

type AnimationStep =
    | "idle"
    | "ai-message"
    | "typing"
    | "photo-1"
    | "photo-2"
    | "photo-3"
    | "photo-4"
    | "drive-photos"
    | "complete"

const STEP_TIMINGS: Record<AnimationStep, number> = {
    "idle": 1000,
    "ai-message": 2000,
    "typing": 1200,
    "photo-1": 600,
    "photo-2": 600,
    "photo-3": 600,
    "photo-4": 600,
    "drive-photos": 2000,
    "complete": 3000,
}

const STEPS: AnimationStep[] = [
    "idle",
    "ai-message",
    "typing",
    "photo-1",
    "photo-2",
    "photo-3",
    "photo-4",
    "drive-photos",
    "complete",
]

const WP_PHOTOS = [
    "/images/drive-mockup/image copy 2.webp",
    "/images/drive-mockup/image2 copy 2.webp",
    "/images/drive-mockup/image3 copy 2.webp",
    "/images/drive-mockup/image4 copy 2.webp",
]

// ===== TYPING INDICATOR =====
const TypingIndicator = () => (
    <div className="flex gap-1 items-center px-3 py-2">
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

// ===== WHATSAPP PHONE MOCKUP =====
interface WhatsAppMockupProps {
    currentStep: AnimationStep
    stepIndex: number
}

function WhatsAppMockup({ currentStep, stepIndex }: WhatsAppMockupProps) {
    const aiMessageVisible = stepIndex >= STEPS.indexOf("ai-message")
    const typingVisible = currentStep === "typing"

    const photoSteps = ["photo-1", "photo-2", "photo-3", "photo-4"]
    const sentPhotos = photoSteps.filter((_, i) => stepIndex >= STEPS.indexOf(photoSteps[i] as AnimationStep))

    return (
        <div className="relative flex-shrink-0">
            <div className="relative w-[198px] h-[405px] drop-shadow-2xl">
                <Image
                    src="/images/whatsapp-mobileartboard-201-402x.webp"
                    alt="WhatsApp Phone"
                    fill
                    className="object-contain"
                    priority
                />

                <div className="absolute inset-x-[9px] top-[58px] bottom-[40px] flex flex-col justify-end p-2 overflow-hidden">
                    <AnimatePresence>
                        {aiMessageVisible && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="bg-emerald-500/10 border border-emerald-200/50 rounded-xl rounded-bl-sm p-2 mb-2 max-w-[95%] self-start"
                            >
                                <p className="text-[9px] text-gray-800 leading-relaxed">
                                    Durumunuzu daha iyi değerlendirebilmem için saçınızın önden, yandan ve arkadan fotoğrafını çekip gönderebilir misiniz?
                                </p>
                                <span className="text-[7px] text-gray-400 mt-1 block text-right">14:32</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {typingVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-white/90 border border-gray-200 rounded-xl rounded-br-sm self-end mb-2"
                            >
                                <TypingIndicator />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-2 gap-1 justify-end max-w-[125px] ml-auto">
                        {sentPhotos.map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-[58px] h-[58px] rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                            >
                                <Image
                                    src={WP_PHOTOS[index]}
                                    alt={`Photo ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0.5 right-0.5">
                                    <svg className="w-2.5 h-2.5 text-emerald-500" viewBox="0 0 16 11" fill="currentColor">
                                        <path d="M11.071.929l-5.657 5.657-2.829-2.829-.707.707 3.536 3.536 6.364-6.364-.707-.707z" />
                                        <path d="M14.071.929l-5.657 5.657-.707-.707 5.657-5.657.707.707z" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ===== DRIVE MOCKUP =====
interface DriveMockupProps {
    currentStep: AnimationStep
    stepIndex: number
}

function DriveMockup({ currentStep, stepIndex }: DriveMockupProps) {
    const showPhotos = stepIndex >= STEPS.indexOf("drive-photos")

    return (
        <div className="relative flex-shrink-0">
            <div className="relative w-[550px] h-[420px] rounded-xl overflow-hidden drop-shadow-2xl">
                <Image
                    src="/images/drive-mockup/drive-mockup.webp"
                    alt="Google Drive"
                    fill
                    className="object-cover object-top"
                    priority
                />

                {/* 
                    GÖRSEL KONUM AYARLARI:
                    ----------------------
                    top: Yukarıdan uzaklık (artır = aşağı, azalt = yukarı)
                    left: Soldan uzaklık (artır = sağa, azalt = sola)
                    
                    Şu an: top-[115px] left-[175px]
                */}
                <div className="absolute top-[150px] left-[150px]">
                    <AnimatePresence>
                        {showPhotos && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-wrap gap-2 max-w-[350px]"
                            >
                                {[1, 2, 3, 4].map((index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.15,
                                            ease: "easeOut"
                                        }}
                                        className="relative w-[80px] h-[100px] rounded-lg overflow-hidden bg-white shadow-lg border border-gray-100"
                                    >
                                        <Image
                                            src={`/images/drive-mockup/drive-image${index}.webp`}
                                            alt={`Drive Photo ${index}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-1.5 pt-4">
                                            <p className="text-[7px] text-white font-medium truncate">
                                                ahmet_yilmaz_{index}.jpg
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

// ===== MAIN PAGE =====
export default function DrivePage() {
    const [stepIndex, setStepIndex] = useState(0)
    const currentStep = STEPS[stepIndex] || "idle"

    useEffect(() => {
        const step = STEPS[stepIndex]
        if (!step) {
            setStepIndex(0)
            return
        }

        const timer = setTimeout(() => {
            if (stepIndex < STEPS.length - 1) {
                setStepIndex(prev => prev + 1)
            } else {
                setStepIndex(0)
            }
        }, STEP_TIMINGS[step])

        return () => clearTimeout(timer)
    }, [stepIndex])

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/demo-feature" className="text-blue-600 hover:underline text-sm">
                        ← Geri Dön
                    </a>
                    <h1 className="text-lg font-semibold text-gray-900">Drive Entegrasyonu</h1>
                    <div className="w-20" />
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="relative flex items-center gap-6">
                    <WhatsAppMockup currentStep={currentStep} stepIndex={stepIndex} />
                    <DriveMockup currentStep={currentStep} stepIndex={stepIndex} />
                </div>
            </div>

            <div className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Adım {stepIndex + 1} / {STEPS.length}</span>
                        <span className="text-xs font-medium text-gray-700 capitalize">
                            {currentStep ? currentStep.replace(/-/g, ' ') : ''}
                        </span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
