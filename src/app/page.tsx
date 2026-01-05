'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

export default function Home() {
  const router = useRouter()
  const profile = useUserStore((s) => s.profile)

  useEffect(() => {
    if (profile) {
      router.push('/dashboard')
    } else {
      router.push('/signin')
    }
  }, [router, profile])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading StudyQuest...</p>
      </div>
    </div>
  )
} 
