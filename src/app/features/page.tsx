import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, FileText, Search, MessageSquare, Shield, Zap, BarChart3, Globe, Lock, Users, Star, CheckCircle } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Knowledge Management",
      description: "Transform your scattered notes into an intelligent, searchable knowledge base using advanced AI algorithms.",
      icon: Brain,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10"
    },
    {
      title: "Smart Document Processing",
      description: "Upload PDF and TXT files with automatic text extraction and organization for seamless knowledge integration.",
      icon: FileText,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Intelligent Search",
      description: "Find information instantly across all your documents with our semantic search that understands context, not just keywords.",
      icon: Search,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "AI Chat Assistant",
      description: "Chat with your knowledge base to get instant answers, summaries, and insights from your documents.",
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Enterprise-Grade Security",
      description: "Your data is encrypted end-to-end and stored securely with regular security audits and compliance checks.",
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      title: "Lightning Fast Performance",
      description: "Experience blazing-fast search and response times with our optimized infrastructure and caching mechanisms.",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Analytics & Insights",
      description: "Gain valuable insights into your knowledge usage patterns with detailed analytics and visualization tools.",
      icon: BarChart3,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      title: "Global Accessibility",
      description: "Access your knowledge vault from anywhere in the world with our responsive web and mobile applications.",
      icon: Globe,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Advanced Permissions",
      description: "Control who can access your knowledge with granular permission settings and sharing options.",
      icon: Lock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Team Collaboration",
      description: "Share knowledge, collaborate on documents, and build a collective intelligence base with your team.",
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10"
    }
  ]

  const testimonials = [
    {
      quote: "MindVault has completely transformed how I manage my research notes. The AI chat feature is like having a personal research assistant!",
      author: "Dr. Sarah Johnson",
      role: "Research Scientist",
      avatar: "SJ"
    },
    {
      quote: "The semantic search capabilities are incredible. I can find information across hundreds of documents in seconds, not hours.",
      author: "Michael Chen",
      role: "Product Manager",
      avatar: "MC"
    },
    {
      quote: "As a writer, MindVault helps me organize my thoughts and research like never before. It's become an essential part of my workflow.",
      author: "Emily Rodriguez",
      role: "Author & Journalist",
      avatar: "ER"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 100 documents",
        "Basic search functionality",
        "5 AI chat conversations per month",
        "1GB storage",
        "Community support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "For professionals and power users",
      features: [
        "Unlimited documents",
        "Advanced AI search",
        "Unlimited AI chat conversations",
        "10GB storage",
        "Priority support",
        "Advanced analytics",
        "Document collaboration"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Advanced security & compliance",
        "Team management",
        "SSO & advanced integrations",
        "Dedicated account manager",
        "Custom training & onboarding"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Powerful Features for <span className="text-indigo-400">Knowledge Management</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how MindVault can transform the way you organize, search, and interact with your knowledge.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/20 border-white/10 text-white hover:border-indigo-400/30 transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Knowledge Workers</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Hear from professionals who have transformed their workflow with MindVault
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/20 border-white/10 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                      <span className="text-indigo-400 font-medium">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the plan that works best for you. All plans include our core features.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`bg-black/20 border-white/10 text-white ${plan.popular ? 'border-indigo-500/50 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 text-base">/{plan.period}</span>}
                  </div>
                  <p className="text-gray-300 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-xl p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Knowledge?</h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Join thousands of professionals who are already using MindVault to organize and leverage their knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/documents/new">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}