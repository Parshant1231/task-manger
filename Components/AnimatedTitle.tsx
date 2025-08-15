"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTitleProps {
  phrases: string[]
  interval?: number
}

export function AnimatedTitle({ phrases, interval = 5000 }: AnimatedTitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState(phrases[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 🎨 Define gradient/color classes for each phrase
  const colorClasses = [
    "bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent",
    "bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent",
    "bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent",
    "bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent",
    "bg-gradient-to-r from-red-300 to-orange-400 bg-clip-text text-transparent",
    "bg-gradient-to-r from-indigo-300 to-purple-500 bg-clip-text text-transparent",
    "bg-gradient-to-r from-teal-300 to-cyan-500 bg-clip-text text-transparent ",
  ]

  // Auto change index
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % phrases.length)
    }, interval)
    intervalRef.current = id
    return () => clearInterval(id)
  }, [phrases.length, interval])

  // Animate transition
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayText(phrases[currentIndex])
      setIsAnimating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentIndex, phrases])

  return (
    <span
      onMouseEnter={() => clearInterval(intervalRef.current!)}
      onMouseLeave={() => {
        intervalRef.current = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % phrases.length)
        }, interval)
      }}
      className={cn(
        "inline-block transition-all duration-500 ease-out cursor-pointer drop-shadow-lg",
        colorClasses[currentIndex % colorClasses.length], // 🎨 Dynamic color
        isAnimating
          ? "opacity-0 transform scale-95 blur-sm"
          : "opacity-100 transform scale-100 blur-0"
      )}
    >
      {displayText}
    </span>
  )
}
