"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LockKeyhole } from "lucide-react"

interface LockScreenProps {
  onPinSet: (pin: string) => void
}

export default function LockScreen({ onPinSet }: LockScreenProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 3)
    setPin(value)
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length !== 3) {
      setError("Please enter a 3-digit PIN")
      return
    }

    onPinSet(pin)
  }

  return (
    <Card className="w-full max-w-md border-4 border-yellow-400 bg-white shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-300 p-3">
          <LockKeyhole className="h-8 w-8 text-purple-700" />
        </div>
        <CardTitle className="text-3xl font-bold text-white">Secret Lock</CardTitle>
        <CardDescription className="text-lg text-blue-100">Create a 3-digit PIN to lock the room</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="pin" className="text-lg font-medium text-gray-700">
              Enter your secret PIN:
            </label>
            <Input
              id="pin"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              value={pin}
              onChange={handlePinChange}
              placeholder="123"
              className="text-center text-3xl tracking-widest"
            />
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-lg font-bold transition-transform hover:scale-105"
            disabled={pin.length !== 3}
          >
            Lock the Room
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

