'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { saveUserToDatabase, saveActivityLog } from '@/lib/database'
import { LogIn, User, Lock, ChevronRight } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function SignInPage() {
  const router = useRouter()
  const setProfile = useUserStore((s) => s.setProfile)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Sign in failed')
      } else {
        setProfile(data.profile)
        saveUserToDatabase(data.profile)
        if (data.activityLog) {
          saveActivityLog(data.activityLog)
        }
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Branding and Features */}
            <div className="text-white space-y-8 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-block">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold">SQ</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Ready to level up your learning? Sign in to continue your journey with StudyQuest.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mt-1 group-hover:bg-blue-500/40 transition-colors">
                    <span className="text-blue-300">🎮</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Play Interactive Games</h3>
                    <p className="text-sm text-gray-400">Master IT skills through engaging gameplay</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mt-1 group-hover:bg-purple-500/40 transition-colors">
                    <span className="text-purple-300">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI-Powered Matching</h3>
                    <p className="text-sm text-gray-400">Get matched with perfect mentors instantly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mt-1 group-hover:bg-pink-500/40 transition-colors">
                    <span className="text-pink-300">⭐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Earn Badges & Rewards</h3>
                    <p className="text-sm text-gray-400">Showcase your expertise and achievements</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="order-1 lg:order-2">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 lg:p-10 shadow-2xl hover:bg-white/15 transition-all duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                  <p className="text-gray-300">Access your StudyQuest account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                      <div className="relative flex items-center">
                        <User className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                          placeholder="your username"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-purple-500/50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <p className="text-center text-gray-300 text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                      Sign up now
                    </Link>
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href="/admin/login"
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50 text-sm"
                    >
                      Admin Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
