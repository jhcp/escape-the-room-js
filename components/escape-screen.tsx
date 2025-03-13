"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Unlock } from "lucide-react"
import Celebration from "./celebration"

interface EscapeScreenProps {
  correctPin: string
}

export default function EscapeScreen({ correctPin }: EscapeScreenProps) {
  const [enteredPin, setEnteredPin] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [shakeAnimation, setShakeAnimation] = useState(false)

  const handleDigitClick = (digit: number) => {
    if (enteredPin.length < 3) {
      setEnteredPin((prev) => prev + digit)
    }
  }

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setEnteredPin("")
  }

  const handleCheck = () => {
    if (enteredPin === correctPin) {
      setIsUnlocked(true)
      setShowCelebration(true)
    } else {
      setShakeAnimation(true)
      setTimeout(() => setShakeAnimation(false), 500)
      setEnteredPin("")
    }
  }

  return (
    <>
      <Card
        className={`relative w-full max-w-md border-4 ${isUnlocked ? "border-green-400" : "border-red-400"} bg-white shadow-xl transition-all duration-300 ${shakeAnimation ? "animate-shake" : ""}`}
      >
        <CardHeader
          className={`bg-gradient-to-r ${isUnlocked ? "from-green-500 to-teal-600" : "from-red-500 to-orange-600"} text-center`}
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isUnlocked ? "bg-green-300" : "bg-orange-300"} p-3`}
          >
            {isUnlocked ? <Unlock className="h-8 w-8 text-green-700" /> : <Lock className="h-8 w-8 text-red-700" />}
          </div>
          <CardTitle className="text-3xl font-bold text-white">{isUnlocked ? "Unlocked!" : "Locked Room"}</CardTitle>
          <CardDescription className="text-lg text-gray-100">
            {isUnlocked ? "You've escaped!" : "Enter the correct PIN to escape"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-full max-w-[200px] items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-gray-100">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`flex h-12 w-12 items-center justify-center rounded-md ${
                    index < enteredPin.length ? "bg-blue-500 text-white" : "bg-gray-200"
                  } text-2xl font-bold`}
                >
                  {index < enteredPin.length ? enteredPin[index] : ""}
                </div>
              ))}
            </div>
          </div>

          {!isUnlocked && (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <Button
                  key={digit}
                  onClick={() => handleDigitClick(digit)}
                  className="h-14 bg-blue-500 text-xl font-bold hover:bg-blue-600"
                  disabled={enteredPin.length >= 3}
                >
                  {digit}
                </Button>
              ))}
              <Button onClick={handleClear} className="h-14 bg-yellow-500 text-xl font-bold hover:bg-yellow-600">
                Clear
              </Button>
              <Button
                onClick={() => handleDigitClick(0)}
                className="h-14 bg-blue-500 text-xl font-bold hover:bg-blue-600"
                disabled={enteredPin.length >= 3}
              >
                0
              </Button>
              <Button
                onClick={handleDelete}
                className="h-14 bg-red-500 text-xl font-bold hover:bg-red-600"
                disabled={enteredPin.length === 0}
              >
                ←
              </Button>
            </div>
          )}

          {!isUnlocked && (
            <Button
              onClick={handleCheck}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-600 py-3 text-lg font-bold transition-transform hover:scale-105"
              disabled={enteredPin.length !== 3}
            >
              Try to Escape
            </Button>
          )}

          {isUnlocked && (
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 py-3 text-lg font-bold transition-transform hover:scale-105"
            >
              Play Again
            </Button>
          )}
        </CardContent>
      </Card>

      {showCelebration && <Celebration />}
    </>
  )
}

