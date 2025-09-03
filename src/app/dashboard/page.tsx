"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Document } from "@/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Clock, 
  MessageSquare,
  Search,
  Brain
} from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecentDocuments()
  }, [])

  const fetchRecentDocuments = async () => {
    try {
      const response = await fetch("/api/documents")
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.slice(0, 5)) // Get 5 most recent
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const recentDocuments = documents.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here&apos;s what&apos;s happening in your knowledge vault today.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/documents/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats 
          totalDocuments={documents.length}
          totalChats={0}
          totalSearches={0}
        />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-medium">Recent Documents</CardTitle>
              <Link href="/documents">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentDocuments.length > 0 ? (
                <div className="space-y-4">
                  {recentDocuments.map((document) => (
                    <div key={document.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{document.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {document.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No documents yet</p>
                  <Link href="/documents/new">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first document
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              <CardDescription>
                Jumpstart your productivity with these actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Link href="/documents/new">
                  <Button className="w-full justify-start gap-3 h-12" variant="outline">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Create Document</p>
                      <p className="text-xs text-muted-foreground">Start writing a new document</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/chat">
                  <Button className="w-full justify-start gap-3 h-12" variant="outline">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10">
                      <Brain className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Ask AI</p>
                      <p className="text-xs text-muted-foreground">Chat with your knowledge</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/search">
                  <Button className="w-full justify-start gap-3 h-12" variant="outline">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Smart Search</p>
                      <p className="text-xs text-muted-foreground">Find information quickly</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Activity Overview</CardTitle>
            <CardDescription>Your knowledge vault activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Documents Created</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">AI Conversations</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Search className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Searches Performed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
