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
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Test Results</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <Trophy className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-blue-400 mb-1">{animatedWpm}</div>
              <div className="text-gray-400">Words Per Minute</div>
              <Progress value={(animatedWpm / 100) * 100} className="mt-2" />
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-green-400 mb-1">{animatedAccuracy}%</div>
              <div className="text-gray-400">Accuracy</div>
              <Progress value={animatedAccuracy} className="mt-2" />
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-purple-400 mb-1">{stats.timeElapsed}s</div>
              <div className="text-gray-400">Time Elapsed</div>
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

          {/* Consistency Chart */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Typing Consistency</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consistencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.errors}</div>
              <div className="text-sm text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.streak}</div>
              <div className="text-sm text-gray-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{Math.round((stats.wpm * stats.accuracy) / 100)}</div>
              <div className="text-sm text-gray-400">Adjusted WPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">{Math.round((stats.timeElapsed / 60) * 100) / 100}</div>
              <div className="text-sm text-gray-400">Minutes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
