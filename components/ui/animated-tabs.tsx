"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Tab {
    label: string
    href: string
}

interface AnimatedTabsProps {
    tabs: Tab[]
    className?: string
}

export function AnimatedTabs({ tabs, className }: AnimatedTabsProps) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

    return (
        <div
            className={cn(
                "relative flex items-center gap-1 rounded-full bg-gray-100/80 p-1 backdrop-blur-sm",
                className
            )}
        >
            {tabs.map((tab, index) => (
                <a
                    key={tab.href}
                    href={tab.href}
                    className="relative z-10 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setActiveIndex(index)}
                >
                    {hoveredIndex === index && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-white shadow-sm"
                            layoutId="hoverBackground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                </a>
            ))}
        </div>
    )
}

// Alternative: Underline sliding effect
interface UnderlineTabsProps {
    tabs: Tab[]
    className?: string
}

export function UnderlineTabs({ tabs, className }: UnderlineTabsProps) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const tabRefs = React.useRef<(HTMLAnchorElement | null)[]>([])

    return (
        <div className={cn("relative flex items-center gap-6", className)}>
            {tabs.map((tab, index) => (
                <a
                    key={tab.href}
                    ref={(el) => { tabRefs.current[index] = el }}
                    href={tab.href}
                    className="relative py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {tab.label}
                    {hoveredIndex === index && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                            layoutId="underline"
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                </a>
            ))}
        </div>
    )
}

// Pill sliding tabs - glassmorphism style
interface PillTabsProps {
    tabs: Tab[]
    className?: string
}

export function PillTabs({ tabs, className }: PillTabsProps) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

    return (
        <div
            className={cn(
                "relative flex items-center gap-1 rounded-full border border-gray-200/50 bg-white/80 p-1.5 shadow-sm backdrop-blur-md",
                className
            )}
        >
            {tabs.map((tab, index) => (
                <a
                    key={tab.href}
                    href={tab.href}
                    className="relative z-10 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors duration-200"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {hoveredIndex === index && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gray-900 shadow-lg"
                            layoutId="pillBackground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span
                        className={cn(
                            "relative z-10 transition-colors duration-200",
                            hoveredIndex === index ? "text-white" : "text-gray-600"
                        )}
                    >
                        {tab.label}
                    </span>
                </a>
            ))}
        </div>
    )
}
