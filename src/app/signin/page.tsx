'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { LogIn, User, Lock } from 'lucide-react'

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
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/40 to-purple-50/40 p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left visual panel */}
        <div className="hidden md:flex flex-col items-start justify-center p-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold">StudyQuest</h1>
            <p className="mt-2 text-sm opacity-90">Find mentors, share expertise, and level up together.</p>
          </div>
          <div className="mt-6 bg-white/10 p-4 rounded-lg">
            <p className="text-sm">Fast, friendly, and made for learning.</p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl shadow-md p-8 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-50 p-2 rounded-full">
                <LogIn className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Welcome back</h2>
                <p className="text-sm text-gray-500">Sign in to continue to StudyQuest</p>
              </div>
            </div>
            <div>
              <Link href="/signup" className="text-sm text-indigo-600 font-medium">Create account</Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User className="w-4 h-4" /></span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 block w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock className="w-4 h-4" /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Don't have an account? <Link href="/signup" className="text-indigo-600 font-medium">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
