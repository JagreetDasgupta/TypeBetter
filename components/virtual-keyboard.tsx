"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KeyboardGuideProps {
  currentChar: string
  nextChar: string
  pressedKeys: Set<string>
  layout: "qwerty" | "dvorak" | "colemak"
  size?: "compact" | "expanded"
}

const keyboardLayouts = {
  qwerty: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ],
  dvorak: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[", "]"],
    ["'", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/", "=", "\\"],
    ["a", "o", "e", "u", "i", "d", "h", "t", "n", "s", "-"],
    [";", "q", "j", "k", "x", "b", "m", "w", "v", "z"],
  ],
  colemak: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "f", "p", "g", "j", "l", "u", "y", ";", "[", "]", "\\"],
    ["a", "r", "s", "t", "d", "h", "n", "e", "i", "o", "'"],
    ["z", "x", "c", "v", "b", "k", "m", ",", ".", "/"],
  ],
}

const getFingerForKey = (key: string): string => {
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
    "\\": "right-pinky",
  }
  return fingerMap[key.toLowerCase()] || "unknown"
}

const getFingerColor = (finger: string): string => {
  const colors: { [key: string]: string } = {
    "left-pinky": "from-red-500/30 to-red-600/20 border-red-400/40",
    "left-ring": "from-orange-500/30 to-orange-600/20 border-orange-400/40",
    "left-middle": "from-yellow-500/30 to-yellow-600/20 border-yellow-400/40",
    "left-index": "from-green-500/30 to-green-600/20 border-green-400/40",
    "right-index": "from-cyan-500/30 to-cyan-600/20 border-cyan-400/40",
    "right-middle": "from-blue-500/30 to-blue-600/20 border-blue-400/40",
    "right-ring": "from-purple-500/30 to-purple-600/20 border-purple-400/40",
    "right-pinky": "from-pink-500/30 to-pink-600/20 border-pink-400/40",
    thumb: "from-emerald-500/30 to-emerald-600/20 border-emerald-400/40",
  }
  return colors[finger] || "from-gray-500/30 to-gray-600/20 border-gray-400/40"
}

export function VirtualKeyboard({ currentChar, nextChar, pressedKeys, layout, size = "compact" }: KeyboardGuideProps) {
  const [realtimePressedKeys, setRealtimePressedKeys] = useState<Set<string>>(new Set())
  const keys = keyboardLayouts[layout]

  // Listen for real keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      setRealtimePressedKeys((prev) => new Set([...prev, key]))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      setRealtimePressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const getKeyStyle = (key: string) => {
    const normalizedKey = key.toLowerCase()
    const normalizedCurrentChar = currentChar.toLowerCase()
    const normalizedNextChar = nextChar.toLowerCase()
    const finger = getFingerForKey(normalizedKey)
    const fingerColor = getFingerColor(finger)

    let className =
      "border transition-all duration-200 font-mono flex items-center justify-center rounded-lg backdrop-blur-sm relative overflow-hidden "

    // Currently pressed key
    if (realtimePressedKeys.has(normalizedKey) || realtimePressedKeys.has(key)) {
      className +=
        "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white scale-95 shadow-lg shadow-blue-500/30 text-glow "
    }
    // Next key to press
    else if (normalizedKey === normalizedNextChar || (normalizedNextChar === " " && key === "Space")) {
      className +=
        "bg-gradient-to-br from-yellow-400/50 to-orange-400/30 border-yellow-300/60 text-yellow-100 animate-pulse shadow-md shadow-yellow-500/30 text-glow-yellow "
    }
    // Current key (just typed)
    else if (normalizedKey === normalizedCurrentChar || (normalizedCurrentChar === " " && key === "Space")) {
      className +=
        "bg-gradient-to-br from-emerald-400/50 to-green-400/30 border-emerald-300/60 text-emerald-100 shadow-md shadow-emerald-500/30 text-glow-green "
    }
    // Default finger-based coloring
    else {
      className += `bg-gradient-to-br ${fingerColor} text-slate-200 hover:scale-105 `
    }

    return className
  }

  // Keyboard sizing variables
  const containerVars: React.CSSProperties = size === "compact"
    ? {
        // larger keys
        ['--vk' as any]: 'clamp(30px, 3.2vw, 46px)',
        ['--vkf' as any]: 'clamp(10px, 1.0vw, 14px)',
      }
    : {
        // smaller keys for expanded layout
        ['--vk' as any]: 'clamp(24px, 2.4vw, 38px)',
        ['--vkf' as any]: 'clamp(9px, 0.9vw, 13px)',
      }

  return (
    <Card
      className={cn(
        "keyboard-glass rounded-2xl mx-auto shadow-premium inline-block",
        "p-3 sm:p-4",
      )}
      style={{ width: "fit-content", maxWidth: "96vw" }}
    >
      <div className="mb-2 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded shadow-lg shadow-blue-500/30"></div>
            <span>Pressed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded animate-pulse shadow-lg shadow-yellow-500/30"></div>
            <span>Next</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-400 rounded shadow-lg shadow-emerald-500/30"></div>
            <span>Typed</span>
          </div>
        </div>
      </div>

      <div className="space-y-1" style={containerVars}>
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {rowIndex === 1 && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg border backdrop-blur-sm",
                  realtimePressedKeys.has("tab")
                    ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
                )}
                style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 1.6)', fontSize: 'var(--vkf)', paddingInline: 8 }}
              >
                Tab
              </div>
            )}

            {rowIndex === 2 && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg border backdrop-blur-sm",
                  realtimePressedKeys.has("capslock")
                    ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
                )}
                style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 1.8)', fontSize: 'var(--vkf)', paddingInline: 8 }}
              >
                Caps
              </div>
            )}

            {rowIndex === 3 && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg border backdrop-blur-sm",
                  realtimePressedKeys.has("shift")
                    ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
                )}
                style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 2.2)', fontSize: 'var(--vkf)', paddingInline: 10 }}
              >
                Shift
              </div>
            )}

            {row.map((key) => (
              <div key={key} className={getKeyStyle(key)} style={{ width: 'var(--vk)', height: 'var(--vk)', fontSize: 'var(--vkf)' }}>
                <span className="relative z-10">{key}</span>
              </div>
            ))}

            {rowIndex === 2 && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg border backdrop-blur-sm",
                  realtimePressedKeys.has("enter")
                    ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
                )}
                style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 2.0)', fontSize: 'var(--vkf)', paddingInline: 10 }}
              >
                Enter
              </div>
            )}

            {rowIndex === 3 && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg border backdrop-blur-sm",
                  realtimePressedKeys.has("shift")
                    ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
                )}
                style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 2.2)', fontSize: 'var(--vkf)', paddingInline: 10 }}
              >
                Shift
              </div>
            )}
          </div>
        ))}

        {/* Space bar row */}
        <div className="flex justify-center gap-1">
          <div
            className={cn(
              "flex items-center justify-center rounded-lg border backdrop-blur-sm",
              realtimePressedKeys.has("control")
                ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
            )}
            style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 1.4)', fontSize: 'var(--vkf)' }}
          >
            Ctrl
          </div>

          <div
            className={cn(
              "flex items-center justify-center rounded-lg border backdrop-blur-sm",
              realtimePressedKeys.has("alt")
                ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
            )}
            style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 1.4)', fontSize: 'var(--vkf)' }}
          >
            Alt
          </div>

          <div
            className={cn(
              "flex items-center justify-center rounded-lg border backdrop-blur-sm",
              getKeyStyle("Space"),
            )}
            style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 8.5)', fontSize: 'var(--vkf)' }}
          >
            <span className="relative z-10">Space</span>
          </div>

          <div
            className={cn(
              "flex items-center justify-center rounded-lg border backdrop-blur-sm",
              realtimePressedKeys.has("alt")
                ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
            )}
            style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 1.4)', fontSize: 'var(--vkf)' }}
          >
            Alt
          </div>

          <div
            className={cn(
              "flex items-center justify-center rounded-lg border backdrop-blur-sm",
              realtimePressedKeys.has("control")
                ? "bg-gradient-to-br from-blue-400/60 to-purple-500/40 border-blue-300/60 text-white shadow-lg shadow-blue-500/30"
                : "bg-gradient-to-br from-slate-700/40 to-slate-800/30 border-slate-600/40 text-slate-300",
            )}
            style={{ height: 'var(--vk)', minWidth: 'calc(var(--vk) * 1.4)', fontSize: 'var(--vkf)' }}
          >
            Ctrl
          </div>
        </div>
      </div>
    </Card>
  )
}
