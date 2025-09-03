import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DocumentForm } from "@/components/documents/document-form"

export default function NewDocumentPage() {
  return (
    <DashboardLayout>
      <DocumentForm />
    </DashboardLayout>
  )
}