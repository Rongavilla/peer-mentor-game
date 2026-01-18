'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { LogOut, MessageCircle } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const profile = useUserStore((s) => s.profile)
  const clearProfile = useUserStore((s) => s.clearProfile)

  const handleLogout = async () => {
    clearProfile()
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile?.username || 'unknown',
          userId: profile?.id || null,
        }),
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/')
  }

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 border-b shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Only */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group hover:opacity-90 transition">
              <div className="bg-white p-1 rounded-lg shadow-md group-hover:shadow-lg transition w-12 h-12 flex items-center justify-center">
                <img 
                  src="/games/lets-match-logo.svg" 
                  alt="Let's Match Logo" 
                  className="w-10 h-10"
                />
              </div>
              <span className="text-xl font-bold text-white drop-shadow-md">StudyQuest</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {profile ? (
              <>
                <Link href="/messages" className="text-sm text-white hover:text-yellow-200 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition">
                  <MessageCircle className="w-4 h-4" /> Messages
                </Link>
                <Link href="/admin" className="text-sm text-white hover:text-yellow-200 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition font-semibold">
                  ⚙️ Admin
                </Link>
                <button onClick={handleLogout} className="text-sm text-white hover:text-red-200 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-500/20 transition">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-sm text-white hover:text-yellow-200 font-semibold">Sign in</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
