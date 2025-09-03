import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="p-6 h-full">
        <ChatInterface />
      </div>
    </DashboardLayout>
  )
}