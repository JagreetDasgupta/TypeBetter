"use client"

import { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Keyboard, Palette, Volume2, Shield, Clock, Type, Quote } from "lucide-react"

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  testMode: "time" | "words" | "quote"
  setTestMode: (mode: "time" | "words" | "quote") => void
  testDuration: number
  setTestDuration: (duration: number) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  theme: string
  setTheme: (theme: string) => void
  focusMode: boolean
  setFocusMode: (enabled: boolean) => void
}

export function Settings({
  isOpen,
  onClose,
  testMode,
  setTestMode,
  testDuration,
  setTestDuration,
  soundEnabled,
  setSoundEnabled,
  theme,
  setTheme,
  focusMode,
  setFocusMode,
}: SettingsProps) {
  const [keyboardLayout, setKeyboardLayout] = useState("qwerty")
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [showWpm, setShowWpm] = useState(true)
  const [showAccuracy, setShowAccuracy] = useState(true)
  const [antiCheatEnabled, setAntiCheatEnabled] = useState(true)
  const [fontSize, setFontSize] = useState([18])
  const [caretStyle, setCaretStyle] = useState("line")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
            <TabsTrigger value="sound">Sound</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Test Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Test Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={testMode === "time" ? "default" : "outline"}
                      onClick={() => setTestMode("time")}
                      className="flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Time
                    </Button>
                    <Button
                      variant={testMode === "words" ? "default" : "outline"}
                      onClick={() => setTestMode("words")}
                      className="flex items-center gap-2"
                    >
                      <Type className="w-4 h-4" />
                      Words
                    </Button>
                    <Button
                      variant={testMode === "quote" ? "default" : "outline"}
                      onClick={() => setTestMode("quote")}
                      className="flex items-center gap-2"
                    >
                      <Quote className="w-4 h-4" />
                      Quote
                    </Button>
                  </div>
                </div>

                {testMode === "time" && (
                  <div className="space-y-3">
                    <Label>Duration (seconds)</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[15, 30, 60, 120].map((duration) => (
                        <Button
                          key={duration}
                          variant={testDuration === duration ? "default" : "outline"}
                          onClick={() => setTestDuration(duration)}
                          size="sm"
                        >
                          {duration}s
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {testMode === "words" && (
                  <div className="space-y-3">
                    <Label>Word Count</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 25, 50, 100].map((count) => (
                        <Button key={count} variant="outline" size="sm">
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="serika">Serika</SelectItem>
                      <SelectItem value="dracula">Dracula</SelectItem>
                      <SelectItem value="nord">Nord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Font Size</Label>
                  <div className="px-3">
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={32}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>12px</span>
                      <span>{fontSize[0]}px</span>
                      <span>32px</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Caret Style</Label>
                  <Select value={caretStyle} onValueChange={setCaretStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="underline">Underline</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Focus Mode</Label>
                    <div className="text-sm text-gray-400">Hide distracting elements</div>
                  </div>
                  <Switch checked={focusMode} onCheckedChange={setFocusMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Smooth Animations</Label>
                    <div className="text-sm text-gray-400">Enable smooth transitions</div>
                  </div>
                  <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keyboard" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  Keyboard Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Layout</Label>
                  <Select value={keyboardLayout} onValueChange={setKeyboardLayout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qwerty">QWERTY</SelectItem>
                      <SelectItem value="dvorak">Dvorak</SelectItem>
                      <SelectItem value="colemak">Colemak</SelectItem>
                      <SelectItem value="workman">Workman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Virtual Keyboard</Label>
                    <div className="text-sm text-gray-400">Display on-screen keyboard</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Key Highlighting</Label>
                    <div className="text-sm text-gray-400">Highlight pressed keys</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sound" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Sound Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <div className="text-sm text-gray-400">Enable typing sounds</div>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>

                <div className="space-y-3">
                  <Label>Sound Pack</Label>
                  <Select defaultValue="mechanical">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="typewriter">Typewriter</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Volume</Label>
                  <div className="px-3">
                    <Slider defaultValue={[50]} max={100} min={0} step={1} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Behavior & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anti-cheat Protection</Label>
                    <div className="text-sm text-gray-400">Detect suspicious behavior</div>
                  </div>
                  <Switch checked={antiCheatEnabled} onCheckedChange={setAntiCheatEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Live WPM</Label>
                    <div className="text-sm text-gray-400">Display WPM during test</div>
                  </div>
                  <Switch checked={showWpm} onCheckedChange={setShowWpm} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Live Accuracy</Label>
                    <div className="text-sm text-gray-400">Display accuracy during test</div>
                  </div>
                  <Switch checked={showAccuracy} onCheckedChange={setShowAccuracy} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-restart on Complete</Label>
                    <div className="text-sm text-gray-400">Automatically start new test</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Strict Space</Label>
                    <div className="text-sm text-gray-400">Require correct spaces</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
