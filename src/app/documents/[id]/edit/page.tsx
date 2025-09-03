"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DocumentForm } from "@/components/documents/document-form"
import { Document } from "@/types"
import { toast } from "sonner"

export default function EditDocumentPage() {
  const params = useParams()
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Guard for missing id
    if (!params?.id) {
      toast.error("Invalid document id")
      setIsLoading(false)
      return
    }

    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDocument(data)
        } else {
          toast.error("Document not found")
        }
      } catch (error) {
        console.error("Failed to load document:", error)
        toast.error("Failed to load document")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [params?.id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!document) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Document not found</h2>
          <p className="text-muted-foreground">
            The document you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DocumentForm document={document} isEditing={true} />
    </DashboardLayout>
  )
}
