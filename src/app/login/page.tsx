'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(username, password)

    if (success) {
      router.push('/')
    } else {
      setError('Invalid username or password')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md border-2 border-gray-700">
        <h1 className="text-4xl font-bold text-center mb-6 text-white">
          PEER MENTOR GAME
        </h1>
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          LOGIN
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-white mb-2">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white font-bold placeholder-gray-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white font-bold placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-900 border-2 border-red-600 text-red-200 px-4 py-3 rounded-lg font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-bold text-lg"
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-8 text-sm text-white">
          <p className="font-bold mb-3 text-center">DEMO ACCOUNTS:</p>
          <ul className="space-y-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <li className="font-bold">• mentor / mentor123</li>
            <li className="font-bold">• student / student123</li>
            <li className="font-bold">• admin / admin123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}