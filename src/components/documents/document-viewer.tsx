"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Tag, 
  MessageSquare, 
  Search, 
  Brain, 
  Share, 
  Download, 
  Edit,
  Highlighter,
  Bookmark,
  BookmarkCheck,
  Clock,
  User,
  FileQuestion,
  FileText as FileIcon,
  Hash,
  Plus
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Document } from "@/types"

interface RelatedDocument {
  id: string
  title: string
  excerpt: string
  tags: string[]
  similarity: number
}

interface SearchResult {
  content: string
  score: number
  position: number
}

export function DocumentViewer({ documentId }: { documentId: string }) {
  const { data: session } = useSession()
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [relatedDocuments, setRelatedDocuments] = useState<RelatedDocument[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [highlights, setHighlights] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("document")

  useEffect(() => {
    fetchDocument()
    fetchRelatedDocuments()
  }, [documentId])

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}`)
      if (response.ok) {
        const data = await response.json()
        setDocument(data)
      } else {
        toast.error("Failed to load document")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedDocuments = async () => {
    try {
      const response = await fetch(`/api/documents/related/${documentId}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedDocuments(data)
      }
    } catch (error) {
      console.error("Error fetching related documents:", error)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim() || !document?.content) return
    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []
    const content = document.content.toLowerCase()
    
    // Find all occurrences of the search term
    let position = content.indexOf(query)
    while (position !== -1) {
      // Get some context around the match
      const start = Math.max(0, position - 50)
      const end = Math.min(document.content.length, position + query.length + 100)
      const snippet = document.content.substring(start, end)
      
      results.push({
        content: snippet,
        score: 1, // Simple score for now
        position
      })
      
      position = content.indexOf(query, position + 1)
    }
    
    setSearchResults(results)
    setActiveTab("search")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? "Bookmark removed" : "Document bookmarked")
  }

  const addHighlight = () => {
    const selection = window.getSelection()?.toString().trim()
    if (selection) {
      setHighlights([...highlights, selection])
      toast.success("Highlight added")
    }
  }

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const handleAskAI = async () => {
    if (!searchQuery.trim()) return
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Regarding the document "${document?.title}": ${searchQuery}`,
          documentId: documentId 
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setActiveTab("chat")
        // In a real implementation, you would display the AI response
        toast.success("AI response received")
      }
    } catch (error) {
      toast.error("Failed to get AI response")
    }
  }

  const downloadDocument = () => {
    if (!document) return
    
    const blob = new Blob([document.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    
    // Use window.document to avoid conflict with the state variable
    const a = window.document.createElement("a") as HTMLAnchorElement
    a.href = url
    a.download = `${document.title}.txt`
    
    // Use window.document to avoid conflict
    window.document.body?.appendChild(a)
    a.click()
    window.document.body?.removeChild(a)
    
    URL.revokeObjectURL(url)
    toast.success("Document downloaded")
  }

  // Safe date formatting function
  const formatDateSafely = (dateString: string | null | undefined) => {
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

  // Function to render highlighted text
  const renderHighlightedParagraph = (paragraph: string, index: number) => {
    if (highlights.length === 0) {
      return <p key={index}>{paragraph}</p>
    }

    let result: React.ReactNode[] = [paragraph]
    
    highlights.forEach(highlight => {
      const newResult: React.ReactNode[] = []
      result.forEach(part => {
        if (typeof part === 'string') {
          const parts = part.split(new RegExp(`(${highlight})`, 'gi'))
          parts.forEach((subPart, i) => {
            if (subPart.toLowerCase() === highlight.toLowerCase()) {
              newResult.push(
                <mark key={`${index}-${i}`} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                  {subPart}
                </mark>
              )
            } else {
              newResult.push(subPart)
            }
          })
        } else {
          newResult.push(part)
        }
      })
      result = newResult
    })
    
    return <p key={index}>{result}</p>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Document Not Found</h2>
          <p className="text-muted-foreground">The requested document could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/documents">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {formatDateSafely(document.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {formatDateSafely(document.updated_at)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleBookmark}>
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadDocument}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={addHighlight}>
            <Highlighter className="h-4 w-4" />
          </Button>
          <Link href={`/documents/${document.id}/edit`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Document Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
            </TabsList>
            
            <TabsContent value="document" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content</CardTitle>
                  <CardDescription>
                    Full document content with highlights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {document.content.split('\n').map((paragraph, index) => 
                        renderHighlightedParagraph(paragraph, index)
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="search" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search in Document</CardTitle>
                  <CardDescription>
                    Find specific content within this document
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search within this document..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handleAskAI}>
                      <Brain className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {searchResults.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium">
                        Found {searchResults.length} results
                      </h4>
                      <ScrollArea className="h-[calc(100vh-400px)]">
                        {searchResults.map((result, index) => (
                          <Card key={index} className="mb-3">
                            <CardContent className="pt-4">
                              <p className="text-sm">
                                ...{highlightText(result.content, searchQuery)}...
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Enter a search term to find content in this document
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="related" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Documents</CardTitle>
                  <CardDescription>
                    Documents with similar content or tags
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {relatedDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {relatedDocuments.map((doc) => (
                        <Card key={doc.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">
                                  <Link
                                    href={`/documents/${doc.id}/view`}
                                    className="hover:text-primary"
                                  >
                                    {doc.title}
                                  </Link>
                                </CardTitle>
                                <CardDescription>
                                  Similarity: {Math.round(doc.similarity * 100)}%
                                </CardDescription>
                              </div>
                              <FileIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {doc.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {doc.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No related documents found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{session?.user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">Owner</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{document.content.length}</p>
                  <p className="text-xs text-muted-foreground">Characters</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{document.content.split(/\s+/).length}</p>
                  <p className="text-xs text-muted-foreground">Words</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {document.tags && document.tags.length > 0 ? (
                    document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Highlights */}
          {highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                        {highlight}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Document
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask AI About This
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Hash className="h-4 w-4 mr-2" />
                Manage Tags
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}