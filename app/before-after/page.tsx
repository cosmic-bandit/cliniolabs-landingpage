"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// ===== BEFORE/AFTER DEMO =====

type AnimationStep =
    | "idle"
    | "ai-analysis" // Initial state with analysis text
    | "typing"
    | "ai-message" // "4000 greft..." message
    | "hover-folder" // Cursor moves to folder
    | "click-folder" // Click effect
    | "open-folder" // Folders fade out, image fades in
    | "wa-receive" // Image appearing in WA
    | "complete"

const STEP_TIMINGS: Record<AnimationStep, number> = {
    "idle": 1000,
    "ai-analysis": 1500,
    "typing": 1000,
    "ai-message": 2000,
    "hover-folder": 1500,
    "click-folder": 500,
    "open-folder": 1500,
    "wa-receive": 1500,
    "complete": 4000,
}

const STEPS: AnimationStep[] = [
    "idle",
    "ai-analysis",
    "typing",
    "ai-message",
    "hover-folder",
    "click-folder",
    "open-folder",
    "wa-receive",
    "complete",
]

const FOLDERS = [
    "hibrit_n6", "hibrit_n5", "hibrit_n4",
    "hibrit_n3", "fue_n7", "fue_n6",
    "fue_n5", "fue_n4", "fue_n3",
    "fue_n2", "fue_n1", "dhi_n7",
    "dhi_n6", "dhi_n5", "dhi_n4",
    "dhi_n3", "dhi_n2", "dhi_n1",
]

// Target folder to click
const TARGET_FOLDER = "fue_n5"

// ===== WHATSAPP MOCKUP =====
interface WhatsAppMockupProps {
    currentStep: AnimationStep
    stepIndex: number
}

function WhatsAppMockup({ currentStep, stepIndex }: WhatsAppMockupProps) {
    const showAiMessage = stepIndex >= STEPS.indexOf("ai-message")
    const isTyping = currentStep === "typing"
    const showPhoto = stepIndex >= STEPS.indexOf("wa-receive")

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

                <div className="absolute inset-x-[9px] top-[58px] bottom-[40px] flex flex-col justify-end p-2 overflow-hidden gap-2">
                    {/* Initial Analysis Text (Always visible or appearing early) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/10 border border-emerald-200/50 rounded-xl rounded-bl-sm p-2 max-w-[95%] self-start"
                    >
                        <p className="text-[9px] text-gray-800 leading-relaxed font-medium">
                            Analiz Sonucu:
                        </p>
                        <p className="text-[8px] text-gray-600 leading-relaxed">
                            • Norwood Ölçeği: 5<br />
                            • Tahmini Greft: 3800-4000<br />
                            • Önerilen Teknik: FUE
                        </p>
                        <span className="text-[7px] text-gray-400 mt-1 block text-right">14:30</span>
                    </motion.div>

                    {/* Typing Indicator OR AI Explanation Message */}
                    <AnimatePresence mode="popLayout">
                        {isTyping ? (
                            <motion.div
                                key="typing"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-white/90 border border-gray-200 rounded-xl rounded-br-sm self-end"
                            >
                                <div className="flex gap-1 items-center px-3 py-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : showAiMessage && (
                            <motion.div
                                key="message"
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="bg-emerald-500/10 border border-emerald-200/50 rounded-xl rounded-bl-sm p-2 max-w-[95%] self-start"
                            >
                                <p className="text-[9px] text-gray-800 leading-relaxed">
                                    4000 greft civarı bir ekimin nasıl bir değişim yaratacağını net görebilmeniz için, benzer bir vaka örneğimizi paylaşıyorum.
                                </p>
                                <span className="text-[7px] text-gray-400 mt-1 block text-right">14:32</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Shared Image */}
                    <AnimatePresence>
                        {showPhoto && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="self-end"
                            >
                                <div className="relative w-[130px] h-[80px] rounded-lg overflow-hidden border border-emerald-200 shadow-sm bg-emerald-50">
                                    <Image
                                        src="/images/drive-mockup/fue_n5.webp"
                                        alt="Result"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-[7px] text-gray-400 mt-0.5 block text-right">14:32</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
    const isHovering = currentStep === "hover-folder"
    const isClicking = currentStep === "click-folder"
    const isOpen = stepIndex >= STEPS.indexOf("open-folder")

    return (
        <div className="relative flex-shrink-0">
            <div className="relative w-[550px] h-[420px] rounded-xl overflow-hidden drop-shadow-2xl bg-white border border-gray-100">
                {/* 1. Base Mockup Background */}
                <Image
                    src="/images/drive-mockup/drive-mockup.webp"
                    alt="Drive UI"
                    fill
                    className="object-cover object-top"
                    priority
                />

                {/* 2. Dynamic Folders Grid Overlay */}
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(2px)" }}
                            transition={{ duration: 0.5 }}
                            // Adjusting position to match the 'content area' of the drive mockup
                            // Based on visual estimation of drive-mockup.webp
                            className="absolute top-[135px] left-[135px] right-[20px] bottom-0 overflow-hidden"
                        >
                            <div className="grid grid-cols-3 gap-x-4 gap-y-3 p-4 content-start">
                                {FOLDERS.map((folderName, index) => {
                                    const isTarget = folderName === TARGET_FOLDER

                                    return (
                                        <div
                                            key={folderName}
                                            // The user specified 142x28px size for the folder item background
                                            className="relative flex items-center justify-between px-3 py-1.5 rounded bg-[rgb(240,245,250)] border border-transparent hover:border-blue-200 transition-colors cursor-pointer group"
                                            style={{ height: "28px", width: "100%" }} // Responsive width within grid, fixed height
                                        >
                                            {/* Folder Icon + Name */}
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className="relative w-3.5 h-3.5 flex-shrink-0 opacity-70">
                                                    <Image
                                                        src="/images/drive-mockup/folder.svg"
                                                        alt="folder"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span className="text-[10px] text-gray-700 font-medium truncate">
                                                    {folderName}
                                                </span>
                                            </div>

                                            {/* Dots Icon */}
                                            <div className="relative w-3 h-3 opacity-50">
                                                <Image
                                                    src="/images/drive-mockup/dots.svg"
                                                    alt="menu"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>

                                            {/* Cursor Animation for Target Folder */}
                                            {isTarget && isHovering && (
                                                <motion.div
                                                    className="absolute -bottom-4 -right-4 w-6 h-6 pointer-events-none z-50"
                                                    initial={{ opacity: 0, x: 20, y: 20 }}
                                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    {/* Simple cursor SVG */}
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="black" stroke="white" />
                                                    </svg>
                                                </motion.div>
                                            )}

                                            {/* Click Flash for Target Folder */}
                                            {isTarget && isClicking && (
                                                <motion.div
                                                    className="absolute inset-0 bg-blue-500/20 rounded z-10"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. Open Folder / Result Image View */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="absolute top-[120px] left-[150px] bottom-0 z-10 flex flex-col items-center pt-8"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="relative w-[120px] h-[80px] rounded-lg overflow-hidden shadow-lg border border-gray-100"
                            >
                                <Image
                                    src="/images/drive-mockup/fue_n5.webp"
                                    alt="Result Large"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="mt-4 text-xs text-gray-500 font-medium"
                            >
                                fue_n5.jpg
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

// ===== EXPORT =====
export default function BeforeAfterPage({ paused = false }: { paused?: boolean }) {
    const [stepIndex, setStepIndex] = useState(0)
    const currentStep = STEPS[stepIndex] || "idle"

    useEffect(() => {
        if (paused) return

        const step = STEPS[stepIndex]
        if (!step) {
            // Loop logic: wait a bit then restart
            const timer = setTimeout(() => setStepIndex(0), 3000)
            return () => clearTimeout(timer)
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
            <div className="transform scale-[0.7] flex items-center gap-6 origin-center">
                <WhatsAppMockup currentStep={currentStep} stepIndex={stepIndex} />
                <DriveMockup currentStep={currentStep} stepIndex={stepIndex} />
            </div>
        </div>
    )
}
