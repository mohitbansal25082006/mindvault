"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, ArrowLeft, Plus } from "lucide-react"
import { ForumCategory } from "@/types"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"

export default function CreatePostPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<ForumCategory[]>([])

  // Add-category state
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [newCatDescription, setNewCatDescription] = useState("")
  const [newCatIcon, setNewCatIcon] = useState("")
  const [newCatColor, setNewCatColor] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/forum/categories")
      if (response.ok) {
        const data: ForumCategory[] = await response.json()
        setCategories(data)
        // auto-select first category if present and none selected
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0].id)
        }
        console.log("Categories loaded for create post:", data)
      } else {
        toast.error("Failed to load categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    }
  }

  const handleCreateCategory = async (e?: React.FormEvent | null) => {
    // allow either being called from a button (no event) or a form submit (event)
    if (e && typeof (e as any).preventDefault === "function") (e as any).preventDefault()
    if (!newCatName.trim()) {
      toast.error("Category name is required")
      return
    }

    setIsAddingCategory(true)
    try {
      const response = await fetch("/api/forum/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDescription.trim() || undefined,
          icon: newCatIcon.trim() || undefined,
          color: newCatColor.trim() || undefined,
        }),
      })

      if (response.ok) {
        const created: ForumCategory = await response.json()
        // append and select the new category
        setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
        setSelectedCategory(created.id)
        setShowAddCategory(false)
        // reset new category inputs
        setNewCatName("")
        setNewCatDescription("")
        setNewCatIcon("")
        setNewCatColor("")
        toast.success("Category created and selected")
      } else {
        const err = await response.json().catch(() => null)
        toast.error(err?.error || "Failed to create category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("Failed to create category")
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !selectedCategory) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryId: selectedCategory,
        }),
      })

      if (response.ok) {
        toast.success("Post created successfully!")
        router.push("/forum")
      } else {
        const error = await response.json().catch(() => null)
        toast.error(error?.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/forum">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground mt-2">Share your thoughts with the community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Post</CardTitle>
            <CardDescription>Fill in the details below to create a new forum post</CardDescription>
          </CardHeader>
          <CardContent>
            {/* MAIN post form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.length === 0 ? (
                          // render a single disabled placeholder item (non-empty value)
                          <SelectItem value="__no_categories__" disabled>
                            No categories yet
                          </SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                {category.icon && <span className="text-lg">{category.icon}</span>}
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-none">
                    <Button
                      variant={showAddCategory ? "secondary" : "ghost"}
                      onClick={() => setShowAddCategory((s) => !s)}
                      size="sm"
                      className="flex items-center gap-2"
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                      {showAddCategory ? "Close" : "Add category"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add-category UI: NOT a form (no nested <form>) */}
              {showAddCategory && (
                <Card className="bg-muted/5 border-muted/10">
                  <CardContent className="space-y-4" role="group" aria-label="Add category">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="newCatName">Name *</Label>
                        <Input
                          id="newCatName"
                          placeholder="Category name"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newCatIcon">Icon (optional)</Label>
                        <Input
                          id="newCatIcon"
                          placeholder="e.g. 🧭 or book-outline"
                          value={newCatIcon}
                          onChange={(e) => setNewCatIcon(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newCatDescription">Description (optional)</Label>
                      <Input
                        id="newCatDescription"
                        placeholder="Short description"
                        value={newCatDescription}
                        onChange={(e) => setNewCatDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newCatColor">Color (optional)</Label>
                      <Input
                        id="newCatColor"
                        placeholder="Tailwind color class (e.g. text-indigo-400)"
                        value={newCatColor}
                        onChange={(e) => setNewCatColor(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setShowAddCategory(false)} type="button">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleCreateCategory(null)}
                        disabled={isAddingCategory}
                        type="button"
                      >
                        {isAddingCategory ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                          </>
                        ) : (
                          "Create category"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">You can use Markdown to format your text</p>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/forum")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Posting Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be respectful and considerate of others</li>
              <li>• Search before posting to avoid duplicates</li>
              <li>• Use descriptive titles for your posts</li>
              <li>• Categorize your posts appropriately</li>
              <li>• No spam or self-promotion</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
