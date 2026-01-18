'use client';

import { useState } from 'react';
import { UserProfile, UserStatus } from '@/types';
import { Camera, User } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  onStatusChange: (status: UserStatus) => void;
  onProfilePictureClick: () => void;
}

export default function ProfileCard({
  profile,
  onStatusChange,
  onProfilePictureClick,
}: ProfileCardProps) {

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
            <img
              src={profile.profilePicture}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={onProfilePictureClick}
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100"
            title="Change profile picture"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">{profile.name}</h2>
        <p className="text-gray-500">@{profile.username}</p>
      </div>

      {/* Profile Info */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Grade:</span>
          <span className="font-semibold text-gray-900">{profile.grade}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Course:</span>
          <span className="font-semibold text-gray-900">{profile.course}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Age:</span>
          <span className="font-semibold text-gray-900">{profile.age}</span>
        </div>
      </div>

      {/* Expertise Tags */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {profile.expertise.slice(0, 6).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {profile.expertise.length > 6 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{profile.expertise.length - 6} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}