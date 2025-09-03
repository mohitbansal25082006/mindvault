import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DocumentList } from "@/components/documents/document-list"

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <DocumentList />
    </DashboardLayout>
  )
}