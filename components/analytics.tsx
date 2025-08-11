"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Activity, TrendingUp, Target, Clock, Zap, Hand, Eye, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeystrokeData {
  key: string
  count: number
  accuracy: number
  avgSpeed: number
  finger: string
  errors: number
}

interface FingerUsage {
  finger: string
  usage: number
  accuracy: number
  speed: number
  color: string
}

interface TypingPattern {
  time: number
  wpm: number
  accuracy: number
  keystroke: string
  delay: number
}

interface HeatmapData {
  key: string
  value: number
  x: number
  y: number
  finger: string
}

const mockKeystrokeData: KeystrokeData[] = [
  { key: "a", count: 145, accuracy: 98.5, avgSpeed: 120, finger: "left-pinky", errors: 2 },
  { key: "s", count: 132, accuracy: 96.2, avgSpeed: 135, finger: "left-ring", errors: 5 },
  { key: "d", count: 128, accuracy: 97.8, avgSpeed: 142, finger: "left-middle", errors: 3 },
  { key: "f", count: 156, accuracy: 99.1, avgSpeed: 138, finger: "left-index", errors: 1 },
  { key: "g", count: 89, accuracy: 94.3, avgSpeed: 125, finger: "left-index", errors: 5 },
  { key: "h", count: 112, accuracy: 96.8, avgSpeed: 140, finger: "right-index", errors: 4 },
  { key: "j", count: 98, accuracy: 95.5, avgSpeed: 132, finger: "right-index", errors: 4 },
  { key: "k", count: 87, accuracy: 97.2, avgSpeed: 128, finger: "right-middle", errors: 2 },
  { key: "l", count: 134, accuracy: 98.8, avgSpeed: 145, finger: "right-ring", errors: 2 },
  { key: ";", count: 45, accuracy: 92.1, avgSpeed: 115, finger: "right-pinky", errors: 4 },
  { key: "space", count: 234, accuracy: 99.5, avgSpeed: 150, finger: "thumb", errors: 1 },
]

const fingerUsageData: FingerUsage[] = [
  { finger: "Left Pinky", usage: 12.5, accuracy: 94.2, speed: 118, color: "#ef4444" },
  { finger: "Left Ring", usage: 15.8, accuracy: 96.1, speed: 125, color: "#f97316" },
  { finger: "Left Middle", usage: 18.2, accuracy: 97.5, speed: 132, color: "#eab308" },
  { finger: "Left Index", usage: 22.1, accuracy: 98.2, speed: 138, color: "#22c55e" },
  { finger: "Right Index", usage: 20.8, accuracy: 97.8, speed: 135, color: "#06b6d4" },
  { finger: "Right Middle", usage: 16.4, accuracy: 96.9, speed: 128, color: "#3b82f6" },
  { finger: "Right Ring", usage: 13.7, accuracy: 95.8, speed: 122, color: "#8b5cf6" },
  { finger: "Right Pinky", usage: 8.9, accuracy: 93.5, speed: 115, color: "#ec4899" },
  { finger: "Thumbs", usage: 11.6, accuracy: 99.1, speed: 145, color: "#10b981" },
]

const mockTypingPatterns: TypingPattern[] = Array.from({ length: 100 }, (_, i) => ({
  time: i,
  wpm: 60 + Math.sin(i / 10) * 15 + Math.random() * 10,
  accuracy: 95 + Math.sin(i / 8) * 3 + Math.random() * 2,
  keystroke: String.fromCharCode(97 + (i % 26)),
  delay: 80 + Math.random() * 40,
}))

const keyboardLayout = [
  [
    { key: "`", x: 0, y: 0 },
    { key: "1", x: 1, y: 0 },
    { key: "2", x: 2, y: 0 },
    { key: "3", x: 3, y: 0 },
    { key: "4", x: 4, y: 0 },
    { key: "5", x: 5, y: 0 },
    { key: "6", x: 6, y: 0 },
    { key: "7", x: 7, y: 0 },
    { key: "8", x: 8, y: 0 },
    { key: "9", x: 9, y: 0 },
    { key: "0", x: 10, y: 0 },
    { key: "-", x: 11, y: 0 },
    { key: "=", x: 12, y: 0 },
  ],
  [
    { key: "q", x: 0.5, y: 1 },
    { key: "w", x: 1.5, y: 1 },
    { key: "e", x: 2.5, y: 1 },
    { key: "r", x: 3.5, y: 1 },
    { key: "t", x: 4.5, y: 1 },
    { key: "y", x: 5.5, y: 1 },
    { key: "u", x: 6.5, y: 1 },
    { key: "i", x: 7.5, y: 1 },
    { key: "o", x: 8.5, y: 1 },
    { key: "p", x: 9.5, y: 1 },
    { key: "[", x: 10.5, y: 1 },
    { key: "]", x: 11.5, y: 1 },
  ],
  [
    { key: "a", x: 0.75, y: 2 },
    { key: "s", x: 1.75, y: 2 },
    { key: "d", x: 2.75, y: 2 },
    { key: "f", x: 3.75, y: 2 },
    { key: "g", x: 4.75, y: 2 },
    { key: "h", x: 5.75, y: 2 },
    { key: "j", x: 6.75, y: 2 },
    { key: "k", x: 7.75, y: 2 },
    { key: "l", x: 8.75, y: 2 },
    { key: ";", x: 9.75, y: 2 },
    { key: "'", x: 10.75, y: 2 },
  ],
  [
    { key: "z", x: 1.25, y: 3 },
    { key: "x", x: 2.25, y: 3 },
    { key: "c", x: 3.25, y: 3 },
    { key: "v", x: 4.25, y: 3 },
    { key: "b", x: 5.25, y: 3 },
    { key: "n", x: 6.25, y: 3 },
    { key: "m", x: 7.25, y: 3 },
    { key: ",", x: 8.25, y: 3 },
    { key: ".", x: 9.25, y: 3 },
    { key: "/", x: 10.25, y: 3 },
  ],
]

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
    space: "thumb",
  }
  return fingerMap[key] || "unknown"
}

const getHeatmapIntensity = (count: number, maxCount: number): number => {
  return (count / maxCount) * 100
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "all">("week")
  const [selectedMetric, setSelectedMetric] = useState<"speed" | "accuracy" | "usage">("usage")

  const maxKeystrokeCount = Math.max(...mockKeystrokeData.map((k) => k.count))

  const heatmapData: HeatmapData[] = keyboardLayout.flat().map((keyPos) => {
    const keystrokeData = mockKeystrokeData.find((k) => k.key === keyPos.key)
    return {
      key: keyPos.key,
      value: keystrokeData ? getHeatmapIntensity(keystrokeData.count, maxKeystrokeCount) : 0,
      x: keyPos.x,
      y: keyPos.y,
      finger: getFingerForKey(keyPos.key),
    }
  })

  const getKeyColor = (intensity: number, finger: string): string => {
    const fingerColors: { [key: string]: string } = {
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

    const baseColor = fingerColors[finger] || "#6b7280"
    const opacity = Math.max(0.1, intensity / 100)

    return `${baseColor}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`
  }

  // Use non-mutating sorts (clone first) because module-level arrays may be frozen in dev/runtime
  const weakestFingers = [...fingerUsageData].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3)

  const strongestFingers = [...fingerUsageData].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3)

  const problemKeys = [...mockKeystrokeData].sort((a, b) => b.errors - a.errors).slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Typing Analytics</h1>
            <p className="text-gray-400">Detailed insights into your typing performance</p>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="heatmap">Keyboard Heatmap</TabsTrigger>
            <TabsTrigger value="fingers">Finger Analysis</TabsTrigger>
            <TabsTrigger value="patterns">Typing Patterns</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Keystroke Heatmap
                  </CardTitle>
                  <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usage">Usage</SelectItem>
                      <SelectItem value="speed">Speed</SelectItem>
                      <SelectItem value="accuracy">Accuracy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <svg viewBox="0 0 13 4" className="w-full max-w-4xl mx-auto h-64">
                    {heatmapData.map((key) => (
                      <g key={key.key}>
                        <rect
                          x={key.x}
                          y={key.y}
                          width="0.9"
                          height="0.8"
                          rx="0.1"
                          fill={getKeyColor(key.value, key.finger)}
                          stroke="#374151"
                          strokeWidth="0.02"
                          className="transition-all duration-200 hover:stroke-white"
                        />
                        <text
                          x={key.x + 0.45}
                          y={key.y + 0.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white font-mono"
                          style={{ fontSize: "0.12px" }}
                        >
                          {key.key === "space" ? "␣" : key.key}
                        </text>
                      </g>
                    ))}
                  </svg>

                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">Less used</span>
                      <div className="flex gap-1">
                        {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                          <div
                            key={opacity}
                            className="w-4 h-4 rounded"
                            style={{
                              backgroundColor: `#3b82f6${Math.round(opacity * 255)
                                .toString(16)
                                .padStart(2, "0")}`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400">More used</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Most Used Keys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockKeystrokeData
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)
                      .map((key, index) => (
                        <div key={key.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="w-8 h-8 rounded flex items-center justify-center font-mono"
                            >
                              {key.key === "space" ? "␣" : key.key}
                            </Badge>
                            <span className="text-sm text-gray-400">#{index + 1}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{key.count}</div>
                            <div className="text-xs text-gray-400">{key.accuracy}%</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Fastest Keys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockKeystrokeData
                      .sort((a, b) => b.avgSpeed - a.avgSpeed)
                      .slice(0, 5)
                      .map((key, index) => (
                        <div key={key.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="w-8 h-8 rounded flex items-center justify-center font-mono"
                            >
                              {key.key === "space" ? "␣" : key.key}
                            </Badge>
                            <span className="text-sm text-gray-400">#{index + 1}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-400">{key.avgSpeed}ms</div>
                            <div className="text-xs text-gray-400">{key.accuracy}%</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Problem Keys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {problemKeys.map((key, index) => (
                      <div key={key.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="destructive"
                            className="w-8 h-8 rounded flex items-center justify-center font-mono"
                          >
                            {key.key === "space" ? "␣" : key.key}
                          </Badge>
                          <span className="text-sm text-gray-400">#{index + 1}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-400">{key.errors} errors</div>
                          <div className="text-xs text-gray-400">{key.accuracy}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fingers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hand className="w-5 h-5" />
                    Finger Usage Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fingerUsageData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="usage"
                          label={({ finger, usage }) => `${finger.split(" ")[1]}: ${usage}%`}
                        >
                          {fingerUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Finger Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fingerUsageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="finger"
                          stroke="#9CA3AF"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="accuracy" fill="#3B82F6" name="Accuracy %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-red-400">Weakest Fingers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weakestFingers.map((finger, index) => (
                      <div key={finger.finger} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{finger.finger}</span>
                          <Badge variant="destructive">{finger.accuracy}%</Badge>
                        </div>
                        <Progress value={finger.accuracy} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{finger.usage}% usage</span>
                          <span>{finger.speed}ms avg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-green-400">Strongest Fingers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strongestFingers.map((finger, index) => (
                      <div key={finger.finger} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{finger.finger}</span>
                          <Badge className="bg-green-600">{finger.accuracy}%</Badge>
                        </div>
                        <Progress value={finger.accuracy} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{finger.usage}% usage</span>
                          <span>{finger.speed}ms avg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Typing Speed Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockTypingPatterns}>
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
                      <Line type="monotone" dataKey="wpm" stroke="#3B82F6" strokeWidth={2} dot={false} name="WPM" />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        name="Accuracy %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Keystroke Timing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockTypingPatterns.slice(0, 20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="keystroke" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="delay" fill="#8B5CF6" name="Delay (ms)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Rhythm Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Average Keystroke Delay</span>
                      <span className="font-semibold">95ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Consistency Score</span>
                      <Badge className="bg-blue-600">87%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Rhythm Stability</span>
                      <Badge className="bg-green-600">Good</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Peak Performance Time</span>
                      <span className="font-semibold">2:30 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Fatigue Point</span>
                      <span className="font-semibold">After 15 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Zap className="w-5 h-5" />
                    Speed Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-300">
                    Your typing speed peaks during afternoon sessions. Consider scheduling important typing tasks
                    between 2-4 PM.
                  </div>
                  <Badge className="bg-blue-600">+12% faster in afternoon</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Target className="w-5 h-5" />
                    Accuracy Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-300">
                    Your left pinky shows the most errors. Focus on 'a', 'q', and 'z' key practice to improve overall
                    accuracy.
                  </div>
                  <Badge className="bg-green-600">Focus on left pinky</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Brain className="w-5 h-5" />
                    Learning Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-300">
                    You show consistent improvement in muscle memory. Your keystroke timing has become 15% more
                    consistent this week.
                  </div>
                  <Badge className="bg-purple-600">+15% consistency</Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-yellow-400">Areas for Improvement</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Left Pinky Strength</div>
                          <div className="text-sm text-gray-400">Practice 'a', 'q', 'z' keys for 10 minutes daily</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Number Row Accuracy</div>
                          <div className="text-sm text-gray-400">Focus on number typing exercises</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Rhythm Consistency</div>
                          <div className="text-sm text-gray-400">Use metronome-based typing exercises</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-green-400">Strengths to Maintain</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Space Bar Accuracy</div>
                          <div className="text-sm text-gray-400">Excellent thumb coordination</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Home Row Mastery</div>
                          <div className="text-sm text-gray-400">Strong foundation in touch typing</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Learning Progression</div>
                          <div className="text-sm text-gray-400">Consistent week-over-week improvement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-400">75 WPM</div>
                    <div className="text-sm text-gray-400">Current: 68 WPM</div>
                    <Progress value={90.7} className="mt-3" />
                    <div className="text-xs text-gray-500">90.7% complete</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Practice Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-400">12 Days</div>
                    <div className="text-sm text-gray-400">Personal best: 28 days</div>
                    <div className="flex justify-center gap-1 mt-3">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={cn("w-3 h-3 rounded-full", i < 5 ? "bg-green-400" : "bg-gray-600")} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Next Milestone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-purple-400">80 WPM</div>
                    <div className="text-sm text-gray-400">Advanced Typist</div>
                    <div className="text-xs text-gray-500 mt-3">Estimated: 2-3 weeks with current progress</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
