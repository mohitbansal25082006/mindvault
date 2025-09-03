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
import { Progress } from "@/components/ui/progress"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { DocumentSchema, DocumentData } from "@/lib/validations"
import { Document } from "@/types"
import { toast } from "sonner"
import { Save, X, Tag, Upload, FileText, Loader2 } from "lucide-react"

interface DocumentFormProps {
  document?: Document
  isEditing?: boolean
}

export function DocumentForm({ document, isEditing = false }: DocumentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [content, setContent] = useState(document?.content || "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(document?.tags || [])
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string
    originalName: string
    fileType: string
  } | null>(null)

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (file.type !== "application/pdf" && file.type !== "text/plain") {
      toast.error("Only PDF and TXT files are supported")
      return
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        
        // Set the title from the file name if not already set
        if (!watchedValues.title) {
          const titleWithoutExtension = data.originalName
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (char: string) => char.toUpperCase())
          setValue("title", titleWithoutExtension)
        }
        
        // Set the content from the extracted text
        setContent(data.extractedText)
        
        // Store file info
        setUploadedFile({
          fileName: data.fileName,
          originalName: data.originalName,
          fileType: data.fileType,
        })
        
        toast.success(`Successfully uploaded ${data.originalName}`)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to upload file")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
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
            {/* File Upload */}
            {!isEditing && (
              <div className="space-y-2">
                <Label>Upload Document (PDF or TXT)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {isUploading ? (
                    <div className="space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p>Uploading and processing file...</p>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">
                        Drag and drop a file here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports PDF and TXT files up to 10MB
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        className="max-w-xs mx-auto mt-2"
                      />
                    </>
                  )}
                </div>
                {uploadedFile && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">
                      {uploadedFile.originalName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {uploadedFile.fileType === "application/pdf" ? "PDF" : "TXT"}
                    </Badge>
                  </div>
                )}
              </div>
            )}

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
              <Button type="submit" disabled={isLoading || isUploading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Document"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/documents")}
                disabled={isLoading || isUploading}
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