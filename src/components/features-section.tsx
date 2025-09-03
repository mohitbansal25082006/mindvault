"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Search, 
  MessageSquare, 
  FileText, 
  Tag, 
  Shield,
  Zap,
  Globe,
  Users
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Knowledge Assistant",
    description: "Ask questions and get intelligent answers from your stored knowledge base using advanced AI.",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10"
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find information using natural language, not just keywords. AI understands context and meaning.",
    color: "text-purple-400", 
    bgColor: "bg-purple-500/10"
  },
  {
    icon: MessageSquare,
    title: "Chat with Your Docs",
    description: "Have conversations with your knowledge base. Get summaries, insights, and connections.",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10"
  },
  {
    icon: FileText,
    title: "Rich Text Editor",
    description: "Create and edit documents with a powerful editor supporting markdown, code blocks, and more.",
    color: "text-green-400",
    bgColor: "bg-green-500/10"
  },
  {
    icon: Tag,
    title: "Smart Tagging",
    description: "Organize your knowledge with intelligent tagging system and automatic categorization.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and secure. OAuth authentication with Google and GitHub.",
    color: "text-red-400",
    bgColor: "bg-red-500/10"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Next.js 15 and Turbopack for optimal performance and instant loading.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Globe,
    title: "Universal Access",
    description: "Access your knowledge vault from anywhere, on any device with responsive design.",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10"
  },
  {
    icon: Users,
    title: "Personal Workspace",
    description: "Your own private space to build and organize your personal knowledge repository.",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything you need to manage
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              your knowledge
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            MindVault combines the best of note-taking apps with AI-powered search and chat capabilities
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index}
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-4">Ready to transform how you manage knowledge?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="border-green-500/20 text-green-400">
              ✅ Free to start
            </Badge>
            <Badge variant="outline" className="border-blue-500/20 text-blue-400">
              ⚡ Setup in minutes  
            </Badge>
            <Badge variant="outline" className="border-purple-500/20 text-purple-400">
              🧠 AI-powered
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}