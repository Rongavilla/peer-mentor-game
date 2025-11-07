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

      {/* Skill Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Skill Progress</h2>
        </div>
        <div className="space-y-4">
          {profile.expertise.slice(0, 4).map((skill, index) => {
            const progress = 60 + Math.random() * 40; // Mock progress
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{skill}</span>
                  <span className="text-gray-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-3 p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Users className="w-5 h-5" />
            <span>Find {profile.status === 'mentee' ? 'Mentor' : 'Mentee'}</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
            <Award className="w-5 h-5" />
            <span>View Badges</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
            <Activity className="w-5 h-5" />
            <span>Update Profile</span>
          </button>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">React Advanced Patterns</h4>
              <p className="text-sm text-gray-600">with Sarah Chen</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-indigo-600">Tomorrow</p>
              <p className="text-sm text-gray-600">2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Node.js Best Practices</h4>
              <p className="text-sm text-gray-600">with Michael Torres</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-indigo-600">Friday</p>
              <p className="text-sm text-gray-600">4:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
