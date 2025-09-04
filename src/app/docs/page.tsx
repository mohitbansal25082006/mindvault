import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, BookOpen, FileText, Users, Settings, MessageSquare, Brain, ChevronRight, Star, Clock } from "lucide-react"
import { useState } from "react"

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const documentation = [
    {
      category: "Getting Started",
      icon: BookOpen,
      color: "text-indigo-400",
      articles: [
        {
          title: "Introduction to MindVault",
          description: "Learn about MindVault and its core concepts",
          slug: "introduction",
          time: "5 min read"
        },
        {
          title: "Setting Up Your Account",
          description: "Create and configure your MindVault account",
          slug: "setting-up-account",
          time: "3 min read"
        },
        {
          title: "Uploading Your First Document",
          description: "Learn how to upload and organize your documents",
          slug: "uploading-documents",
          time: "7 min read"
        }
      ]
    },
    {
      category: "Core Features",
      icon: Brain,
      color: "text-purple-400",
      articles: [
        {
          title: "AI Chat Assistant",
          description: "How to use the AI chat to interact with your knowledge",
          slug: "ai-chat-assistant",
          time: "8 min read"
        },
        {
          title: "Smart Search",
          description: "Master the search functionality to find information quickly",
          slug: "smart-search",
          time: "6 min read"
        },
        {
          title: "Document Management",
          description: "Organize, tag, and manage your documents effectively",
          slug: "document-management",
          time: "5 min read"
        }
      ]
    },
    {
      category: "Advanced Features",
      icon: Settings,
      color: "text-green-400",
      articles: [
        {
          title: "Team Collaboration",
          description: "Share knowledge and collaborate with team members",
          slug: "team-collaboration",
          time: "10 min read"
        },
        {
          title: "API Integration",
          description: "Integrate MindVault with your existing tools and workflows",
          slug: "api-integration",
          time: "12 min read"
        },
        {
          title: "Advanced Security Settings",
          description: "Configure advanced security options for your knowledge vault",
          slug: "advanced-security",
          time: "8 min read"
        }
      ]
    },
    {
      category: "Troubleshooting",
      icon: FileText,
      color: "text-yellow-400",
      articles: [
        {
          title: "Common Issues and Solutions",
          description: "Solutions to frequently encountered problems",
          slug: "common-issues",
          time: "7 min read"
        },
        {
          title: "Performance Optimization",
          description: "Tips to improve performance and response times",
          slug: "performance-optimization",
          time: "9 min read"
        }
      ]
    }
  ]

  const filteredDocumentation = documentation.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0)

  const popularArticles = [
    {
      title: "Getting Started with MindVault",
      slug: "getting-started",
      views: 12420
    },
    {
      title: "How to Use AI Chat Effectively",
      slug: "ai-chat-effectively",
      views: 9840
    },
    {
      title: "Document Organization Best Practices",
      slug: "document-organization",
      views: 8650
    },
    {
      title: "Security and Privacy Settings",
      slug: "security-privacy",
      views: 7320
    }
  ]

  const recentUpdates = [
    {
      title: "New Collaboration Features",
      description: "Learn about our latest team collaboration tools",
      date: "2 days ago",
      type: "New Feature"
    },
    {
      title: "Improved Search Algorithm",
      description: "Our search is now 40% faster and more accurate",
      date: "1 week ago",
      type: "Improvement"
    },
    {
      title: "Mobile App Release",
      description: "MindVault is now available on iOS and Android",
      date: "2 weeks ago",
      type: "Release"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Documentation & <span className="text-indigo-400">Resources</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Everything you need to know about using MindVault effectively
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Start Guide */}
            <Card className="bg-black/20 border-white/10 text-white mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-medium mt-0.5">1</div>
                    <div>
                      <h3 className="font-medium">Create Your Account</h3>
                      <p className="text-sm text-gray-300">Sign up and set up your profile</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-medium mt-0.5">2</div>
                    <div>
                      <h3 className="font-medium">Upload Your Documents</h3>
                      <p className="text-sm text-gray-300">Add PDF or TXT files to your knowledge vault</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-medium mt-0.5">3</div>
                    <div>
                      <h3 className="font-medium">Start Chatting with AI</h3>
                      <p className="text-sm text-gray-300">Ask questions and get insights from your documents</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Categories */}
            <div className="space-y-8">
              {filteredDocumentation.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${category.color === 'text-indigo-400' ? 'bg-indigo-500/10' : category.color === 'text-purple-400' ? 'bg-purple-500/10' : category.color === 'text-green-400' ? 'bg-green-500/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                  </div>
                  
                  <div className="grid gap-4">
                    {category.articles.map((article, articleIndex) => (
                      <Card key={articleIndex} className="bg-black/20 border-white/10 text-white hover:border-indigo-400/30 transition-all duration-300">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{article.title}</h3>
                              <p className="text-sm text-gray-300 mb-2">{article.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{article.time}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Articles */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Popular Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div key={index} className="pb-3 border-b border-white/10 last:border-0 last:pb-0">
                    <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{article.views.toLocaleString()} views</span>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-0 h-6 w-6">
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-400" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="pb-3 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-white/20 text-white">
                        {update.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{update.date}</span>
                    </div>
                    <h4 className="font-medium text-sm">{update.title}</h4>
                    <p className="text-xs text-gray-300">{update.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">Join our community of users and developers</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Community Forum
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Discord Server
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}