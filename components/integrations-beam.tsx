"use client"

import type React from "react"

import { useRef } from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { MessageCircle, Zap, Bot, FileSpreadsheet, HardDrive, Workflow, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

function Circle({
  className,
  children,
  ref,
}: { className?: string; children?: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white shadow-md",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function IntegrationsBeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const whatsappRef = useRef<HTMLDivElement>(null)
  const clinioRef = useRef<HTMLDivElement>(null)
  const chatgptRef = useRef<HTMLDivElement>(null)
  const sheetsRef = useRef<HTMLDivElement>(null)
  const driveRef = useRef<HTMLDivElement>(null)
  const n8nRef = useRef<HTMLDivElement>(null)
  const notionRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative flex h-[500px] w-full max-w-3xl mx-auto flex-col items-center justify-between overflow-hidden rounded-xl border bg-white p-10 shadow-lg"
    >
      {/* TOP - WhatsApp Source */}
      <div className="flex shrink-0 items-center justify-center">
        <div
          ref={whatsappRef}
          className="z-10 flex size-20 items-center justify-center rounded-full border-2 border-green-200 bg-white shadow-md"
        >
          <MessageCircle className="size-10 text-green-600" />
        </div>
      </div>

      {/* MIDDLE - Clinio Hub */}
      <div className="flex shrink-0 items-center justify-center">
        <div
          ref={clinioRef}
          className="z-10 flex size-28 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50 shadow-lg"
        >
          <Zap className="size-14 text-emerald-600" />
        </div>
      </div>

      {/* BOTTOM - Integrations (Horizontal Row) */}
      <div className="flex shrink-0 flex-row items-center justify-center gap-6">
        <div
          ref={chatgptRef}
          className="z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white shadow-md"
        >
          <Bot className="size-8 text-purple-600" />
        </div>
        <div
          ref={sheetsRef}
          className="z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white shadow-md"
        >
          <FileSpreadsheet className="size-8 text-green-600" />
        </div>
        <div
          ref={driveRef}
          className="z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white shadow-md"
        >
          <HardDrive className="size-8 text-blue-600" />
        </div>
        <div
          ref={n8nRef}
          className="z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white shadow-md"
        >
          <Workflow className="size-8 text-orange-600" />
        </div>
        <div
          ref={notionRef}
          className="z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white shadow-md"
        >
          <FileText className="size-8 text-gray-800" />
        </div>
      </div>

      {/* WhatsApp to Clinio */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={whatsappRef}
        toRef={clinioRef}
        curvature={0}
        duration={3}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />

      {/* Clinio to each integration */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clinioRef}
        toRef={chatgptRef}
        curvature={-40}
        reverse
        duration={3}
        delay={0.2}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clinioRef}
        toRef={sheetsRef}
        curvature={-20}
        reverse
        duration={3}
        delay={0.4}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clinioRef}
        toRef={driveRef}
        curvature={0}
        reverse
        duration={3}
        delay={0.6}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clinioRef}
        toRef={n8nRef}
        curvature={20}
        reverse
        duration={3}
        delay={0.8}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clinioRef}
        toRef={notionRef}
        curvature={40}
        reverse
        duration={3}
        delay={1}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
    </div>
  )
}
