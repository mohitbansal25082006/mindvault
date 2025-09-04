import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, BookOpen, Mail, Phone, Send, CheckCircle, Clock, Users } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-full">
              <MessageCircle className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're here to help you get the most out of MindVault. Find answers, contact support, or connect with our community.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-indigo-400" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Fill out the form below and our support team will get back to you within 24 hours.</p>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" className="bg-white/10 border-white/20" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" className="bg-white/10 border-white/20" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" className="bg-white/10 border-white/20" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your issue in detail..." 
                    rows={5}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="bg-black/20 border-white/10 text-white mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-medium mb-1">How do I upload documents?</h4>
                    <p className="text-sm text-gray-300">You can upload documents by going to the Documents page and clicking "New Document". You can upload PDF or TXT files up to 10MB.</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-medium mb-1">How does the AI chat work?</h4>
                    <p className="text-sm text-gray-300">Our AI analyzes your documents and provides answers based on their content. The more documents you upload, the smarter it becomes.</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-medium mb-1">Is my data secure?</h4>
                    <p className="text-sm text-gray-300">Yes, all your data is encrypted and stored securely. We never share your documents with third parties.</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-medium mb-1">Can I delete my account?</h4>
                    <p className="text-sm text-gray-300">Yes, you can delete your account at any time from the Settings page. All your data will be permanently removed within 30 days.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Options */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Mail className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-300">support@mindvault.app</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Phone className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-300">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-400" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">Join our community of users to share tips, ask questions, and connect with other MindVault users.</p>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Join Community
                </Button>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>All Systems</span>
                    <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Document Processing</span>
                    <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Services</span>
                    <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Email Support</span>
                    <span className="text-sm text-gray-300">~24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Priority Support</span>
                    <span className="text-sm text-gray-300">~4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Community Forum</span>
                    <span className="text-sm text-gray-300">~1 hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}