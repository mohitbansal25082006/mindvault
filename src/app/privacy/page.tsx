import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Lock, Database, Eye, Trash2, Share } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <Shield className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your privacy is critically important to us. This policy outlines what personal data we collect and how we use it.
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-400" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We collect information to provide better services to all our users. This includes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and profile picture.</li>
                <li><strong>Document Content:</strong> All documents you upload or create are stored securely.</li>
                <li><strong>Usage Data:</strong> We collect information about how you use our services, such as search queries and chat interactions.</li>
                <li><strong>Device Information:</strong> We collect information about the device you use to access our service.</li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-400" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use the information we collect for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide, maintain, and improve our services</li>
                <li>To process and analyze your documents using AI</li>
                <li>To communicate with you about your account</li>
                <li>To monitor and analyze usage patterns</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-400" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>End-to-end encryption for all data transmissions</li>
                <li>Secure storage of all documents and personal information</li>
                <li>Regular security assessments and audits</li>
                <li>Restricted access to data for authorized personnel only</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5 text-indigo-400" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
                <li><strong>Rectification:</strong> You can ask us to correct inaccurate information.</li>
                <li><strong>Deletion:</strong> You can request deletion of your personal information.</li>
                <li><strong>Portability:</strong> You can request transfer of your data to another service.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-indigo-400" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>We retain your personal information only for as long as necessary to provide the services and fulfill the purposes outlined in this policy. When you delete your account, we will delete all your personal information and documents within 30 days, except where required by law to retain certain information.</p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Questions About Privacy?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@mindvault.app or visit our <Link href="/support" className="text-indigo-400 hover:text-indigo-300">Support page</Link>.</p>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="text-center text-gray-400 mt-12">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  )
}