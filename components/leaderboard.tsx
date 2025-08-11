"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Calendar, Clock, Infinity } from "lucide-react"
import { useHistory } from "@/hooks/use-history"

interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  wpm: number
  accuracy: number
  score: number
  tests: number
  country: string
}

const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: "SpeedDemon", avatar: "", wpm: 142, accuracy: 98.5, score: 139.8, tests: 1247, country: "US" },
  { rank: 2, username: "KeyboardNinja", avatar: "", wpm: 138, accuracy: 97.2, score: 134.1, tests: 892, country: "CA" },
  { rank: 3, username: "TypeMaster", avatar: "", wpm: 135, accuracy: 99.1, score: 133.8, tests: 2156, country: "UK" },
  { rank: 4, username: "FastFingers", avatar: "", wpm: 132, accuracy: 96.8, score: 127.8, tests: 567, country: "DE" },
  { rank: 5, username: "QuickType", avatar: "", wpm: 129, accuracy: 98.2, score: 126.7, tests: 1034, country: "JP" },
  { rank: 6, username: "RapidTyper", avatar: "", wpm: 127, accuracy: 97.5, score: 123.8, tests: 789, country: "AU" },
  { rank: 7, username: "SwiftKeys", avatar: "", wpm: 125, accuracy: 96.9, score: 121.1, tests: 445, country: "FR" },
  {
    rank: 8,
    username: "LightningType",
    avatar: "",
    wpm: 123,
    accuracy: 98.7,
    score: 121.4,
    tests: 1567,
    country: "BR",
  },
  { rank: 9, username: "FlashTyper", avatar: "", wpm: 121, accuracy: 97.1, score: 117.5, tests: 623, country: "IN" },
  { rank: 10, username: "TurboKeys", avatar: "", wpm: 119, accuracy: 96.3, score: 114.6, tests: 891, country: "KR" },
]

export function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<"daily" | "weekly" | "all-time">("all-time")
  const [activeTab, setActiveTab] = useState("combined")
  const { history } = useHistory()

  const localTop = useMemo(() => {
    return history
      .slice()
      .sort((a, b) => b.adjustedWpm - a.adjustedWpm)
      .slice(0, 10)
      .map((h, idx) => ({
        rank: idx + 1,
        username: "You",
        avatar: "",
        wpm: h.wpm,
        accuracy: h.accuracy,
        score: h.adjustedWpm,
        tests: history.length,
        country: "IN",
      }))
  }, [history])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>
    }
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      US: "🇺🇸",
      CA: "🇨🇦",
      UK: "🇬🇧",
      DE: "🇩🇪",
      JP: "🇯🇵",
      AU: "🇦🇺",
      FR: "🇫🇷",
      BR: "🇧🇷",
      IN: "🇮🇳",
      KR: "🇰🇷",
    }
    return flags[country] || "🌍"
  }

  const sortedData = [...(localTop.length ? localTop : mockLeaderboardData)].sort((a, b) => {
    switch (activeTab) {
      case "wpm":
        return b.wpm - a.wpm
      case "accuracy":
        return b.accuracy - a.accuracy
      default:
        return b.score - a.score
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Global Leaderboard</h1>
          <p className="text-gray-400">Compete with typists from around the world</p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <Button
              variant={timeFilter === "daily" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFilter("daily")}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Daily
            </Button>
            <Button
              variant={timeFilter === "weekly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFilter("weekly")}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Weekly
            </Button>
            <Button
              variant={timeFilter === "all-time" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFilter("all-time")}
              className="flex items-center gap-2"
            >
              <Infinity className="w-4 h-4" />
              All Time
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="combined">Combined Score</TabsTrigger>
            <TabsTrigger value="wpm">WPM</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          </TabsList>

          <TabsContent value="combined" className="mt-6">
            <LeaderboardTable data={sortedData} metric="score" />
          </TabsContent>

          <TabsContent value="wpm" className="mt-6">
            <LeaderboardTable data={sortedData} metric="wpm" />
          </TabsContent>

          <TabsContent value="accuracy" className="mt-6">
            <LeaderboardTable data={sortedData} metric="accuracy" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[]
  metric: "score" | "wpm" | "accuracy"
}

function LeaderboardTable({ data, metric }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>
    }
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      US: "🇺🇸",
      CA: "🇨🇦",
      UK: "🇬🇧",
      DE: "🇩🇪",
      JP: "🇯🇵",
      AU: "🇦🇺",
      FR: "🇫🇷",
      BR: "🇧🇷",
      IN: "🇮🇳",
      KR: "🇰🇷",
    }
    return flags[country] || "🌍"
  }

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (metric) {
      case "wpm":
        return `${entry.wpm} WPM`
      case "accuracy":
        return `${entry.accuracy}%`
      default:
        return entry.score.toFixed(1)
    }
  }

  return (
    <div className="space-y-2">
      {data.map((entry, index) => (
        <Card key={`${entry.username}-${entry.rank}-${index}`} className="bg-gray-800 border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRankIcon(entry.rank)}
                <span className="text-2xl">{getCountryFlag(entry.country)}</span>
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.username} />
                <AvatarFallback>{entry.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div>
                <div className="font-semibold">{entry.username}</div>
                <div className="text-sm text-gray-400">{entry.tests} tests completed</div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">WPM</div>
                <div className="font-bold text-blue-400">{entry.wpm}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">Accuracy</div>
                <div className="font-bold text-green-400">{entry.accuracy}%</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">Score</div>
                <div className="font-bold text-purple-400">{entry.score.toFixed(1)}</div>
              </div>

              <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                {getMetricValue(entry)}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
