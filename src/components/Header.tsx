'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { Users, LogOut } from 'lucide-react'

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
    <header className="bg-white border-b shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Only */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-md">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900">StudyQuest</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {profile ? (
              <>
                <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-sm text-gray-700 hover:text-gray-900">Sign in</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
