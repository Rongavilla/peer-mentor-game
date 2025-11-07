import type { Metadata } from 'next'
import './globals.css'

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}