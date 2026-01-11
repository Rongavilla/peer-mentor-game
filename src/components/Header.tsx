'use client'

import Link from 'next/link'
import { useUserStore } from '@/store/userStore'
import { Users, LogIn } from 'lucide-react'

export default function Header() {
  const profile = useUserStore((s) => s.profile)

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-md">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyQuest</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {profile ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-700 hover:text-gray-900">Dashboard</Link>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700">
                  <img src={profile.profilePicture} alt="avatar" className="w-6 h-6 rounded-full" />
                  <span className="text-sm">{profile.username}</span>
                </div>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign in</span>
                </Link>
                <Link href="/signup" className="text-sm text-indigo-600 font-medium">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
