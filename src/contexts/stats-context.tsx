"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface StatsData {
  totalDocuments: number
  totalChats: number
  totalSearches: number
  daysActive: number
}

interface StatsContextType {
  stats: StatsData
  updateStats: (updater: (prevStats: StatsData) => StatsData) => void
  refreshStats: () => Promise<void>
  isLoading: boolean
}

const StatsContext = createContext<StatsContextType | undefined>(undefined)

interface StatsProviderProps {
  children: ReactNode
  userId: string
}

export function StatsProvider({ children, userId }: StatsProviderProps) {
  const [stats, setStats] = useState<StatsData>({
    totalDocuments: 0,
    totalChats: 0,
    totalSearches: 0,
    daysActive: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch all stats from the server
  const fetchAllStats = async () => {
    if (!userId) return
    
    setIsLoading(true)
    try {
      // Fetch documents count
      const documentsResponse = await fetch("/api/documents")
      const documents = documentsResponse.ok ? await documentsResponse.json() : []
      
      // Fetch chats count
      const chatsResponse = await fetch("/api/chat/history")
      const chats = chatsResponse.ok ? await chatsResponse.json() : []
      
      // Calculate days active from user creation date
      const userResponse = await fetch("/api/user/profile")
      const userData = userResponse.ok ? await userResponse.json() : null
      const daysActive = userData?.createdAt 
        ? Math.ceil((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0
      
      setStats({
        totalDocuments: Array.isArray(documents) ? documents.length : 0,
        totalChats: Array.isArray(chats) ? chats.length : 0,
        totalSearches: 0, // We'll update this when searches are tracked
        daysActive,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update stats with a custom updater function
  const updateStats = (updater: (prevStats: StatsData) => StatsData) => {
    setStats(prevStats => updater(prevStats))
  }

  // Refresh all stats
  const refreshStats = async () => {
    await fetchAllStats()
  }

  // Initial fetch
  useEffect(() => {
    fetchAllStats()
  }, [userId])

  return (
    <StatsContext.Provider value={{ stats, updateStats, refreshStats, isLoading }}>
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const context = useContext(StatsContext)
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider")
  }
  return context
}