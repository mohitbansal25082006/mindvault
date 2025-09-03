"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Search, Calendar } from "lucide-react"

interface StatsProps {
  totalDocuments: number
  totalChats: number
  totalSearches: number
}

export function DashboardStats({ totalDocuments, totalChats, totalSearches }: StatsProps) {
  const stats = [
    {
      title: "Total Documents",
      value: totalDocuments,
      icon: FileText,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "AI Conversations",
      value: totalChats,
      icon: MessageSquare,
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Searches",
      value: totalSearches,
      icon: Search,
      change: "+23%",
      changeType: "positive"
    },
    {
      title: "Days Active",
      value: 12,
      icon: Calendar,
      change: "+2 days",
      changeType: "neutral"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
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