"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { DocumentSchema, DocumentData } from "@/lib/validations"
import { Document } from "@/types"
import { toast } from "sonner"
import { Save, X, Tag } from "lucide-react"

interface DocumentFormProps {
  document?: Document
  isEditing?: boolean
}

export function DocumentForm({ document, isEditing = false }: DocumentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState(document?.content || "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(document?.tags || [])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DocumentData>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      title: document?.title || "",
      content: document?.content || "",
      tags: document?.tags || [],
      isPublic: document?.isPublic || false,
    }
  })

  // Watch form values
  const watchedValues = watch()

  // Update content when it changes
  useEffect(() => {
    setValue("content", content)
  }, [content, setValue])

  // Update tags when they change
  useEffect(() => {
    setValue("tags", tags)
  }, [tags, setValue])

  const onSubmit = async (data: DocumentData) => {
    setIsLoading(true)
    try {
      const url = isEditing ? `/api/documents/${document?.id}` : "/api/documents"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(isEditing ? "Document updated!" : "Document created!")
        router.push("/documents")
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Document" : "Create New Document"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                {...register("title")}
                id="title"
                placeholder="Enter document title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your document..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline" size="icon">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Public Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={watchedValues.isPublic}
                onCheckedChange={(checked) => setValue("isPublic", checked)}
              />
              <Label htmlFor="isPublic">Make this document public</Label>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Document"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/documents")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}