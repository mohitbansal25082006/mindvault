"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ForumPost, ForumCategory } from "@/types"
import {
  Search,
  Plus,
  MessageCircle,
  Heart,
  Eye,
  Pin,
  Lock,
  Filter,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { toast } from "sonner"

export function ForumHomepage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("latest")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchCategories()
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/forum/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        console.log("Categories loaded:", data) // Debug log
      } else {
        toast.error("Failed to load categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    }
  }

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      let url = "/api/forum/posts?"

      if (activeTab === "my") {
        url += "my=true&"
      } else if (activeTab === "popular") {
        url += "popular=true&"
      } else if (activeTab === "unanswered") {
        url += "unanswered=true&"
      }

      if (selectedCategory !== "all") {
        url += `categoryId=${selectedCategory}&`
      }

      url += `sort=${sortBy}`

      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`
      }

      console.log("Fetching posts from:", url) // Debug log

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
        console.log("Posts loaded:", data) // Debug log
      } else {
        toast.error("Failed to load posts")
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Failed to load posts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPosts()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setTimeout(fetchPosts, 100) // Small delay to ensure state is updated
  }

  const handleCategoryChange = (value: string) => {
    console.log("Category changed to:", value) // Debug log
    setSelectedCategory(value)
    setTimeout(fetchPosts, 100)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setTimeout(fetchPosts, 100)
  }

  const formatDateSafely = (dateString: string | undefined | null) => {
    if (!dateString) return "Unknown date"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return "Invalid date"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground mt-2">
            Connect, share, and learn with the MindVault community
          </p>
        </div>
        <Link href="/forum/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">324</p>
              <p className="text-sm text-muted-foreground">Forum Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,842</p>
              <p className="text-sm text-muted-foreground">Comments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forum posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Category:</span>

              {/* Improved Select styling so placeholder and selection are visible */}
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="min-w-[180px] bg-white/5 border border-white/10 text-white rounded-md h-10 px-3">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon && <span className="text-lg">{category.icon}</span>}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="min-w-[160px] bg-white/5 border border-white/10 text-white rounded-md h-10 px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          <TabsTrigger value="my">My Posts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={post.user.image || ""} />
                        <AvatarFallback>
                          {post.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                <Link
                                  href={`/forum/post/${post.id}`}
                                  className="hover:text-primary"
                                >
                                  {post.title}
                                </Link>
                              </h3>
                              {post.isPinned && <Pin className="h-4 w-4 text-red-500" />}
                              {post.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                              <span>by {post.user.name}</span>
                              <span>•</span>
                              <span>{formatDateSafely(post.createdAt)}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {post.category.name}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post._count.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{post._count.likes}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all" || activeTab !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Be the first to start a conversation!"
                  }
                </p>
                <Link href="/forum/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
