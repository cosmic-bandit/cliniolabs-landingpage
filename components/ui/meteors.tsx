"use client"
import { cn } from "@/lib/utils"
import type React from "react"

import { useEffect, useState } from "react"

export const Meteors = ({ number = 20 }: { number?: number }) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * 800) + "px",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }))
    setMeteorStyles(styles)
  }, [number])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-white shadow-[0_0_0_1px_#ffffff20]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-white before:to-transparent",
          )}
          style={style}
        />
      ))}
    </div>
  )
}
