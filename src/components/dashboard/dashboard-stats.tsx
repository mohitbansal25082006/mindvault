"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Search, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { useStats } from "@/contexts/stats-context"

interface StatsProps {
  // Keep props for backward compatibility
  totalDocuments?: number
  totalChats?: number
  totalSearches?: number
}

export function DashboardStats({ totalDocuments, totalChats, totalSearches }: StatsProps) {
  const { stats, isLoading } = useStats()

  // Use context stats if available, otherwise fall back to props
  const documents = stats.totalDocuments || totalDocuments || 0
  const chats = stats.totalChats || totalChats || 0
  const searches = stats.totalSearches || totalSearches || 0
  const daysActive = stats.daysActive || 0

  const statsData = [
    {
      title: "Total Documents",
      value: documents,
      icon: FileText,
      change: documents > 0 ? "+12%" : "0%",
      changeType: documents > 0 ? "positive" : "neutral" as const
    },
    {
      title: "AI Conversations",
      value: chats,
      icon: MessageSquare,
      change: chats > 0 ? "+8%" : "0%",
      changeType: chats > 0 ? "positive" : "neutral" as const
    },
    {
      title: "Searches",
      value: searches,
      icon: Search,
      change: searches > 0 ? "+23%" : "0%",
      changeType: searches > 0 ? "positive" : "neutral" as const
    },
    {
      title: "Days Active",
      value: daysActive,
      icon: Calendar,
      change: daysActive > 0 ? `+${daysActive} days` : "0 days",
      changeType: "neutral" as const
    }
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div className="text-xs">
                <div className="h-4 bg-muted rounded w-20 animate-pulse mt-1"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' 
                  ? 'text-green-500' 
                  : stat.changeType === 'negative' 
                  ? 'text-red-500' 
                  : 'text-muted-foreground'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}