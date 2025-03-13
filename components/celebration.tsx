"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export default function Celebration() {
  const [audio] = useState(() => {
    if (typeof window !== "undefined") {
      return new Audio("/success.mp3")
    }
    return null
  })

  useEffect(() => {
    // Play sound
    if (audio) {
      audio.volume = 0.5
      audio.play().catch((e) => console.log("Audio play failed:", e))
    }

    // Launch confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => {
      clearInterval(interval)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [audio])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="animate-bounce text-center">
        <h1 className="text-shadow-lg text-6xl font-extrabold text-yellow-300 md:text-8xl">YOU ESCAPED!</h1>
      </div>
    </div>
  )
}

