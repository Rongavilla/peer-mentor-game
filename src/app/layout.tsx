import type { Metadata } from 'next'
import './globals.css'
import Footer from '../components/Footer'

// ...existing code...
export const metadata: Metadata = {
  title: 'StudyQuest - Professional Peer Mentorship Platform',
  description: 'A gamified peer-to-peer IT mentorship platform with AI-powered skill matching',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased flex min-h-screen flex-col animated-bg">
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}