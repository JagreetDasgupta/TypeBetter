"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"

export interface TestResult {
  id: string
  timestamp: number
  mode: "time" | "words" | "quote"
  durationSeconds: number
  textLength: number
  wpm: number
  accuracy: number
  errors: number
  adjustedWpm: number
}

const DEFAULT_HISTORY: TestResult[] = []

export function useHistory() {
  const [history, setHistory] = useLocalStorage<TestResult[]>("tp_history", DEFAULT_HISTORY)

  return {
    history,
    addResult(result: Omit<TestResult, "id" | "timestamp" | "adjustedWpm">) {
      const adjustedWpm = Math.round((result.wpm * result.accuracy) / 100)
      const entry: TestResult = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        adjustedWpm,
        ...result,
      }
      setHistory([entry, ...history].slice(0, 500))
      return entry
    },
    clear() {
      setHistory([])
    },
    metrics() {
      if (history.length === 0) {
        return {
          avgWpm: 0,
          bestWpm: 0,
          avgAccuracy: 0,
          tests: 0,
        }
      }
      const tests = history.length
      const wpmValues = history.map((h) => h.wpm)
      const accValues = history.map((h) => h.accuracy)
      const avgWpm = Math.round(wpmValues.reduce((a, b) => a + b, 0) / tests)
      const bestWpm = Math.max(...wpmValues)
      const avgAccuracy = Math.round((accValues.reduce((a, b) => a + b, 0) / tests) * 10) / 10
      return { avgWpm, bestWpm, avgAccuracy, tests }
    },
  }
}


