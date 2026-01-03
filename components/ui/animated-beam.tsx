"use client"

import { RefObject, useEffect, useId, useState, forwardRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AnimatedBeamProps {
  className?: string
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
  vertical?: boolean
  paused?: boolean
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  vertical = false,
  paused = false,
}) => {
  const id = useId()
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })
  const controls = useAnimation()

  // ===== GRADIENT ANIMATION COORDINATES =====
  // Yatay mod: x1/x2 animate, y sabit
  // Dikey mod: y1/y2 animate, x sabit
  const gradientCoordinates = vertical
    ? reverse
      ? {
        // Dikey + Reverse: Işık aşağıdan yukarı
        x1: ["0%", "0%"],
        x2: ["0%", "0%"],
        y1: ["120%", "-20%"],
        y2: ["140%", "0%"],
      }
      : {
        // Dikey + Normal: Işık yukarıdan aşağı
        x1: ["0%", "0%"],
        x2: ["0%", "0%"],
        y1: ["-20%", "120%"],
        y2: ["0%", "140%"],
      }
    : reverse
      ? {
        // Yatay + Reverse: Işık sağdan sola
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
      : {
        // Yatay + Normal: Işık soldan sağa
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }

  useEffect(() => {
    if (paused) {
      controls.stop()
    } else {
      controls.start({
        x1: gradientCoordinates.x1,
        x2: gradientCoordinates.x2,
        y1: gradientCoordinates.y1,
        y2: gradientCoordinates.y2,
        transition: {
          delay,
          duration,
          ease: [0.16, 1, 0.3, 1],
          repeat: Infinity,
          repeatDelay: 0,
        },
      })
    }
  }, [paused, controls, gradientCoordinates, delay, duration])

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        const svgWidth = containerRect.width
        const svgHeight = containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset
        const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset
        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset
        const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset

        let d: string

        if (vertical) {
          // ===== VERTICAL MODE =====
          // Quadratic bezier: Çizgi her iki logodan düzgün (dikey) çıkar
          // Curvature sadece ortadaki eğriliği kontrol eder

          if (curvature === 0) {
            // Düz dikey çizgi
            d = `M ${startX},${startY} L ${endX},${endY}`
          } else {
            // Quadratic bezier - tek control point ortada
            const midY = startY + (endY - startY) / 2
            const cpx = (startX + endX) / 2 + curvature
            const cpy = midY

            d = `M ${startX},${startY} Q ${cpx},${cpy} ${endX},${endY}`
          }
        } else {
          // ===== HORIZONTAL BEZIER (Original) =====
          const dx = endX - startX

          const cp1x = startX + dx * 0.5
          const cp1y = startY - curvature

          const cp2x = endX - dx * 0.5
          const cp2y = endY - curvature

          d = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`
        }

        setPathD(d)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updatePath()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    updatePath()

    return () => {
      resizeObserver.disconnect()
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
    vertical,
  ])

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      {/* Background path (static gray line) */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      {/* Animated gradient path (flowing light) */}
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: vertical ? "0%" : "0%",
            x2: vertical ? "0%" : "0%",
            y1: vertical ? "0%" : "0%",
            y2: vertical ? "0%" : "0%",
          }}
          animate={controls}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
          <stop stopColor={gradientStartColor}></stop>
          <stop offset="32.5%" stopColor={gradientStopColor}></stop>
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0"></stop>
        </motion.linearGradient>
      </defs>
    </svg>
  )
}

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-16 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

Circle.displayName = "Circle"

export { Circle }
