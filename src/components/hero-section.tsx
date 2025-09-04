"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Brain, Zap, Vault } from "lucide-react"
import { AuthModal } from "@/components/auth/auth-modal"
import Link from "next/link"

interface HeroSectionProps {
  isAuthenticated: boolean
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({
    isOpen: false,
    mode: 'register'
  })
  
  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode })
  }
  
  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' })
  }
  
  return (
    <>
      {/* ensure there's top padding so nav (if fixed) doesn't overlap the hero content */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 md:pt-28 lg:pt-32">
        {/* keep hero content above the 3D scene with a high z-index */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          {/* Badge */}
          <div className="mb-6">
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2 inline-flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Knowledge Management
            </Badge>
          </div>
          
          {/* Headline - use clamp for responsive scaling and constrain width */}
          <h1
            className="font-bold text-white mb-6 leading-tight break-words whitespace-normal"
            style={{
              // fallback clamp sizing in case Tailwind isn't configured for arbitrary values
              fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
              lineHeight: 1.02,
              maxWidth: "min(100%, 1100px)"
            }}
          >
            {isAuthenticated ? (
              <>
                <span className="block text-[clamp(2.25rem,3.8vw,3.6rem)] md:text-[clamp(3rem,4.4vw,4.8rem)] lg:text-[clamp(3.5rem,5.2vw,6.0rem)]">Welcome Back to Your</span>
                <span className="block text-[clamp(2.75rem,6.2vw,5.5rem)] md:text-[clamp(3.8rem,7.2vw,6.5rem)] lg:text-[clamp(4.5rem,8.2vw,7.5rem)] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Knowledge Vault
                </span>
              </>
            ) : (
              <>
                <span className="block text-[clamp(2.25rem,3.8vw,3.6rem)] md:text-[clamp(3rem,4.4vw,4.8rem)] lg:text-[clamp(3.5rem,5.2vw,6.0rem)]">Your Personal</span>
                <span className="block text-[clamp(2.75rem,6.2vw,5.5rem)] md:text-[clamp(3.8rem,7.2vw,6.5rem)] lg:text-[clamp(4.5rem,8.2vw,7.5rem)] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Knowledge Vault
                </span>
              </>
            )}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {isAuthenticated ? (
              "Continue building your intelligent knowledge base with AI-powered search and organization."
            ) : (
              "Store, organize, and chat with your knowledge using AI. Turn your scattered notes into an intelligent, searchable brain."
            )}
          </p>
          
          {/* CTA Buttons */}
          {isAuthenticated ? (
            <div className="flex justify-center items-center mb-16">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg group">
                <Link href="/dashboard">
                  <Vault className="mr-2 w-5 h-5" />
                  Go to Your Vault
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={() => openAuthModal('register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg group"
              >
                Start Building Your Vault
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => openAuthModal('login')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg"
              >
                Sign In
              </Button>
            </div>
          )}
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm text-gray-300">Instant Answers</span>
            </div>
            <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Smart Organization</span>
            </div>
            <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <Brain className="w-4 h-4 text-indigo-400 mr-2" />
              <span className="text-sm text-gray-300">AI-Powered Search</span>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </>
  )
}
