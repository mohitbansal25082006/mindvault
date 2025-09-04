"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactSchema, ContactData } from "@/lib/validations"
import { ArrowLeft, MessageCircle, BookOpen, Mail, Phone, Send, CheckCircle, Clock, Users, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactData>({
    resolver: zodResolver(ContactSchema),
  })

  const onSubmit = async (data: ContactData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSubmitted(true)
        reset()
        toast.success("Your message has been sent successfully!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to send message")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <Link href="/">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Card className="bg-black/20 border-white/10 text-white">
            <CardContent className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-500/20 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Message Sent Successfully!</h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Thank you for reaching out to MindVault Support. We've received your message and will get back to you within 24 hours.
              </p>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
                <ul className="text-left space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Our support team has received your message</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>We'll review your request and assign it to the appropriate team member</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a response within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>A confirmation email has been sent to your inbox</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Return to Home
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    setIsSubmitted(false)
                    reset()
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      className="bg-white/10 border-white/20"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      className="bg-white/10 border-white/20"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      placeholder="What can we help you with?" 
                      className="bg-white/10 border-white/20"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-sm">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Please describe your issue in detail..." 
                      rows={5}
                      className="bg-white/10 border-white/20"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-sm">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
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
                    <p className="text-sm text-gray-300">mohitbansal.cse28@jecrc.ac.in</p>
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

            {/* Emergency Contact */}
            <Card className="bg-red-500/10 border-red-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Emergency Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">For critical issues requiring immediate attention, please use our emergency contact:</p>
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="font-medium">Emergency Email:</p>
                  <p className="text-sm">emergency@mindvault.app</p>
                </div>
                <p className="text-xs text-gray-300 mt-3">Please use this only for critical issues that require immediate attention.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}