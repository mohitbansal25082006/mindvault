"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ForumPost, ForumComment } from "@/types"
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Share, 
  Pin, 
  Lock,
  Eye,
  Clock,
  Edit3,
  Trash2,
  Send
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export function ForumPostDetail({ postId }: { postId: string }) {
  const { data: session } = useSession()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [comments, setComments] = useState<ForumComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [commentContent, setCommentContent] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    fetchPost()
    fetchComments()
    incrementViewCount()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        setLikeCount(data._count.likes)
        
        // Check if user has liked the post
        if (session?.user?.id) {
          const likeResponse = await fetch(`/api/forum/likes?postId=${postId}&userId=${session.user.id}`)
          if (likeResponse.ok) {
            const likeData = await likeResponse.json()
            setIsLiked(likeData.isLiked)
          }
        }
      } else {
        toast.error("Failed to load post")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      toast.error("Failed to load comments")
    }
  }

  const incrementViewCount = async () => {
    try {
      await fetch(`/api/forum/posts/${postId}/views`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Error incrementing view count:", error)
    }
  }

  const handleLike = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to like posts")
      return
    }

    try {
      const response = await fetch("/api/forum/likes", {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: session.user.id,
        }),
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      }
    } catch (error) {
      toast.error("Failed to update like")
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
        fetchComments()
        toast.success("Comment added successfully!")
      } else {
        toast.error("Failed to add comment")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmittingComment(false)
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
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
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
              <span>{post._count.comments} comments</span>
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDateSafely(comment.createdAt)}
                      </span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Button variant="ghost" size="sm">
                        <Heart className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current text-red-500" : ""}`} />
                        {comment._count.likes}
                      </Button>
                      {session?.user?.id === comment.user.id && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
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
    </div>
  )
}