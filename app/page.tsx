"use client"

import { useState, useEffect } from "react"
import LockScreen from "@/components/lock-screen"
import EscapeScreen from "@/components/escape-screen"
import { getStoredPin, storePin } from "@/lib/storage"

export default function EscapeRoomGame() {
  const [pin, setPin] = useState<string | null>(null)
  const [gameState, setGameState] = useState<"lock" | "escape">("lock")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if pin exists in local storage
    const storedPin = getStoredPin()
    if (storedPin) {
      setPin(storedPin)
      setGameState("escape")
    }
    setIsLoading(false)
  }, [])

  const handlePinSet = (newPin: string) => {
    setPin(newPin)
    storePin(newPin)
    setGameState("escape")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
        <div className="text-2xl font-bold text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 p-4">
      {gameState === "lock" ? <LockScreen onPinSet={handlePinSet} /> : <EscapeScreen correctPin={pin || ""} />}
    </main>
  )
}

