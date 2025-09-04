"use client"
import { Suspense, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import Scene3D from "@/components/3d/scene"
import Loading3D from "@/components/3d/loading"
import { Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  
  const handleJoinCommunity = () => {
    if (session) {
      router.push("/forum")
    } else {
      setShowLoginPrompt(true)
    }
  }
  
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
      
      {/* Join Community Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with other MindVault users, share your knowledge, and get help from the community.
          </p>
          <Button 
            onClick={handleJoinCommunity}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            size="lg"
          >
            <Users className="h-5 w-5 mr-2" />
            Join Community
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              © 2025 MindVault. Built with Next.js 15, TypeScript & AI.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
              <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="bg-black/80 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Login Required
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-6">
              You need to be logged in to join our community. Please sign in to access the forum.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => setShowLoginPrompt(false)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}