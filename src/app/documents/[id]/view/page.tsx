"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DocumentViewer } from "@/components/documents/document-viewer"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function DocumentViewPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [documentId, setDocumentId] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocumentId = async () => {
      const { id } = await params
      setDocumentId(id as string)
      setIsLoading(false)
    }

    fetchDocumentId()
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
            <p className="text-muted-foreground">Please sign in to view documents.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!documentId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Document Not Found</h2>
            <p className="text-muted-foreground">The requested document could not be found.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DocumentViewer documentId={documentId} />
    </DashboardLayout>
  )
}