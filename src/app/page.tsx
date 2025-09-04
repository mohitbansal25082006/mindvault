"use client"
import { Suspense } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import Scene3D from "@/components/3d/scene"
import Loading3D from "@/components/3d/loading"

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 overflow-x-hidden flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 overflow-x-hidden">
      {/* 3D Background */}
      <Suspense fallback={<Loading3D />}>
        <Scene3D />
      </Suspense>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection isAuthenticated={!!session} />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              © 2025 MindVault. Built with Next.js 15, TypeScript & AI.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}