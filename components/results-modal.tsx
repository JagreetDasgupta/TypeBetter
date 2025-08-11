"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy, Target, Clock, AlertTriangle, RotateCcw, Share2 } from "lucide-react"

interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  stats: {
    wpm: number
    accuracy: number
    streak: number
    errors: number
    timeElapsed: number
  }
  onRetry: () => void
  isDisqualified: boolean
  antiCheatFlags: {
    fastKeys: boolean
    mouseMovement: boolean
    tabSwitch: boolean
  }
}

export function ResultsModal({ isOpen, onClose, stats, onRetry, isDisqualified, antiCheatFlags }: ResultsModalProps) {
  const [animatedWpm, setAnimatedWpm] = useState(0)
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0)

  // Animate counters
  useEffect(() => {
    if (isOpen) {
      const wpmInterval = setInterval(() => {
        setAnimatedWpm((prev) => {
          const next = prev + Math.ceil(stats.wpm / 20)
          return next >= stats.wpm ? stats.wpm : next
        })
      }, 50)

      const accuracyInterval = setInterval(() => {
        setAnimatedAccuracy((prev) => {
          const next = prev + Math.ceil(stats.accuracy / 20)
          return next >= stats.accuracy ? stats.accuracy : next
        })
      }, 50)

      return () => {
        clearInterval(wpmInterval)
        clearInterval(accuracyInterval)
      }
    } else {
      setAnimatedWpm(0)
      setAnimatedAccuracy(0)
    }
  }, [isOpen, stats.wpm, stats.accuracy])

  // Mock consistency data
  const consistencyData = Array.from({ length: 10 }, (_, i) => ({
    time: i * 6,
    wpm: stats.wpm + (Math.random() - 0.5) * 20,
  }))

  const getPerformanceRating = () => {
    if (isDisqualified) return { rating: "Disqualified", color: "text-red-400" }
    if (stats.wpm >= 80) return { rating: "Excellent", color: "text-green-400" }
    if (stats.wpm >= 60) return { rating: "Good", color: "text-blue-400" }
    if (stats.wpm >= 40) return { rating: "Average", color: "text-yellow-400" }
    return { rating: "Needs Practice", color: "text-orange-400" }
  }

  const performance = getPerformanceRating()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-900 border-gray-700 text-white max-h-[80vh] w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Test Results</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
          {/* Performance Rating */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${performance.color}`}>{performance.rating}</div>
            {isDisqualified && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Test flagged by anti-cheat system</span>
              </div>
            )}
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 autoscale-stats">
            <Card className="bg-gray-800 border-gray-700 p-3 text-center">
              <Trophy className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-400 mb-1">{animatedWpm}</div>
              <div className="text-xs text-gray-400">Words Per Minute</div>
              <Progress value={(animatedWpm / 100) * 100} className="mt-1 h-1" />
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-3 text-center">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-400 mb-1">{animatedAccuracy}%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
              <Progress value={animatedAccuracy} className="mt-1 h-1" />
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-3 text-center">
              <Clock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-400 mb-1">{stats.timeElapsed}s</div>
              <div className="text-xs text-gray-400">Time Elapsed</div>
            </Card>
          </div>

          {/* Anti-cheat Flags */}
          {isDisqualified && (
            <Card className="bg-red-900/20 border-red-700 p-4">
              <div className="text-red-400 font-semibold mb-2">Anti-cheat Violations:</div>
              <div className="space-y-1">
                {antiCheatFlags.fastKeys && <Badge variant="destructive">Fast key presses detected</Badge>}
                {antiCheatFlags.mouseMovement && <Badge variant="destructive">Mouse movement during test</Badge>}
                {antiCheatFlags.tabSwitch && <Badge variant="destructive">Tab switching detected</Badge>}
              </div>
            </Card>
          )}

          {/* Consistency Chart - Hidden on small screens */}
          <Card className="bg-gray-800 border-gray-700 p-3 hidden md:block">
            <h3 className="text-sm font-semibold mb-2">Typing Consistency</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consistencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                  <YAxis stroke="#9CA3AF" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 autoscale-stats">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">{stats.errors}</div>
              <div className="text-xs text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{Math.max(stats.streak, 1)}</div>
              <div className="text-xs text-gray-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cyan-400">{Math.round((stats.wpm * stats.accuracy) / 100) || stats.wpm}</div>
              <div className="text-xs text-gray-400">Adjusted WPM</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-pink-400">{Math.round((stats.timeElapsed / 60) * 100) / 100}</div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
          </div>

        </div>
        
        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-3 border-t border-gray-700 mt-3">
          <Button onClick={onRetry} className="flex items-center gap-2 text-sm px-3 py-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent text-sm px-3 py-2"
            onClick={async () => {
              const summary = `Typing Test Results\nWPM: ${stats.wpm}\nAccuracy: ${stats.accuracy}%\nErrors: ${stats.errors}\nTime: ${stats.timeElapsed}s${isDisqualified ? "\nStatus: Disqualified (anti-cheat)" : ""}`
              try {
                await navigator.clipboard.writeText(summary)
              } catch (e) {
                // ignore clipboard errors
              }
            }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="ghost" onClick={onClose} className="text-sm px-3 py-2">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
