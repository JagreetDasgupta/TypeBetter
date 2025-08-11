"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy, Target, Clock, TrendingUp, Award, Edit3, Zap, Activity } from "lucide-react"
import { Analytics } from "@/components/analytics"
import { useHistory } from "@/hooks/use-history"

const mockProgressData = [
  { date: "2024-01-01", wpm: 45, accuracy: 92 },
  { date: "2024-01-02", wpm: 48, accuracy: 94 },
  { date: "2024-01-03", wpm: 52, accuracy: 93 },
  { date: "2024-01-04", wpm: 55, accuracy: 95 },
  { date: "2024-01-05", wpm: 58, accuracy: 96 },
  { date: "2024-01-06", wpm: 62, accuracy: 97 },
  { date: "2024-01-07", wpm: 65, accuracy: 98 },
]

const mockTestHistory = [
  { date: "2024-01-07", wpm: 65, accuracy: 98, duration: 60, mode: "Time" },
  { date: "2024-01-07", wpm: 62, accuracy: 96, duration: 120, mode: "Time" },
  { date: "2024-01-06", wpm: 68, accuracy: 97, duration: 60, mode: "Words" },
  { date: "2024-01-06", wpm: 59, accuracy: 95, duration: 180, mode: "Quote" },
  { date: "2024-01-05", wpm: 61, accuracy: 94, duration: 60, mode: "Time" },
]

const achievements = [
  { id: 1, name: "Speed Demon", description: "Reach 60 WPM", icon: "🚀", unlocked: true },
  { id: 2, name: "Accuracy Master", description: "Achieve 95% accuracy", icon: "🎯", unlocked: true },
  { id: 3, name: "Consistent Typer", description: "Complete 10 tests in a row", icon: "🔥", unlocked: true },
  { id: 4, name: "Marathon Runner", description: "Complete a 5-minute test", icon: "🏃", unlocked: false },
  { id: 5, name: "Perfectionist", description: "Achieve 100% accuracy", icon: "💎", unlocked: false },
  { id: 6, name: "Lightning Fast", description: "Reach 100 WPM", icon: "⚡", unlocked: false },
]

export function Dashboard() {
  const [selectedGoal, setSelectedGoal] = useState<"wpm" | "accuracy" | "consistency">("wpm")
  const { history, metrics } = useHistory()

  const m = metrics()

  const userStats = {
    totalTests: m.tests,
    averageWpm: m.avgWpm,
    bestWpm: m.bestWpm,
    averageAccuracy: m.avgAccuracy,
    bestAccuracy: Math.max(...(history.length ? history.map((h) => h.accuracy) : [0])),
    totalTimeTyping: Math.round(history.reduce((a, h) => a + h.durationSeconds, 0) / 60),
    currentStreak: 0,
    bestStreak: 0,
  }

  const goals = {
    wpm: { current: userStats.averageWpm, target: Math.max(50, userStats.averageWpm + 10), progress: (userStats.averageWpm / Math.max(50, userStats.averageWpm + 10)) * 100 },
    accuracy: { current: userStats.averageAccuracy, target: Math.min(100, Math.round(userStats.averageAccuracy + 3)), progress: (userStats.averageAccuracy / Math.min(100, Math.round(userStats.averageAccuracy + 3))) * 100 },
    consistency: { current: userStats.currentStreak, target: 7, progress: (userStats.currentStreak / 7) * 100 },
  }

  return (
    <div className="container mx-auto px-4 autoscale-stats overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, John!</h1>
              <p className="text-gray-400">Level 15 • Intermediate Typist</p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{userStats.averageWpm}</div>
              <div className="text-sm text-gray-400">Avg WPM</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{userStats.averageAccuracy}%</div>
              <div className="text-sm text-gray-400">Avg Accuracy</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{userStats.totalTests}</div>
              <div className="text-sm text-gray-400">Tests Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </CardContent>
          </Card>
        </div>

         <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
             <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Keep existing overview content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Progress Chart */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Progress Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProgressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                            }}
                          />
                          <Line type="monotone" dataKey="wpm" stroke="#3B82F6" strokeWidth={2} name="WPM" />
                          <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Test History */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(history.length ? history : mockTestHistory).slice(0, 10).map((test: any, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{test.mode || "Time"}</Badge>
                            <div>
                              <div className="font-semibold">
                                {test.wpm} WPM • {test.accuracy}% Accuracy
                              </div>
                              <div className="text-sm text-gray-400">
                                {test.date || new Date(test.timestamp).toLocaleString()} • {test.duration || test.durationSeconds}s
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - keep existing sidebar content */}
              <div className="space-y-8">
                {/* Goals */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Current Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs value={selectedGoal} onValueChange={(value) => setSelectedGoal(value as any)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="wpm">WPM</TabsTrigger>
                        <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                        <TabsTrigger value="consistency">Streak</TabsTrigger>
                      </TabsList>

                      <TabsContent value="wpm" className="space-y-3">
                        <div className="flex justify-between">
                          <span>Speed Goal</span>
                          <span>
                            {goals.wpm.current}/{goals.wpm.target} WPM
                          </span>
                        </div>
                        <Progress value={goals.wpm.progress} />
                      </TabsContent>

                      <TabsContent value="accuracy" className="space-y-3">
                        <div className="flex justify-between">
                          <span>Accuracy Goal</span>
                          <span>
                            {goals.accuracy.current}/{goals.accuracy.target}%
                          </span>
                        </div>
                        <Progress value={goals.accuracy.progress} />
                      </TabsContent>

                      <TabsContent value="consistency" className="space-y-3">
                        <div className="flex justify-between">
                          <span>Streak Goal</span>
                          <span>
                            {goals.consistency.current}/{goals.consistency.target} days
                          </span>
                        </div>
                        <Progress value={goals.consistency.progress} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-center space-x-3 p-2 rounded-lg ${
                            achievement.unlocked ? "bg-green-900/20" : "bg-gray-700/50"
                          }`}
                        >
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div
                              className={`font-semibold ${achievement.unlocked ? "text-green-400" : "text-gray-400"}`}
                            >
                              {achievement.name}
                            </div>
                            <div className="text-sm text-gray-500">{achievement.description}</div>
                          </div>
                          {achievement.unlocked && (
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              ✓
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Records */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Personal Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best WPM</span>
                      <span className="font-bold text-blue-400">{userStats.bestWpm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Accuracy</span>
                      <span className="font-bold text-green-400">{userStats.bestAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Longest Streak</span>
                      <span className="font-bold text-purple-400">{userStats.bestStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Time</span>
                      <span className="font-bold text-yellow-400">{Math.round(userStats.totalTimeTyping / 60)}h</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Recent Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center text-gray-400">No tests yet. Take a test to see your history.</div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                    {history.slice(0, 50).map((h) => (
                      <div key={h.id} className="grid grid-cols-6 items-center gap-3 p-3 bg-gray-700/40 rounded-lg">
                        <div className="col-span-2 truncate text-sm text-gray-300">{new Date(h.timestamp).toLocaleString()}</div>
                        <div className="text-blue-400 font-semibold">{h.wpm} WPM</div>
                        <div className="text-green-400 font-semibold">{h.accuracy}%</div>
                        <div className="text-purple-400 font-semibold">{h.adjustedWpm} adj</div>
                        <div className="text-gray-400 text-sm">{h.durationSeconds}s</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Goal Management</h3>
              <p className="text-gray-400">Advanced goal setting coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
