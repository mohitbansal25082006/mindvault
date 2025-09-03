"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Document } from "@/types"
import { Search, Filter, Clock, FileText, Tag, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { toast } from "sonner"
import { useStats } from "@/contexts/stats-context"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [results, setResults] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const { updateStats } = useStats()

  useEffect(() => {
    fetchAllTags()
  }, [])

  const fetchAllTags = async () => {
    try {
      const response = await fetch("/api/documents")
      if (response.ok) {
        const documents: Document[] = await response.json()
        const tags = Array.from(
          new Set(documents.flatMap((doc: Document) => doc.tags as string[]))
        )
        setAllTags(tags)
      }
    } catch {
      console.error("Error fetching tags")
    }
  }

  const performSearch = async () => {
    if (!query.trim() && !selectedTag) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      if (query.trim()) params.append("q", query.trim())
      if (selectedTag) params.append("tag", selectedTag)

      const response = await fetch(`/api/search?${params.toString()}`)

      if (response.ok) {
        const data: Document[] = await response.json()
        setResults(data)
        
        // Update search count if there was a query
        if (query.trim()) {
          updateStats(prev => ({ ...prev, totalSearches: prev.totalSearches + 1 }))
        }
      } else {
        toast.error("Search failed")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch()
    }
  }

  const clearSearch = () => {
    setQuery("")
    setSelectedTag("")
    setResults([])
    setHasSearched(false)
  }

  const removeTag = () => {
    setSelectedTag("")
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

  // Safe date formatting function
  const formatDateSafely = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown date"
    
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return "Invalid date"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Your Knowledge</h1>
        <p className="text-muted-foreground">
          Find information across all your documents using keywords or tags
        </p>
      </div>

      {/* Search Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button
              onClick={performSearch}
              disabled={isLoading || (!query.trim() && !selectedTag)}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          {/* Tags Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by Tag:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? "" : tag)
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedTag && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Active filter:
                </span>
                <Badge variant="secondary" className="gap-1">
                  {selectedTag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeTag}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}
          </div>

          {(query || selectedTag) && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={clearSearch}>
                Clear Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results {results.length > 0 && `(${results.length})`}
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((document) => (
                <Card
                  key={document.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          <Link
                            href={`/documents/${document.id}/view`}
                            className="hover:text-primary"
                          >
                            {query
                              ? highlightText(document.title, query)
                              : document.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Updated{" "}
                          {formatDateSafely(document.updated_at)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {query
                        ? highlightText(document.excerpt || "", query)
                        : document.excerpt}
                    </p>

                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant={
                              selectedTag === tag ? "default" : "secondary"
                            }
                            className="text-xs cursor-pointer"
                            onClick={() => setSelectedTag(tag)}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {document.content?.length || 0} characters
                      </span>
                      <div className="flex gap-2">
                        <Link href={`/documents/${document.id}/view`}>
                          <Button variant="outline" size="sm">
                            View Document
                          </Button>
                        </Link>
                        <Link href={`/documents/${document.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try different keywords or check your spelling
                </p>
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Search Techniques</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use specific keywords for better results</li>
                  <li>• Search matches both titles and content</li>
                  <li>• Combine keywords with tag filters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click tags to filter results</li>
                  <li>• Press Enter to search quickly</li>
                  <li>• Use &quot;Clear Search&quot; to reset</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}