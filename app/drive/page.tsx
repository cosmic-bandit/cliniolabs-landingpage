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
    | "photo-3"
    | "photo-4"
    | "create-folder" // NEW: Folder appears
    | "hover-folder"  // NEW: Cursor moves in
    | "click-folder"  // NEW: Click animation
    | "enter-folder"  // NEW: Transition to inside view
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
    "create-folder": 1000,
    "hover-folder": 1200,
    "click-folder": 500,
    "enter-folder": 1000,
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
    "create-folder",
    "hover-folder",
    "click-folder",
    "enter-folder",
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

                {/* Header User Info Overlay */}
                <div className="absolute top-[20px] left-[35px] flex items-center gap-2 z-10">
                    <div className="relative w-[21px] h-[21px] rounded-full overflow-hidden">
                        <Image
                            src="/images/drive-mockup/image copy 2.webp"
                            alt="Ahmet Yılmaz"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-[10px] font-semibold text-black tracking-tight translate-y-[0.5px]">Ahmet Yılmaz</span>
                </div>

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
interface DriveMockupProps {
    currentStep: AnimationStep
    stepIndex: number
}

function DriveMockup({ currentStep, stepIndex }: DriveMockupProps) {
    // Phases
    const showFolder = stepIndex >= STEPS.indexOf("create-folder") && stepIndex < STEPS.indexOf("enter-folder")
    const isHovering = currentStep === "hover-folder"
    const isClicked = currentStep === "click-folder"
    const isInsideFolder = stepIndex >= STEPS.indexOf("enter-folder")
    const showPhotos = stepIndex >= STEPS.indexOf("drive-photos")

    return (
        <div className="relative flex-shrink-0">
            <div className="relative w-[550px] h-[420px] rounded-xl overflow-hidden drop-shadow-2xl bg-white border border-gray-100">
                {/* 1. Base Background (Always visible, serves as the frame) */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/drive-mockup/drive-mockup.webp"
                        alt="Google Drive UI"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </div>

                {/* 2. Content Area Overlay for 'Inside Folder' View */}
                {/* When inside folder, we cover the main list area with white to show photos */}
                <AnimatePresence>
                    {isInsideFolder && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-[150px] left-[150px] right-0 bottom-0 bg-white z-0"
                        />
                    )}
                </AnimatePresence>

                {/* 3. Folder Icon (Appears on Root View) */}
                <AnimatePresence>
                    {showFolder && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{
                                opacity: 1,
                                scale: 1, // Reset scale for click, we use overlay now
                                y: 0
                            }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            // Position adjusted to be in the main list area, not over sidebar
                            className="absolute top-[150px] left-[150px] flex flex-col items-center cursor-pointer group z-10"
                        >
                            <div className="relative w-[180px] h-[36px] bg-white border border-gray-200 rounded-md flex items-center px-3 gap-3 shadow-sm hover:shadow-md transition-shadow">
                                {/* Clean Folder Construction instead of Image with Cursor */}
                                <div className="relative w-4 h-4 flex-shrink-0">
                                    <Image
                                        src="/images/drive-mockup/folder.svg"
                                        alt="folder"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-[11px] text-gray-700 font-medium truncate">Ahmet Yılmaz</span>
                                <div className="ml-auto relative w-3 h-3 opacity-50">
                                    <Image
                                        src="/images/drive-mockup/dots.svg"
                                        alt="menu"
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Cursor Animation Restored */}
                                {isHovering && (
                                    <motion.div
                                        className="absolute -bottom-4 -right-4 w-6 h-6 pointer-events-none z-50"
                                        initial={{ opacity: 0, x: 20, y: 20 }}
                                        animate={{ opacity: 1, x: 0, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="black" stroke="white" />
                                        </svg>
                                    </motion.div>
                                )}

                                {/* Click Flash */}
                                {isClicked && (
                                    <motion.div
                                        className="absolute inset-0 bg-blue-500/10 rounded-md"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </div>

                            {/* Mask to hide static cursor on background image */}
                            <div className="absolute top-0 -right-[30px] w-[30px] h-[36px] bg-white z-0" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 4. Inside Folder Content: Photos */}
                <div className="absolute top-[150px] left-[150px] z-10">
                    <AnimatePresence>
                        {showPhotos && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-wrap gap-4 max-w-[360px]"
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
                                        className="relative w-[80px] h-[80px] rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 group hover:shadow-md transition-shadow"
                                    >
                                        <Image
                                            src={`/images/drive-mockup/drive-image${index}.webp`}
                                            alt={`Drive Photo ${index}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[7px] text-white truncate">
                                                img_{index}.jpg
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

// ===== MAIN PAGE COMPONENT (Embeddable) =====
export default function DrivePage({ paused = false }: { paused?: boolean }) {
    const [stepIndex, setStepIndex] = useState(0)
    const currentStep = STEPS[stepIndex] || "idle"

    useEffect(() => {
        if (paused) return; // Stop timer if paused

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
    }, [stepIndex, paused])

    return (
        <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            {/* 
               Content Wrapper
               Total width ~770px (198 phone + 24 gap + 550 drive).
               Container is 600px. 
               Scale ~0.7 to fit comfortably with padding.
            */}
            <div className="transform scale-[0.7] flex items-center gap-6 origin-center">
                <WhatsAppMockup currentStep={currentStep} stepIndex={stepIndex} />
                <DriveMockup currentStep={currentStep} stepIndex={stepIndex} />
            </div>
        </div>
    )
}
