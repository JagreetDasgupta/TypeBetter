"use client"

import { useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTheme } from "next-themes"

export type KeyboardLayout = "qwerty" | "dvorak" | "colemak"

export interface SettingsState {
  testMode: "time" | "words" | "quote"
  testDuration: number
  wordCount: number
  soundEnabled: boolean
  theme: string
  focusMode: boolean
  keyboardLayout: KeyboardLayout
}

const DEFAULT_SETTINGS: SettingsState = {
  testMode: "time",
  testDuration: 60,
  wordCount: 25,
  soundEnabled: true,
  theme: "dark",
  focusMode: false,
  keyboardLayout: "qwerty",
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<SettingsState>("tp_settings", DEFAULT_SETTINGS)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (settings.theme) setTheme(settings.theme)
  }, [settings.theme, setTheme])

  return {
    settings,
    setSettings,
    update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
      setSettings({ ...settings, [key]: value })
    },
  }
}


