// E:\mindvault\src\components\forum\forum-post-detail.tsx
"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ForumPost, ForumComment } from "@/types"
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Share, 
  Pin, 
  Lock,
  Eye,
  Edit3,
  Trash2,
  Send,
  MoreHorizontal
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ForumPostDetail({ postId }: { postId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [comments, setComments] = useState<ForumComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [commentContent, setCommentContent] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentContent, setEditCommentContent] = useState("")
  const [isUpdatingComment, setIsUpdatingComment] = useState(false)
  const [deletingComment, setDeletingComment] = useState<string | null>(null)
  // New states for deleting post
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false)

  const fetchPost = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/forum/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        const likes = data?._count?.likes ?? 0
        setLikeCount(likes)
        
        // Check if user has liked the post
        if (session?.user?.id) {
          try {
            const likeResponse = await fetch(`/api/forum/likes?postId=${postId}&userId=${session.user.id}`)
            if (likeResponse.ok) {
              const likeData = await likeResponse.json()
              setIsLiked(Boolean(likeData?.isLiked))
            } else {
              // not fatal; just continue
              console.warn("Failed to fetch like status", likeResponse.status)
            }
          } catch (err) {
            console.warn("Error fetching like status:", err)
          }
        } else {
          // ensure like state is reset when no session
          setIsLiked(false)
        }
      } else {
        toast.error("Failed to load post")
      }
    } catch (error) {
      console.error("fetchPost error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }, [postId, session?.user?.id])

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else {
        console.warn("Failed to load comments", response.status)
      }
    } catch (error) {
      console.error("fetchComments error:", error)
      toast.error("Failed to load comments")
    }
  }, [postId])

  const incrementViewCount = useCallback(async () => {
    try {
      // Only increment if the user hasn't viewed this post recently
      const viewedPosts = JSON.parse(localStorage.getItem('viewedForumPosts') || '[]')
      
      if (!viewedPosts.includes(postId)) {
        await fetch(`/api/forum/posts/${postId}/views`, {
          method: "POST",
        })
        
        // Add to viewed posts and set expiration (24 hours)
        viewedPosts.push(postId)
        localStorage.setItem('viewedForumPosts', JSON.stringify(viewedPosts))
        
        // Set expiration to clear after 24 hours
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000)
        localStorage.setItem('viewedForumPostsExpires', expiresAt.toString())
      }
      
      // Check if we need to clear expired entries
      const expiresAt = localStorage.getItem('viewedForumPostsExpires')
      if (expiresAt && parseInt(expiresAt) < Date.now()) {
        localStorage.removeItem('viewedForumPosts')
        localStorage.removeItem('viewedForumPostsExpires')
      }
    } catch (error) {
      console.error("Error incrementing view count:", error)
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
    fetchComments()
    incrementViewCount()
    // Re-run when session changes in case like state should be rechecked
  }, [fetchPost, fetchComments, incrementViewCount, session?.user?.id])

  /**
   * Robust like/unlike handler.
   * - When liking: POST /api/forum/likes with JSON body
   * - When unliking: attempt DELETE /api/forum/likes?postId=...&userId=... (no body).
   *   If that fails (some servers expect body on DELETE), retry with DELETE + JSON body.
   */
  const handleLike = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to like posts")
      return
    }
    // Prevent double-click spamming by quick local guard (optional)
    // We'll optimistically update UI after success, not before.
    try {
      if (!isLiked) {
        // Like (POST)
        const response = await fetch("/api/forum/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, userId: session.user.id }),
        })
        if (response.ok) {
          setIsLiked(true)
          setLikeCount((prev) => prev + 1)
        } else {
          const text = await safeReadText(response)
          console.error("Like failed:", response.status, text)
          toast.error("Failed to like post")
        }
      } else {
        // Unlike (DELETE) — try query param style first (no body)
        const deleteUrl = `/api/forum/likes?postId=${encodeURIComponent(postId)}&userId=${encodeURIComponent(session.user.id)}`
        let response = await fetch(deleteUrl, { method: "DELETE" })
        if (!response.ok) {
          // If it failed, try DELETE with a JSON body (some servers accept body)
          console.warn("DELETE without body failed, retrying with body", response.status)
          try {
            response = await fetch("/api/forum/likes", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ postId, userId: session.user.id }),
            })
          } catch (err) {
            console.error("Retry DELETE with body threw:", err)
            response = undefined as unknown as Response
          }
        }
        if (response && response.ok) {
          setIsLiked(false)
          setLikeCount((prev) => Math.max(0, prev - 1))
        } else {
          const status = response ? response.status : "no-response"
          const text = response ? await safeReadText(response) : ""
          console.error("Unlike failed:", status, text)
          toast.error("Failed to unlike post")
        }
      }
    } catch (error) {
      console.error("handleLike unexpected error:", error)
      toast.error("Failed to update like")
    }
  }

  // helper to safely read response text/json without throwing
  const safeReadText = async (res: Response) => {
    try {
      const ct = res.headers.get("content-type")
      if (ct && ct.includes("application/json")) {
        const json = await res.json()
        return JSON.stringify(json)
      }
      return await res.text()
    } catch (e) {
      return "<unreadable response>"
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty")
      return
    }
    if (!session?.user?.id) {
      toast.error("Please sign in to comment")
      return
    }
    setIsSubmittingComment(true)
    try {
      const response = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentContent.trim(),
          userId: session.user.id,
        }),
      })
      if (response.ok) {
        setCommentContent("")
        await fetchComments()
        toast.success("Comment added successfully!")
      } else {
        toast.error("Failed to add comment")
      }
    } catch (error) {
      console.error("handleCommentSubmit error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to like comments")
      return
    }
    try {
      const comment = comments.find(c => c.id === commentId)
      const isCurrentlyLiked = comment?.isLiked || false
      
      const response = await fetch("/api/forum/likes", {
        method: isCurrentlyLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          userId: session.user.id,
        }),
      })
      if (response.ok) {
        // Update the comment in the local state
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !isCurrentlyLiked,
              _count: {
                ...comment._count,
                likes: isCurrentlyLiked ? Math.max(0, comment._count.likes - 1) : comment._count.likes + 1
              }
            }
          }
          return comment
        }))
      } else {
        toast.error("Failed to update like")
      }
    } catch (error) {
      console.error("handleLikeComment error:", error)
      toast.error("Failed to update like")
    }
  }

  const startEditComment = (comment: ForumComment) => {
    // Only allow editing if the user is the comment author
    if (session?.user?.id !== comment.user.id) {
      toast.error("You can only edit your own comments")
      return
    }
    
    setEditingComment(comment.id)
    setEditCommentContent(comment.content)
  }

  const handleUpdateComment = async () => {
    if (!editingComment || !editCommentContent.trim()) {
      toast.error("Comment cannot be empty")
      return
    }
    setIsUpdatingComment(true)
    try {
      const response = await fetch(`/api/forum/comments/${editingComment}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editCommentContent.trim(),
        }),
      })
      if (response.ok) {
        setEditingComment(null)
        setEditCommentContent("")
        await fetchComments()
        toast.success("Comment updated successfully!")
      } else {
        const error = await response.json()
        toast.error(error?.error || "Failed to update comment")
      }
    } catch (error) {
      console.error("handleUpdateComment error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsUpdatingComment(false)
    }
  }

  const confirmDeleteComment = (commentId: string) => {
    // Only allow deletion if the user is the comment author
    const comment = comments.find(c => c.id === commentId)
    if (session?.user?.id !== comment?.user.id) {
      toast.error("You can only delete your own comments")
      return
    }
    
    setDeletingComment(commentId)
  }

  const handleDeleteComment = async () => {
    if (!deletingComment) return
    try {
      const response = await fetch(`/api/forum/comments/${deletingComment}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== deletingComment))
        setDeletingComment(null)
        toast.success("Comment deleted successfully!")
      } else {
        const error = await response.json()
        toast.error(error?.error || "Failed to delete comment")
      }
    } catch (error) {
      console.error("handleDeleteComment error:", error)
      toast.error("Something went wrong")
    }
  }

  // New: determine if current user is the post author
  const isPostAuthor = (post && session?.user?.id) ? session.user.id === post.user.id : false

  // New: confirm deletion (open dialog)
  const confirmDeletePost = () => {
    if (!isPostAuthor) {
      toast.error("Only the post author can delete this post")
      return
    }
    setDeletePostDialogOpen(true)
  }

  // New: handle delete post with robust retry (no body -> with body)
  const handleDeletePost = async () => {
    if (!post) return
    if (!isPostAuthor) {
      toast.error("Only the post author can delete this post")
      return
    }
    setIsDeletingPost(true)
    try {
      let response = await fetch(`/api/forum/posts/${postId}`, { method: "DELETE" })
      if (!response.ok) {
        // Retry with JSON body (some servers expect a body on DELETE)
        console.warn("Initial DELETE failed, retrying with body", response.status)
        try {
          response = await fetch(`/api/forum/posts/${postId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session?.user?.id }),
          })
        } catch (err) {
          console.error("Retry DELETE with body threw:", err)
          response = undefined as unknown as Response
        }
      }
      if (response && response.ok) {
        toast.success("Post deleted successfully!")
        // Navigate back to forum list after deletion
        router.push("/forum")
      } else {
        const status = response ? response.status : "no-response"
        const text = response ? await safeReadText(response) : ""
        console.error("Delete post failed:", status, text)
        toast.error("Failed to delete post")
      }
    } catch (error) {
      console.error("handleDeletePost error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsDeletingPost(false)
      setDeletePostDialogOpen(false)
    }
  }

  const handleShare = async () => {
    if (!post) return
    const url = `${window.location.origin}/forum/post/${postId}`
    const title = `MindVault Forum: ${post.title ?? "Post"}`
    try {
      // Try Web Share API first (will only be available in some browsers / platforms)
      if (navigator.share && typeof navigator.share === "function") {
        try {
          await navigator.share({ title, url })
          toast.success("Post shared successfully!")
          return
        } catch (err) {
          // If user cancels or the API throws for any reason, fall back to clipboard
          console.warn("Web Share API failed or cancelled — falling back to clipboard", err)
        }
      }
      // Fallback: use Clipboard API if available
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
        return
      }
      // Last-resort fallback: create a temporary input and use execCommand
      const input = document.createElement("input")
      input.value = url
      document.body.appendChild(input)
      input.select()
      try {
        document.execCommand("copy")
        toast.success("Link copied to clipboard!")
      } catch (err) {
        console.error("execCommand copy failed:", err)
        toast.error("Failed to copy link")
      } finally {
        document.body.removeChild(input)
      }
    } catch (error) {
      console.error("handleShare error:", error)
      toast.error("Failed to share post")
    }
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

  const isCommentAuthor = (commentUserId: string) => {
    return session?.user?.id === commentUserId
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-muted-foreground">The requested post could not be found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <Link href="/forum">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
      </Link>

      {/* Post */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                {post.isPinned && (
                  <Pin className="h-5 w-5 text-red-500" />
                )}
                {post.isLocked && (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.user.image || ""} />
                    <AvatarFallback>
                      {post.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{post.user.name}</span>
                </div>
                <span>•</span>
                <span>{formatDateSafely(post.createdAt)}</span>
                <span>•</span>
                <Badge variant="outline">{post.category.name}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                {likeCount}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              {/* Only show delete post button if current user is the post author */}
              {isPostAuthor && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={confirmDeletePost}
                    className="text-red-600"
                    disabled={isDeletingPost}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post._count?.comments ?? 0} comments</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{likeCount} likes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add Comment Form */}
          {session?.user?.id && !post.isLocked && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingComment || !commentContent.trim()}>
                    {isSubmittingComment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.user.image || ""} />
                    <AvatarFallback>
                      {comment.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDateSafely(comment.createdAt)}
                        </span>
                        {isCommentAuthor(comment.user.id) && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      
                      {/* Only show dropdown menu if user is the comment author */}
                      {isCommentAuthor(comment.user.id) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditComment(comment)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => confirmDeleteComment(comment.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    {editingComment === comment.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingComment(null)
                              setEditCommentContent("")
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleUpdateComment}
                            disabled={isUpdatingComment || !editCommentContent.trim()}
                          >
                            {isUpdatingComment ? "Updating..." : "Update"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLikeComment(comment.id)}
                        className={comment.isLiked ? "text-red-500" : ""}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                        {comment._count?.likes ?? 0}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Comment Confirmation Dialog */}
      <Dialog open={!!deletingComment} onOpenChange={() => setDeletingComment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingComment(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteComment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Confirmation Dialog (only for author) */}
      <Dialog open={deletePostDialogOpen} onOpenChange={setDeletePostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone and will remove all associated comments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePostDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={isDeletingPost}>
              {isDeletingPost ? "Deleting..." : "Delete Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}