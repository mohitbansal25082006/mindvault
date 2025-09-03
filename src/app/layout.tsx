import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/providers/session-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindVault - Your AI-Powered Knowledge Hub',
  description: 'Store, organize, and chat with your knowledge using AI. Turn your scattered notes into an intelligent, searchable brain.',
  keywords: ['AI', 'Knowledge Management', 'Notes', 'Search', 'Chat', 'Productivity'],
  authors: [{ name: 'MindVault Team' }],
  openGraph: {
    title: 'MindVault - Your AI-Powered Knowledge Hub',
    description: 'Transform how you manage knowledge with AI-powered search and chat.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}