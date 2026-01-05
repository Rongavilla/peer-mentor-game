'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { mockBadges } from '@/lib/mockData';
import ProfileCard from '@/components/ProfileCard';
import Settings from '@/components/Settings';
import BadgeDisplay from '@/components/BadgeDisplay';
import SkillMatching from '@/components/SkillMatching';
import DashboardTab from '@/components/DashboardTab';
import { Settings as SettingsIcon, Home, Award, Users } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

type Tab = 'dashboard' | 'badges' | 'matching';

export default function DashboardPage() {
  const router = useRouter();
  const { profile, setProfile, setStatus } = useUserStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    // If not signed in, redirect to sign-in
    if (!profile) {
      router.push('/signin');
    }
  }, [profile, router]);

  const handleStatusChange = async (newStatus: 'mentee' | 'mentor') => {
    setStatus(newStatus);
    // In production, update database
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success && profile) {
        setProfile({ ...profile, profilePicture: data.url });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
    setShowImageUpload(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StudyQuest
              </h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'badges'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Badges</span>
              </button>
              <button
                onClick={() => setActiveTab('matching')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'matching'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Find {profile.status === 'mentee' ? 'Mentors' : 'Mentees'}</span>
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                profile.status === 'mentor'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {profile.status === 'mentor' ? '🎯 Mentor Mode' : '🎓 Mentee Mode'}
              </span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <SettingsIcon className="w-6 h-6" />
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
            {activeTab === 'dashboard' && (
              <DashboardTab profile={profile} badges={mockBadges} />
            )}
            {activeTab === 'badges' && <BadgeDisplay badges={mockBadges} />}
            {activeTab === 'matching' && <SkillMatching />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileCard
              profile={profile}
              onStatusChange={handleStatusChange}
              onProfilePictureClick={() => setShowImageUpload(true)}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Image Upload Input */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Upload Profile Picture
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowImageUpload(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
