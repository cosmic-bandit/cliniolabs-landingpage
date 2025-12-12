"use client"

import React, { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface AnimatedListProps {
  className?: string
  children: React.ReactNode
  delay?: number
  maxItems?: number
}

// New items appear at BOTTOM, flow UPWARD, oldest fades at TOP
export const AnimatedList = React.memo(({ className, children, delay = 3000, maxItems = 3 }: AnimatedListProps) => {
  const [counter, setCounter] = useState(0)
  const childrenArray = React.Children.toArray(children)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1)
    }, delay)

    return () => clearInterval(interval)
  }, [delay])

  // Build visible items with stable keys
  const visibleItems = useMemo(() => {
    const result = []
    // Show maxItems + 1 (extra one is fading out)
    const totalToShow = maxItems + 1
    const startCounter = Math.max(0, counter - maxItems)

    for (let c = startCounter; c <= counter; c++) {
      const messageIndex = c % childrenArray.length
      result.push({
        // Key is the counter value - each new message gets unique key
        key: c,
        content: childrenArray[messageIndex],
        // isOldest = first item in array (will fade out)
        isOldest: c === startCounter && counter >= maxItems,
      })
    }

    return result
  }, [counter, childrenArray, maxItems])

  return (
    // justify-end: items stack from bottom
    // flex-col: normal order, first item at top
    <div className={`flex flex-col justify-end gap-3 overflow-hidden ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        {visibleItems.map(({ key, content, isOldest }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{
              opacity: isOldest ? 0.3 : 1,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              opacity: { duration: 0.2 },
            }}
            layout
            className="w-full"
          >
            {content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
})

AnimatedList.displayName = "AnimatedList"
