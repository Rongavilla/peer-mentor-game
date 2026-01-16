'use client'

import GamesSignage from '@/components/GamesSignage'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { mockBadges } from '@/lib/mockData'
import ProfileCard from '@/components/ProfileCard'
import Settings from '@/components/Settings'
import AvatarSelector from '@/components/AvatarSelector'
import BadgeDisplay from '@/components/BadgeDisplay'
import SkillMatching from '@/components/SkillMatching'
import DashboardTab from '@/components/DashboardTab'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Settings as SettingsIcon, Home, Award, Users, LogOut } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

type Tab = 'dashboard' | 'badges' | 'matching'

export default function DashboardPage() {
  const router = useRouter()
  const { profile, setProfile, setStatus, clearProfile } = useUserStore()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)

  useEffect(() => {
    if (!profile) {
      router.push('/signin')
    }
  }, [profile, router])

  const handleStatusChange = async (newStatus: 'mentee' | 'mentor') => {
    setStatus(newStatus)
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleAvatarSelect = async (avatarUrl: string) => {
    if (profile) {
      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profilePicture: avatarUrl }),
        })
        const data = await response.json()
        if (data.success) {
          setProfile({ ...profile, profilePicture: avatarUrl })
        }
      } catch (error) {
        console.error('Failed to update avatar:', error)
      }
    }
    setShowAvatarSelector(false)
  }

  const handleLogout = async () => {
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
    clearProfile()
    router.push('/')
  }

  if (!profile) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Toaster position="top-right" />

        {/* Header */}
        <header className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  StudyQuest
                </h1>
              </div>

              {/* Navigation Tabs */}
              <nav className="flex space-x-1 bg-white/10 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'dashboard' ? 'bg-white/20 text-white shadow-md border border-white/30' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('badges')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'badges' ? 'bg-white/20 text-white shadow-md border border-white/30' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Badges</span>
                </button>
                <button
                  onClick={() => setActiveTab('matching')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'matching' ? 'bg-white/20 text-white shadow-md border border-white/30' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Find {profile.status === 'mentee' ? 'Mentors' : 'Mentees'}</span>
                </button>
              </nav>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                    profile.status === 'mentor' ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50' : 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                  }`}
                >
                  {profile.status === 'mentor' ? '🎯 Mentor Mode' : '🎓 Mentee Mode'}
                </span>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-transparent hover:border-white/20"
                  title="Settings"
                >
                  <SettingsIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-300 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                  title="Sign out"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'dashboard' && <DashboardTab profile={profile} badges={mockBadges} />}
              {activeTab === 'badges' && <BadgeDisplay badges={mockBadges} />}
              {activeTab === 'matching' && <SkillMatching />}

              {/* Add Games Signage below the dashboard tab content */}
              <div className="mt-8">
                <GamesSignage />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ProfileCard profile={profile} onStatusChange={handleStatusChange} onProfilePictureClick={() => setShowAvatarSelector(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelectAvatar={handleAvatarSelect}
        currentUsername={profile?.username || 'user'}
      />
    </div>
  )
}