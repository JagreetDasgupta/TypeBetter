"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VirtualKeyboard } from "@/components/virtual-keyboard"
import { ResultsModal } from "@/components/results-modal"
import { Navigation } from "@/components/navigation"
import { Settings } from "@/components/settings"
import { Leaderboard } from "@/components/leaderboard"
import { Dashboard } from "@/components/dashboard"
import { AuthModal } from "@/components/auth-modal"
import { AlertTriangle, Eye, EyeOff, Zap, Target, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTypingTracker } from "@/components/typing-tracker"
import { useSettings } from "@/hooks/use-settings"
import { generateRandomWords, getRandomQuote } from "@/lib/texts"
import { useHistory } from "@/hooks/use-history"
import { useKeySound } from "@/hooks/use-key-sound"

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole filled with the ends of worms and an oozy smell.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
]

interface TypingStats {
  wpm: number
  accuracy: number
  streak: number
  errors: number
  timeElapsed: number
}

interface AntiCheatFlags {
  fastKeys: boolean
  mouseMovement: boolean
  tabSwitch: boolean
}

export default function TypingPlatform() {
  const [currentView, setCurrentView] = useState<"typing" | "leaderboard" | "dashboard" | "settings">("typing")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Typing test state
  const { settings, update } = useSettings()
  const { addResult } = useHistory()
  const [text, setText] = useState(sampleTexts[0])
  const [userInput, setUserInput] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  // Stats
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    streak: 0,
    errors: 0,
    timeElapsed: 0,
  })

  // Anti-cheat
  const [antiCheatFlags, setAntiCheatFlags] = useState<AntiCheatFlags>({
    fastKeys: false,
    mouseMovement: false,
    tabSwitch: false,
  })
  const [lastKeyTime, setLastKeyTime] = useState<number>(0)
  const [isDisqualified, setIsDisqualified] = useState(false)

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  // Settings
  const [testMode, setTestMode] = useState<"time" | "words" | "quote">(settings.testMode)
  const [testDuration, setTestDuration] = useState(settings.testDuration)
  const [wordCount, setWordCount] = useState(settings.wordCount)
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled)
  const [theme, setTheme] = useState(settings.theme)

  // Layout preferences with animation state
  const [isCompactMode, setIsCompactMode] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const typingTracker = useTypingTracker(text)
  const keySound = useKeySound(soundEnabled)
  // Load dynamic text (API-backed) based on mode
  const loadNewText = useCallback(async () => {
    try {
      if (testMode === "words") {
        setText(generateRandomWords(wordCount))
        return
      }
      const minLength = testMode === "time" ? 120 : 80
      const maxLength = testMode === "time" ? 220 : 160
      const res = await fetch(`https://api.quotable.io/random?minLength=${minLength}&maxLength=${maxLength}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.content) {
          setText(String(data.content))
          return
        }
      }
      // Fallback
      setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
    } catch {
      setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
    }
  }, [testMode, wordCount])

  useEffect(() => {
    // Initial load
    loadNewText()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // Handle layout toggle with animation
  const toggleLayoutMode = () => {
    setIsAnimating(true)

    // Trigger layout change after a brief delay to allow animation setup
    setTimeout(() => {
      setIsCompactMode(!isCompactMode)
    }, 50)

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  // Reflect settings changes to local storage
  useEffect(() => {
    update("testMode", testMode)
  }, [testMode])
  useEffect(() => {
    update("testDuration", testDuration)
  }, [testDuration])
  useEffect(() => {
    update("wordCount", wordCount)
  }, [wordCount])
  useEffect(() => {
    update("soundEnabled", soundEnabled)
  }, [soundEnabled])
  useEffect(() => {
    update("theme", theme)
  }, [theme])

  // Calculate stats in real-time
  const calculateStats = useCallback(() => {
    if (!startTime) return

    const currentTime = endTime || Date.now()
    const timeElapsedSeconds = (currentTime - startTime) / 1000

    // Calculate correct characters
    let correctChars = 0
    const totalChars = userInput.length
    let errors = 0

    for (let i = 0; i < userInput.length; i++) {
      if (i < text.length && userInput[i] === text[i]) {
        correctChars++
      } else {
        errors++
      }
    }

    // Calculate accuracy
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100

    // Calculate WPM (words per minute)
    // Standard: 1 word = 5 characters (including spaces)
    const wordsTyped = correctChars / 5
    const wpm = timeElapsedSeconds > 0 ? Math.round((wordsTyped / timeElapsedSeconds) * 60) : 0

    // Calculate current streak
    let currentStreak = 0
    for (let i = userInput.length - 1; i >= 0; i--) {
      if (i < text.length && userInput[i] === text[i]) {
        currentStreak++
      } else {
        break
      }
    }

    setStats({
      wpm: Math.max(0, wpm),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      streak: currentStreak,
      errors,
      timeElapsed: Math.round(timeElapsedSeconds),
    })
  }, [userInput, text, startTime, endTime])

  // Update stats continuously while typing
  useEffect(() => {
    if (isTyping && !endTime) {
      const interval = setInterval(calculateStats, 100) // Update every 100ms
      return () => clearInterval(interval)
    } else if (endTime) {
      calculateStats() // Final calculation
    }
  }, [isTyping, endTime, calculateStats])

  // Handle typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const currentTime = Date.now()

    // Prevent typing beyond text length
    if (value.length > text.length) {
      return
    }

    // Anti-cheat: Check for fast key presses
    if (lastKeyTime && currentTime - lastKeyTime < 30) {
      setAntiCheatFlags((prev) => ({ ...prev, fastKeys: true }))
      setIsDisqualified(true)
    }
    setLastKeyTime(currentTime)

    if (!isTyping && value.length > 0) {
      setIsTyping(true)
      setStartTime(Date.now())
      typingTracker.startTracking()
    }

    // Record keystroke for analytics
    if (value.length > userInput.length) {
      const newChar = value[value.length - 1]
      const expectedChar = text[value.length - 1]
      const isCorrect = newChar === expectedChar
      typingTracker.recordKeystroke(newChar, isCorrect)
      keySound.play(isCorrect)
    }

    setUserInput(value)
    setCurrentIndex(value.length)

    // Check if test is complete
    if (value.length >= text.length) {
      setEndTime(Date.now())
      setIsTyping(false)
      typingTracker.stopTracking()
      addResult({
        mode: testMode,
        durationSeconds: startTime ? Math.round((Date.now() - startTime) / 1000) : 0,
        textLength: text.length,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
      })
      setTimeout(() => setShowResults(true), 500) // Small delay to show final stats
    }

    // Check time-based completion
    if (testMode === "time" && startTime && (Date.now() - startTime) / 1000 >= testDuration) {
      setEndTime(Date.now())
      setIsTyping(false)
      typingTracker.stopTracking()
      addResult({
        mode: testMode,
        durationSeconds: testDuration,
        textLength: text.length,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
      })
      setTimeout(() => setShowResults(true), 500)
    }
  }

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && userInput.length > 0) {
      // Allow backspace but don't go beyond current position
      return
    }
  }

  // Reset test
  const resetTest = () => {
    setUserInput("")
    setCurrentIndex(0)
    setIsTyping(false)
    setStartTime(null)
    setEndTime(null)
    setShowResults(false)
    setAntiCheatFlags({ fastKeys: false, mouseMovement: false, tabSwitch: false })
    setIsDisqualified(false)
    setStats({
      wpm: 0,
      accuracy: 100,
      streak: 0,
      errors: 0,
      timeElapsed: 0,
    })
    // Load fresh text according to mode
    loadNewText()
    typingTracker.reset()
    inputRef.current?.focus()
  }

  // Render character with proper styling
  const renderCharacter = (char: string, index: number) => {
    let className = "transition-all duration-200 px-0.5 py-0.5 rounded-sm "

    if (index < userInput.length) {
      className +=
        userInput[index] === char
          ? "text-emerald-300 char-correct text-glow-green"
          : "text-red-300 char-incorrect text-glow-red"
    } else if (index === currentIndex) {
      className += "text-blue-200 char-current text-glow"
    } else {
      className += "text-slate-300"
    }

    return (
      <span key={index} className={className}>
        {char === " " ? "·" : char}
      </span>
    )
  }

  if (currentView === "leaderboard") {
    return (
      <div className="min-h-screen glass-bg">
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          isAuthenticated={isAuthenticated}
          setShowAuthModal={setShowAuthModal}
          setShowSettings={setShowSettings}
        />
        <Leaderboard />
        {/* Global modals available from any view */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={() => {
            setIsAuthenticated(true)
            setShowAuthModal(false)
          }}
        />
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          testMode={testMode}
          setTestMode={setTestMode}
          testDuration={testDuration}
          setTestDuration={setTestDuration}
          wordCount={wordCount}
          setWordCount={setWordCount}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          theme={theme}
          setTheme={setTheme}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          keyboardLayout={settings.keyboardLayout as any}
          setKeyboardLayout={(layout) => update("keyboardLayout", layout)}
        />
      </div>
    )
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen glass-bg">
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          isAuthenticated={isAuthenticated}
          setShowAuthModal={setShowAuthModal}
          setShowSettings={setShowSettings}
        />
        <Dashboard />
        {/* Global modals available from any view */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={() => {
            setIsAuthenticated(true)
            setShowAuthModal(false)
          }}
        />
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          testMode={testMode}
          setTestMode={setTestMode}
          testDuration={testDuration}
          setTestDuration={setTestDuration}
          wordCount={wordCount}
          setWordCount={setWordCount}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          theme={theme}
          setTheme={setTheme}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          keyboardLayout={settings.keyboardLayout as any}
          setKeyboardLayout={(layout) => update("keyboardLayout", layout)}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "h-screen glass-bg text-white smooth-transition relative z-10 overflow-hidden layout-transition",
        focusMode && "focus-mode",
      )}
    >
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAuthenticated={isAuthenticated}
        setShowAuthModal={setShowAuthModal}
        setShowSettings={setShowSettings}
        isCompactMode={isCompactMode}
      />

      {focusMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={() => setFocusMode(false)}
            className="glass-button rounded-lg px-3 py-2"
            size="sm"
            title="Exit Focus"
          >
            <EyeOff className="w-4 h-4 mr-1" />
            Exit Focus
          </Button>
        </div>
      )}

      <main
        className={cn(
          "min-h-screen grid px-4 relative z-10 layout-transition",
          focusMode ? "grid-rows-[1fr] place-items-center py-6" : "grid-rows-[auto_auto_1fr]",
          !focusMode && (isCompactMode ? "py-2 gap-3" : "py-4 gap-5"),
        )}
      >

        {/* Animated Stats Bar */}
        {!focusMode && (
          <div
            className={cn(
              "flex justify-center stats-container layout-stable row-start-1",
              isCompactMode ? "gap-2 mb-1" : "gap-3 mb-3 scale-105",
            )}
          >
          <div
            className={cn(
              "stat-card rounded-lg text-center stat-card-animated layout-stable",
              isCompactMode ? "px-3 py-2 min-w-[60px]" : "px-4 py-4 min-w-[80px]",
              isAnimating && (isCompactMode ? "compact-mode" : "normal-mode"),
            )}
          >
            <Zap
              className={cn(
                "text-blue-400 mx-auto mb-1 text-glow icon-transition",
                isCompactMode ? "w-4 h-4" : "w-6 h-6",
                isAnimating && "size-change",
              )}
            />
            <div
              className={cn(
                "font-bold text-blue-300 text-glow leading-none text-size-transition",
                isCompactMode ? "text-lg" : "text-2xl",
                isAnimating && "size-change",
              )}
            >
              {stats.wpm}
            </div>
            <div
              className={cn(
                "text-slate-400 uppercase tracking-wider text-size-transition",
                isCompactMode ? "text-[10px]" : "text-xs",
                isAnimating && "size-change",
              )}
            >
              WPM
            </div>
          </div>

          <div
            className={cn(
              "stat-card rounded-lg text-center stat-card-animated layout-stable",
              isCompactMode ? "px-3 py-2 min-w-[60px]" : "px-4 py-4 min-w-[80px]",
              isAnimating && (isCompactMode ? "compact-mode" : "normal-mode"),
            )}
          >
            <Target
              className={cn(
                "text-emerald-400 mx-auto mb-1 text-glow-green icon-transition",
                isCompactMode ? "w-4 h-4" : "w-6 h-6",
                isAnimating && "size-change",
              )}
            />
            <div
              className={cn(
                "font-bold text-emerald-300 text-glow-green leading-none text-size-transition",
                isCompactMode ? "text-lg" : "text-2xl",
                isAnimating && "size-change",
              )}
            >
              {stats.accuracy}%
            </div>
            <div
              className={cn(
                "text-slate-400 uppercase tracking-wider text-size-transition",
                isCompactMode ? "text-[10px]" : "text-xs",
                isAnimating && "size-change",
              )}
            >
              ACCURACY
            </div>
          </div>

          <div
            className={cn(
              "stat-card rounded-lg text-center stat-card-animated layout-stable",
              isCompactMode ? "px-3 py-2 min-w-[60px]" : "px-4 py-4 min-w-[80px]",
              isAnimating && (isCompactMode ? "compact-mode" : "normal-mode"),
            )}
          >
            <Clock
              className={cn(
                "text-purple-400 mx-auto mb-1 text-glow-purple icon-transition",
                isCompactMode ? "w-4 h-4" : "w-6 h-6",
                isAnimating && "size-change",
              )}
            />
            <div
              className={cn(
                "font-bold text-purple-300 text-glow-purple leading-none text-size-transition",
                isCompactMode ? "text-lg" : "text-2xl",
                isAnimating && "size-change",
              )}
            >
              {stats.timeElapsed}s
            </div>
            <div
              className={cn(
                "text-slate-400 uppercase tracking-wider text-size-transition",
                isCompactMode ? "text-[10px]" : "text-xs",
                isAnimating && "size-change",
              )}
            >
              TIME
            </div>
          </div>

          <div
            className={cn(
              "stat-card rounded-lg text-center stat-card-animated layout-stable",
              isCompactMode ? "px-3 py-2 min-w-[60px]" : "px-4 py-4 min-w-[80px]",
              isAnimating && (isCompactMode ? "compact-mode" : "normal-mode"),
            )}
          >
            <AlertCircle
              className={cn(
                "text-yellow-400 mx-auto mb-1 text-glow-yellow icon-transition",
                isCompactMode ? "w-4 h-4" : "w-6 h-6",
                isAnimating && "size-change",
              )}
            />
            <div
              className={cn(
                "font-bold text-yellow-300 text-glow-yellow leading-none text-size-transition",
                isCompactMode ? "text-lg" : "text-2xl",
                isAnimating && "size-change",
              )}
            >
              {stats.errors}
            </div>
            <div
              className={cn(
                "text-slate-400 uppercase tracking-wider text-size-transition",
                isCompactMode ? "text-[10px]" : "text-xs",
                isAnimating && "size-change",
              )}
            >
              ERRORS
            </div>
          </div>

          {isDisqualified && (
            <div
              className={cn(
                "stat-card rounded-lg border-red-500/30 bg-red-900/20 flex items-center stat-card-animated layout-stable",
                isCompactMode ? "px-3 py-2" : "px-4 py-4",
                isAnimating && (isCompactMode ? "compact-mode" : "normal-mode"),
              )}
            >
              <AlertTriangle
                className={cn(
                  "text-glow-red mr-1 icon-transition",
                  isCompactMode ? "w-4 h-4" : "w-5 h-5",
                  isAnimating && "size-change",
                )}
              />
              <Badge
                variant="destructive"
                className={cn(
                  "glass-button px-2 py-0 text-size-transition",
                  isCompactMode ? "text-[10px]" : "text-xs",
                  isAnimating && "size-change",
                )}
              >
                {isCompactMode ? "DQ" : "Disqualified"}
              </Badge>
            </div>
          )}
          </div>
        )}

        {/* Typing Area */}
        <Card
          className={cn(
            "typing-glass rounded-2xl shadow-premium layout-transition",
            focusMode
              ? "inline-block w-auto max-w-none row-start-1"
              : "max-w-6xl mx-auto w-full row-start-2",
            isCompactMode ? "p-4 mb-2" : "p-6 mb-3",
          )}
        >
          <div className="relative h-full flex flex-col">
            <div
              ref={textRef}
              className={cn("mb-4 select-none", focusMode && "text-center")}
              style={{
                fontFamily:
                  "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial",
                fontSize: isCompactMode ? "clamp(14px, 1.2vw, 20px)" : "clamp(16px, 1.6vw, 22px)",
                lineHeight: isCompactMode ? "clamp(1.6rem, 2.2vw, 2.2rem)" : "clamp(1.8rem, 2.6vw, 2.6rem)",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                letterSpacing: "0.02em",
                maxWidth: focusMode ? "min(90vw, 1200px)" : undefined,
                maxHeight: focusMode ? undefined : !isCompactMode ? "min(36vh, 420px)" : undefined,
                overflow: focusMode ? "visible" : !isCompactMode ? "auto" : "visible",
              }}
            >
              {text.split("").map((char, index) => renderCharacter(char, index))}
              {currentIndex === text.length && (
                <span className="typing-caret w-0.5 h-6 inline-block ml-1 rounded-full" />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 opacity-0 cursor-default"
              autoFocus
              disabled={showResults}
            />

            {!focusMode && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button onClick={resetTest} className="glass-button rounded-lg px-4 py-2 text-sm font-medium">
                  Reset Test
                </Button>

                <Button
                  onClick={toggleLayoutMode}
                  className="glass-button rounded-lg px-3 py-2 text-sm toggle-button"
                  size="sm"
                  title={isCompactMode ? "Switch to Normal Layout" : "Switch to Compact Layout"}
                  disabled={isAnimating}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isCompactMode ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    )}
                  </svg>
                  {isAnimating ? "..." : isCompactMode ? "Expand" : "Compact"}
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-slate-300 bg-slate-800/30 px-3 py-1 rounded-lg backdrop-blur-sm text-sm">
                  <span className="text-blue-300">{userInput.length}</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-slate-300">{text.length}</span>
                </div>

                {isTyping && (
                  <div className="text-blue-300 bg-blue-900/20 px-3 py-1 rounded-lg backdrop-blur-sm border border-blue-500/20 text-sm">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                    Typing...
                  </div>
                )}

                <Button
                  onClick={() => setFocusMode(!focusMode)}
                  className="glass-button rounded-lg px-3 py-2"
                  size="sm"
                >
                  {focusMode ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  Focus
                </Button>
              </div>
            </div>
            )}
          </div>
        </Card>

        {/* Keyboard Guide */}
        {!focusMode && (
          <div className="flex-shrink-0 pb-4 flex items-start justify-center row-start-3" style={{ minHeight: isCompactMode ? "36vh" : "28vh" }}>
            <VirtualKeyboard
              currentChar={userInput.length > 0 ? userInput[userInput.length - 1] : ""}
              nextChar={text[currentIndex] || ""}
              pressedKeys={new Set()}
              layout={settings.keyboardLayout as any}
              size={isCompactMode ? "compact" : "expanded"}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        stats={stats}
        onRetry={resetTest}
        isDisqualified={isDisqualified}
        antiCheatFlags={antiCheatFlags}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={() => {
          setIsAuthenticated(true)
          setShowAuthModal(false)
        }}
      />

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        testMode={testMode}
        setTestMode={setTestMode}
        testDuration={testDuration}
        setTestDuration={setTestDuration}
        wordCount={wordCount}
        setWordCount={setWordCount}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        setTheme={setTheme}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        keyboardLayout={settings.keyboardLayout as any}
        setKeyboardLayout={(layout) => update("keyboardLayout", layout)}
      />
    </div>
  )
}
