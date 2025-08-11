"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"

export interface UserProfile {
  username: string
  avatarUrl?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
}

const DEFAULT_AUTH: AuthState = {
  isAuthenticated: false,
  user: null,
}

export function useAuth() {
  const [auth, setAuth] = useLocalStorage<AuthState>("tp_auth", DEFAULT_AUTH)

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    signIn(username: string, avatarUrl?: string) {
      setAuth({ isAuthenticated: true, user: { username, avatarUrl } })
    },
    async signOut() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.log('Logout error:', error)
      }
      setAuth(DEFAULT_AUTH)
    },
    continueAsGuest() {
      setAuth({ isAuthenticated: true, user: { username: "Guest" } })
    },
  }
}


