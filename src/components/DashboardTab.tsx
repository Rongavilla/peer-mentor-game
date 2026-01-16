'use client';

import { UserProfile, Badge } from '@/types';
import { Activity, Award, BookOpen, Calendar, TrendingUp, Users } from 'lucide-react';

interface DashboardTabProps {
  profile: UserProfile;
  badges: Badge[];
}

export default function DashboardTab({ profile, badges }: DashboardTabProps) {
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const recentBadges = unlockedBadges.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile.name}! 👋
        </h1>
        <p className="text-indigo-100">
          You're currently in <strong>{profile.status === 'mentee' ? 'Mentee' : 'Mentor'}</strong> mode
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">3</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Active Mentorships</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">2</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Upcoming Sessions</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-gray-900">{unlockedBadges.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Badges Earned</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">85%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Profile Complete</h3>
        </div>
      </div>

      {/* Recent Achievements */}
      {recentBadges.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Recent Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center space-x-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
              >
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
