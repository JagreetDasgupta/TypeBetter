"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Keyboard, Trophy, BarChart3, Settings, User, LogOut, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentView: "typing" | "leaderboard" | "dashboard" | "settings"
  setCurrentView: (view: "typing" | "leaderboard" | "dashboard" | "settings") => void
  isAuthenticated: boolean
  setShowAuthModal: (show: boolean) => void
  setShowSettings: (show: boolean) => void
  isCompactMode?: boolean
}

export function Navigation({
  currentView,
  setCurrentView,
  isAuthenticated,
  setShowAuthModal,
  setShowSettings,
  isCompactMode = false,
}: NavigationProps) {
  const { signOut } = useAuth()
  return (
    <nav className={cn("glass-nav sticky top-0 z-50 nav-transition", isCompactMode && "compact-mode")}>
      <div className={cn("container mx-auto px-6 layout-transition", isCompactMode ? "py-2" : "py-3")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Keyboard
                  className={cn("text-blue-400 text-glow icon-transition", isCompactMode ? "w-5 h-5" : "w-6 h-6")}
                />
                <Sparkles
                  className={cn(
                    "text-purple-400 absolute animate-pulse icon-transition",
                    isCompactMode ? "w-2.5 h-2.5 -top-0.5 -right-0.5" : "w-3 h-3 -top-0.5 -right-0.5",
                  )}
                />
              </div>
              <span
                className={cn(
                  "font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-size-transition text-glow",
                  isCompactMode ? "text-base" : "text-xl",
                )}
              >
                TypeMaster Pro
              </span>
            </div>

            <div className="hidden md:flex space-x-2">
              <Button
                variant={currentView === "typing" ? "default" : "ghost"}
                onClick={() => setCurrentView("typing")}
                className={cn(
                  "glass-button rounded-lg flex items-center space-x-2 text-sm layout-transition",
                  isCompactMode ? "px-3 py-1" : "px-4 py-1.5",
                  currentView === "typing" ? "bg-blue-500/20 border-blue-400/40" : "",
                )}
              >
                <Keyboard className={cn("icon-transition", isCompactMode ? "w-3 h-3" : "w-3.5 h-3.5")} />
                <span>Practice</span>
              </Button>

              

              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                onClick={() => setCurrentView("dashboard")}
                className={cn(
                  "glass-button rounded-lg flex items-center space-x-2 text-sm layout-transition",
                  isCompactMode ? "px-3 py-1" : "px-4 py-1.5",
                  currentView === "dashboard" ? "bg-blue-500/20 border-blue-400/40" : "",
                )}
              >
                <BarChart3 className={cn("icon-transition", isCompactMode ? "w-3 h-3" : "w-3.5 h-3.5")} />
                <span>Dashboard</span>
              </Button>

              <Button
                variant={currentView === "leaderboard" ? "default" : "ghost"}
                onClick={() => setCurrentView("leaderboard")}
                className={cn(
                  "glass-button rounded-lg flex items-center space-x-2 text-sm layout-transition",
                  isCompactMode ? "px-3 py-1" : "px-4 py-1.5",
                  currentView === "leaderboard" ? "bg-blue-500/20 border-blue-400/40" : "",
                )}
              >
                <Trophy className={cn("icon-transition", isCompactMode ? "w-3 h-3" : "w-3.5 h-3.5")} />
                <span>Leaderboard</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className={cn("glass-button rounded-lg layout-transition", isCompactMode ? "w-7 h-7" : "w-8 h-8")}
            >
              <Settings className={cn("icon-transition", isCompactMode ? "w-3 h-3" : "w-3.5 h-3.5")} />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative rounded-lg glass-button layout-transition",
                      isCompactMode ? "h-7 w-7" : "h-8 w-8",
                    )}
                  >
                    <Avatar className={cn("layout-transition", isCompactMode ? "h-5 w-5" : "h-6 w-6")}>
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback
                        className={cn(
                          "bg-gradient-to-br from-blue-500 to-purple-500 text-white text-size-transition",
                          isCompactMode ? "text-xs" : "text-xs",
                        )}
                      >
                        U
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 modal-glass rounded-xl border-blue-500/20" align="end">
                  <DropdownMenuItem
                    onClick={() => setCurrentView("dashboard")}
                    className="rounded-lg hover:bg-blue-500/10"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)} className="rounded-lg hover:bg-blue-500/10">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-red-500/10 text-red-300" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className={cn(
                  "glass-button rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 text-sm layout-transition",
                  isCompactMode ? "px-3 py-1" : "px-4 py-1.5",
                )}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
