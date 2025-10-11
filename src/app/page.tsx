'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const GameComponent = dynamic(() => import('@/components/GameComponent'), {
  ssr: false,
})

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // If not authenticated, show landing page with sign in/sign up options
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            PEER MENTOR GAME
          </h1>
          <p className="text-2xl font-bold text-gray-300 mb-12">
            Welcome! Please sign in or create an account to continue
          </p>
          
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white font-bold text-xl py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              SIGN IN
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="bg-green-600 text-white font-bold text-xl py-4 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              SIGN UP
            </button>
          </div>

          <div className="mt-12 bg-gray-900 p-6 rounded-lg border-2 border-gray-700 inline-block">
            <p className="text-white font-bold mb-3">DEMO ACCOUNTS:</p>
            <ul className="text-white font-bold space-y-2 text-left">
              <li>• mentor / mentor123</li>
              <li>• student / student123</li>
              <li>• admin / admin123</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl font-bold text-white">LOADING...</div>
      </div>
    )
  }

  // Authenticated - show game
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="flex flex-col items-center justify-center">
        <div className="w-full h-screen">
          <GameComponent />
        </div>
      </main>
    </div>
  )
}