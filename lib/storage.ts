const PIN_STORAGE_KEY = "escape-room-pin"

export function storePin(pin: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PIN_STORAGE_KEY, pin)
  }
}

export function getStoredPin(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(PIN_STORAGE_KEY)
  }
  return null
}

export function clearPin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PIN_STORAGE_KEY)
  }
}

