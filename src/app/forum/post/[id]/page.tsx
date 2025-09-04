"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ForumPostDetail } from "@/components/forum/forum-post-detail"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function ForumPostPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPostId = async () => {
      const { id } = await params
      setPostId(id as string)
      setIsLoading(false)
    }

    fetchPostId()
  }, [params])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (status === "unauthenticated") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to view forum posts.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!postId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
            <p className="text-muted-foreground">The requested post could not be found.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <ForumPostDetail postId={postId} />
    </DashboardLayout>
  )
}