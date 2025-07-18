"use client"

import { useState, useEffect } from "react"

interface KeystrokeEvent {
  key: string
  timestamp: number
  correct: boolean
  finger: string
  delay: number
}

interface TypingSession {
  keystrokes: KeystrokeEvent[]
  startTime: number
  endTime?: number
  text: string
  wpm: number
  accuracy: number
}

export class TypingTracker {
  private keystrokes: KeystrokeEvent[] = []
  private startTime = 0
  private lastKeystrokeTime = 0
  private text = ""
  private currentIndex = 0

  constructor(text: string) {
    this.text = text
    this.startTime = Date.now()
    this.lastKeystrokeTime = this.startTime
  }

  recordKeystroke(key: string, correct: boolean): void {
    const now = Date.now()
    const delay = now - this.lastKeystrokeTime
    const finger = this.getFingerForKey(key)

    const keystroke: KeystrokeEvent = {
      key,
      timestamp: now,
      correct,
      finger,
      delay,
    }

    this.keystrokes.push(keystroke)
    this.lastKeystrokeTime = now
    this.currentIndex++
  }

  private getFingerForKey(key: string): string {
    const fingerMap: { [key: string]: string } = {
      "`": "left-pinky",
      "1": "left-pinky",
      q: "left-pinky",
      a: "left-pinky",
      z: "left-pinky",
      "2": "left-ring",
      w: "left-ring",
      s: "left-ring",
      x: "left-ring",
      "3": "left-middle",
      e: "left-middle",
      d: "left-middle",
      c: "left-middle",
      "4": "left-index",
      "5": "left-index",
      r: "left-index",
      t: "left-index",
      f: "left-index",
      g: "left-index",
      v: "left-index",
      b: "left-index",
      "6": "right-index",
      "7": "right-index",
      y: "right-index",
      u: "right-index",
      h: "right-index",
      j: "right-index",
      n: "right-index",
      m: "right-index",
      "8": "right-middle",
      i: "right-middle",
      k: "right-middle",
      ",": "right-middle",
      "9": "right-ring",
      o: "right-ring",
      l: "right-ring",
      ".": "right-ring",
      "0": "right-pinky",
      "-": "right-pinky",
      "=": "right-pinky",
      p: "right-pinky",
      "[": "right-pinky",
      "]": "right-pinky",
      ";": "right-pinky",
      "'": "right-pinky",
      "/": "right-pinky",
      " ": "thumb",
    }
    return fingerMap[key.toLowerCase()] || "unknown"
  }

  getSession(): TypingSession {
    const endTime = Date.now()
    const duration = (endTime - this.startTime) / 1000 / 60 // minutes
    const correctKeystrokes = this.keystrokes.filter((k) => k.correct).length
    const totalKeystrokes = this.keystrokes.length

    const wpm = Math.round(correctKeystrokes / 5 / duration)
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100

    return {
      keystrokes: this.keystrokes,
      startTime: this.startTime,
      endTime,
      text: this.text,
      wpm,
      accuracy,
    }
  }

  getKeystrokeAnalytics() {
    const keystrokeMap = new Map<
      string,
      {
        count: number
        correct: number
        totalDelay: number
        finger: string
      }
    >()

    this.keystrokes.forEach((keystroke) => {
      const existing = keystrokeMap.get(keystroke.key) || {
        count: 0,
        correct: 0,
        totalDelay: 0,
        finger: keystroke.finger,
      }

      existing.count++
      if (keystroke.correct) existing.correct++
      existing.totalDelay += keystroke.delay

      keystrokeMap.set(keystroke.key, existing)
    })

    return Array.from(keystrokeMap.entries()).map(([key, data]) => ({
      key,
      count: data.count,
      accuracy: data.count > 0 ? Math.round((data.correct / data.count) * 100) : 100,
      avgSpeed: data.count > 0 ? Math.round(data.totalDelay / data.count) : 0,
      finger: data.finger,
      errors: data.count - data.correct,
    }))
  }

  getFingerAnalytics() {
    const fingerMap = new Map<
      string,
      {
        usage: number
        correct: number
        totalDelay: number
      }
    >()

    this.keystrokes.forEach((keystroke) => {
      const existing = fingerMap.get(keystroke.finger) || {
        usage: 0,
        correct: 0,
        totalDelay: 0,
      }

      existing.usage++
      if (keystroke.correct) existing.correct++
      existing.totalDelay += keystroke.delay

      fingerMap.set(keystroke.finger, existing)
    })

    const totalKeystrokes = this.keystrokes.length

    return Array.from(fingerMap.entries()).map(([finger, data]) => ({
      finger: this.formatFingerName(finger),
      usage: totalKeystrokes > 0 ? Math.round((data.usage / totalKeystrokes) * 100 * 10) / 10 : 0,
      accuracy: data.usage > 0 ? Math.round((data.correct / data.usage) * 100 * 10) / 10 : 100,
      speed: data.usage > 0 ? Math.round(data.totalDelay / data.usage) : 0,
      color: this.getFingerColor(finger),
    }))
  }

  private formatFingerName(finger: string): string {
    const nameMap: { [key: string]: string } = {
      "left-pinky": "Left Pinky",
      "left-ring": "Left Ring",
      "left-middle": "Left Middle",
      "left-index": "Left Index",
      "right-index": "Right Index",
      "right-middle": "Right Middle",
      "right-ring": "Right Ring",
      "right-pinky": "Right Pinky",
      thumb: "Thumbs",
    }
    return nameMap[finger] || finger
  }

  private getFingerColor(finger: string): string {
    const colorMap: { [key: string]: string } = {
      "left-pinky": "#ef4444",
      "left-ring": "#f97316",
      "left-middle": "#eab308",
      "left-index": "#22c55e",
      "right-index": "#06b6d4",
      "right-middle": "#3b82f6",
      "right-ring": "#8b5cf6",
      "right-pinky": "#ec4899",
      thumb: "#10b981",
    }
    return colorMap[finger] || "#6b7280"
  }

  getTypingPatterns() {
    return this.keystrokes.map((keystroke, index) => {
      const timeFromStart = keystroke.timestamp - this.startTime
      const recentKeystrokes = this.keystrokes.slice(Math.max(0, index - 10), index + 1)
      const recentCorrect = recentKeystrokes.filter((k) => k.correct).length
      const currentWpm = recentKeystrokes.length > 0 ? Math.round(recentCorrect / 5 / (timeFromStart / 1000 / 60)) : 0
      const currentAccuracy =
        recentKeystrokes.length > 0 ? Math.round((recentCorrect / recentKeystrokes.length) * 100) : 100

      return {
        time: Math.round(timeFromStart / 1000),
        wpm: currentWpm,
        accuracy: currentAccuracy,
        keystroke: keystroke.key,
        delay: keystroke.delay,
      }
    })
  }
}

export function useTypingTracker(text: string) {
  const [tracker, setTracker] = useState<TypingTracker | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (text && !tracker) {
      setTracker(new TypingTracker(text))
    }
  }, [text, tracker])

  const startTracking = () => {
    if (text) {
      setTracker(new TypingTracker(text))
      setIsTracking(true)
    }
  }

  const stopTracking = () => {
    setIsTracking(false)
  }

  const recordKeystroke = (key: string, correct: boolean) => {
    if (tracker && isTracking) {
      tracker.recordKeystroke(key, correct)
    }
  }

  const getAnalytics = () => {
    if (!tracker) return null

    return {
      session: tracker.getSession(),
      keystrokes: tracker.getKeystrokeAnalytics(),
      fingers: tracker.getFingerAnalytics(),
      patterns: tracker.getTypingPatterns(),
    }
  }

  const reset = () => {
    setTracker(null)
    setIsTracking(false)
  }

  return {
    startTracking,
    stopTracking,
    recordKeystroke,
    getAnalytics,
    reset,
    isTracking,
  }
}
