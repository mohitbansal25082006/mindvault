"use client"
import { Sidebar } from "./sidebar"
import { useSession } from "next-auth/react"
import { StatsProvider } from "@/contexts/stats-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:pl-0 pl-16">
        {session?.user?.id && (
          <StatsProvider userId={session.user.id}>
            {children}
          </StatsProvider>
        )}
      </main>
    </div>
  )
}