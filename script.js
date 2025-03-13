// DOM Elements
const lockScreen = document.getElementById("lock-screen")
const escapeScreen = document.getElementById("escape-screen")
const pinForm = document.getElementById("pin-form")
const pinInput = document.getElementById("pin-input")
const pinError = document.getElementById("pin-error")
const lockButton = document.getElementById("lock-button")
const keypadButtons = document.querySelectorAll(".keypad-button")
const clearButton = document.getElementById("clear-button")
const deleteButton = document.getElementById("delete-button")
const tryEscapeButton = document.getElementById("try-escape-button")
const playAgainButton = document.getElementById("play-again-button")
const celebrationOverlay = document.getElementById("celebration-overlay")
const escapeHeader = document.getElementById("escape-header")
const lockIconContainer = document.getElementById("lock-icon-container")
const lockIcon = document.getElementById("lock-icon")
const escapeTitle = document.getElementById("escape-title")
const escapeDescription = document.getElementById("escape-description")

// Constants
const PIN_STORAGE_KEY = "escape-room-pin"
const MAX_PIN_LENGTH = 3

// State
let enteredPin = ""

// Helper functions for local storage
function getStoredPin() {
  return localStorage.getItem(PIN_STORAGE_KEY)
}

function storePin(pin) {
  localStorage.setItem(PIN_STORAGE_KEY, pin)
}

function clearPin() {
  localStorage.removeItem(PIN_STORAGE_KEY)
}

// Initialize the game
function initGame() {
  const storedPin = getStoredPin()

  if (storedPin) {
    // If PIN exists, go to escape screen
    lockScreen.classList.add("hidden")
    escapeScreen.classList.remove("hidden")
  } else {
    // Otherwise, show lock screen
    lockScreen.classList.remove("hidden")
    escapeScreen.classList.add("hidden")
  }

  // Set up event listeners
  setupEventListeners()
}

// Set up all event listeners
function setupEventListeners() {
  // Lock screen form submission
  pinForm.addEventListener("submit", handlePinSubmit)

  // PIN input validation
  pinInput.addEventListener("input", handlePinInput)

  // Keypad buttons
  keypadButtons.forEach((button) => {
    if (button.dataset.digit) {
      button.addEventListener("click", () => handleDigitClick(button.dataset.digit))
    }
  })

  // Clear and delete buttons
  clearButton.addEventListener("click", handleClear)
  deleteButton.addEventListener("click", handleDelete)

  // Try escape button
  tryEscapeButton.addEventListener("click", handleTryEscape)

  // Play again button
  playAgainButton.addEventListener("click", handlePlayAgain)
}

// Handle PIN input validation
function handlePinInput(e) {
  // Only allow numbers
  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, MAX_PIN_LENGTH)
  e.target.value = value

  // Enable/disable lock button
  lockButton.disabled = value.length !== MAX_PIN_LENGTH

  // Clear error message
  pinError.textContent = ""
}

// Handle PIN form submission
function handlePinSubmit(e) {
  e.preventDefault()

  const pin = pinInput.value

  if (pin.length !== MAX_PIN_LENGTH) {
    pinError.textContent = `Please enter a ${MAX_PIN_LENGTH}-digit PIN`
    return
  }

  // Store PIN and switch to escape screen
  storePin(pin)
  lockScreen.classList.add("hidden")
  escapeScreen.classList.remove("hidden")
}

// Handle digit click on keypad
function handleDigitClick(digit) {
  if (enteredPin.length < MAX_PIN_LENGTH) {
    enteredPin += digit
    updatePinDisplay()
    updateTryEscapeButton()
  }
}

// Handle clear button click
function handleClear() {
  enteredPin = ""
  updatePinDisplay()
  updateTryEscapeButton()
}

// Handle delete button click
function handleDelete() {
  enteredPin = enteredPin.slice(0, -1)
  updatePinDisplay()
  updateTryEscapeButton()
}

// Update the PIN display
function updatePinDisplay() {
  for (let i = 0; i < MAX_PIN_LENGTH; i++) {
    const digitElement = document.getElementById(`digit-${i}`)

    if (i < enteredPin.length) {
      digitElement.textContent = enteredPin[i]
      digitElement.classList.add("filled")
    } else {
      digitElement.textContent = ""
      digitElement.classList.remove("filled")
    }
  }
}

// Update try escape button state
function updateTryEscapeButton() {
  tryEscapeButton.disabled = enteredPin.length !== MAX_PIN_LENGTH
}

// Handle try escape button click
function handleTryEscape() {
  const correctPin = getStoredPin()

  if (enteredPin === correctPin) {
    // Success! Unlock the room
    unlockRoom()
  } else {
    // Wrong PIN, shake the card
    escapeScreen.classList.add("shake")
    setTimeout(() => {
      escapeScreen.classList.remove("shake")
      enteredPin = ""
      updatePinDisplay()
      updateTryEscapeButton()
    }, 500)
  }
}

// Handle play again button click
function handlePlayAgain() {
  // Clear PIN and restart the game
  clearPin()
  window.location.reload()
}

// Unlock the room
function unlockRoom() {
  // Update UI
  escapeScreen.style.borderColor = "#10b981"
  escapeHeader.classList.add("success")
  lockIconContainer.classList.add("success")

  // Change lock icon to unlock icon
  lockIcon.innerHTML = `
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
  `

  escapeTitle.textContent = "Unlocked!"
  escapeDescription.textContent = "You've escaped!"

  // Hide keypad and try escape button
  document.querySelector(".keypad").style.display = "none"
  tryEscapeButton.classList.add("hidden")

  // Show play again button
  playAgainButton.classList.remove("hidden")

  // Show celebration
  showCelebration()
}

// Show celebration effects
function showCelebration() {
  // Show celebration overlay
  celebrationOverlay.classList.remove("hidden")

  // Create confetti
  createConfetti()

  // Play sound
  playSuccessSound()
}

// Create confetti effect
function createConfetti() {
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div")
      confetti.classList.add("confetti")

      // Random position
      const left = Math.random() * 100
      confetti.style.left = `${left}%`

      // Random color
      const colorIndex = Math.floor(Math.random() * colors.length)
      confetti.style.backgroundColor = colors[colorIndex]

      // Random shape
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = "50%"
      }

      // Random size
      const size = Math.random() * 10 + 5
      confetti.style.width = `${size}px`
      confetti.style.height = `${size}px`

      // Random rotation
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`

      // Random animation duration
      const duration = Math.random() * 3 + 2
      confetti.style.animationDuration = `${duration}s`

      document.body.appendChild(confetti)

      // Remove after animation
      setTimeout(() => {
        confetti.remove()
      }, duration * 1000)
    }, i * 50)
  }
}

// Play success sound
function playSuccessSound() {
  const audio = new Audio();
  // Use a simple success sound URL or base64 encoded audio\
  audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD4+Pj4+Pj4+Pj4+Pj4+Pj4//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAAAbA6dgfJAAAAAAAAAAAAAAAAAAAA/+MYxAANmAqIWUEQACCGkqc1TKQQHAYHiQACBxycQ5EIQhDkOXI5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPlz5c+XPl

