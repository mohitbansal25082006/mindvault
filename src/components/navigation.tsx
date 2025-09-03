"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Brain, Menu, X } from "lucide-react"
import { AuthModal } from "@/components/auth/auth-modal"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({
    isOpen: false,
    mode: 'login'
  })

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  
  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode })
  }
  
  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' })
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">MindVault</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <ModeToggle />
              <Button 
                variant="ghost" 
                onClick={() => openAuthModal('login')}
                className="text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => openAuthModal('register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-white"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-300 hover:text-white">
                Features
              </a>
              <a href="#about" className="block py-2 text-gray-300 hover:text-white">
                About
              </a>
              <a href="#pricing" className="block py-2 text-gray-300 hover:text-white">
                Pricing
              </a>
              <div className="flex items-center justify-between pt-2">
                <ModeToggle />
                <div className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openAuthModal('login')}
                    className="text-white"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => openAuthModal('register')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </>
  )
}