'use client';

import { Badge } from '@/types';
import { Lock, CheckCircle } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{badges.filter(b => b.unlocked).length}</div>
          <div className="text-sm opacity-90">Earned</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{badges.filter(b => !b.unlocked).length}</div>
          <div className="text-sm opacity-90">Locked</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">
            {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
          </div>
          <div className="text-sm opacity-90">Complete</div>
        </div>
      </div>

      {/* Badge Categories */}
      {['profile', 'mentorship', 'skills', 'activity', 'reviews'].map((category) => {
        const categoryBadges = badges.filter((b) => b.category === category);
        if (categoryBadges.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
              {category} Badges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative border-2 rounded-xl p-4 transition-all ${
                    badge.unlocked
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50'
                      : 'border-gray-200 bg-gray-50 opacity-75'
                  }`}
                >
                  {/* Badge Icon */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`text-4xl ${
                        badge.unlocked ? 'filter-none' : 'grayscale opacity-50'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    {badge.unlocked ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Badge Info */}
                  <h4 className="font-bold text-gray-900 mb-1">{badge.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

                  {/* Progress Bar */}
                  {!badge.unlocked && badge.maxProgress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>
                          {badge.progress}/{badge.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500"
                          style={{
                            width: `${(badge.progress / badge.maxProgress) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Unlock Date */}
                  {badge.unlocked && badge.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
