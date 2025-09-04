import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            By using MindVault, you agree to these terms and conditions. Please read them carefully.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                By accessing and using MindVault, you accept and agree to be bound by the terms and provision of this
                agreement. In addition, when using MindVault&apos;s particular services, you shall be subject to any
                posted guidelines or rules applicable to such services.
              </p>
            </CardContent>
          </Card>

          {/* Use License */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                Use License
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Permission is granted to temporarily download one copy of MindVault&apos;s materials for personal,
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                under this license you may not:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on MindVault</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>
                  Transfer the materials to another person or &quot;mirror&quot; the materials on any other server
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The materials on MindVault are provided on an &apos;as is&apos; basis. MindVault makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-400" />
                Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                In no event shall MindVault or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on MindVault, even if MindVault or a MindVault authorized representative has been
                notified orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          {/* Accuracy of Materials */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Accuracy of Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The materials appearing on MindVault could include technical, typographical, or photographic errors.
                MindVault does not warrant that any of the materials on its website are accurate, complete, or current.
                MindVault may make changes to the materials contained on its website at any time without notice.
                However, MindVault does not make any commitment to update the materials.
              </p>
            </CardContent>
          </Card>

          {/* User Content */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                User Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our service allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, or other material (&quot;User Content&quot;). You are responsible for your User Content
                and the consequences of posting it.
              </p>
              <p>
                By posting User Content, you grant MindVault a worldwide, non-exclusive, royalty-free license to use,
                reproduce, modify, adapt, publish, and display such content solely for the purpose of providing,
                promoting, and improving our services.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-400" />
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may terminate or suspend access to our service immediately, without prior notice or liability, for
                any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your
                right to use the service will cease immediately.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which
                MindVault operates, without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          {/* Changes */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will try to provide at least 30 days notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="bg-black/20 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have any questions about these Terms, please contact us at terms@mindvault.app or visit our{" "}
                <Link href="/support" className="text-indigo-400 hover:text-indigo-300">
                  Support page
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="text-center text-gray-400 mt-12">
          <p>
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  )
}
