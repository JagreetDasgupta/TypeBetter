"use client"

import { useEffect, useRef } from "react"

export function useKeySound(enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return
    if (typeof window === "undefined") return
    try {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch {
      audioCtxRef.current = null
    }
    return () => {
      audioCtxRef.current?.close().catch(() => {})
      audioCtxRef.current = null
    }
  }, [enabled])

  function play(correct: boolean) {
    if (!enabled) return
    const ctx = audioCtxRef.current
    if (!ctx) return

    const now = ctx.currentTime
    // Throttle rapid sounds to avoid overwhelming
    if (now - lastTimeRef.current < 0.01) return
    lastTimeRef.current = now

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = correct ? "triangle" : "sawtooth"
    osc.frequency.value = correct ? 660 : 220
    gain.gain.value = 0.03

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(now + 0.05)
  }

  return { play }
}


