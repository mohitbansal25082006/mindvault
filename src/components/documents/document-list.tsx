"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Document } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { 
  Search, 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar,
  Tag
} from "lucide-react"
import { toast } from "sonner"
import { useStats } from "@/contexts/stats-context"

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { updateStats, refreshStats } = useStats()

  // Get all unique tags
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags || [])))

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchTerm, selectedTag])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents")
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
        // Update stats with the new document count
        updateStats(prev => ({ ...prev, totalDocuments: data.length }))
      } else {
        toast.error("Failed to fetch documents")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = documents

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(doc => doc.tags && doc.tags.includes(selectedTag))
    }

    setFilteredDocuments(filtered)
  }

  const deleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== id))
        // Update stats after deletion
        updateStats(prev => ({ ...prev, totalDocuments: prev.totalDocuments - 1 }))
        toast.success("Document deleted")
        // Refresh all stats to ensure consistency
        refreshStats()
      } else {
        toast.error("Failed to delete document")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  // Safe date formatting function
  const formatDateSafely = (dateString: string | undefined | null) => {
    if (!dateString) return "Unknown date"
    
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <Link href="/documents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Document Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1 text-lg">
                      {document.title || "Untitled Document"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {formatDateSafely(document.updated_at)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/documents/${document.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteDocument(document.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {document.excerpt || "No content available"}
                </p>
                
                {/* Tags */}
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{document.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <FileText className="h-4 w-4" />
                    <span>{(document.content || "").length} characters</span>
                  </div>
                  {document.isPublic && (
                    <Badge variant="outline">Public</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedTag
              ? "Try adjusting your search or filter"
              : "Create your first document to get started"
            }
          </p>
          <Link href="/documents/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Document
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}