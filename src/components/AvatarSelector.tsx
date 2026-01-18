'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
  currentUsername: string;
}

const AVATAR_STYLES = [
  'avataaars',
  'avataaars-neutral',
  'big-ears',
  'big-ears-neutral',
  'bigsmile',
  'bottts',
  'bottts-neutral',
  'croodles',
  'croodles-neutral',
  'fun-emoji',
  'lorelei',
  'lorelei-neutral',
  'micah',
  'miniavs',
  'notionists',
  'notionists-neutral',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
  'rings',
  'shapes',
  'thumbs',
];

export default function AvatarSelector({ isOpen, onClose, onSelectAvatar, currentUsername }: AvatarSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState('avataaars');

  const handleSelectAvatar = () => {
    const avatarUrl = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodeURIComponent(
      currentUsername
    )}`;
    onSelectAvatar(avatarUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Choose Avatar Style</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-600 mb-2">Preview:</p>
            <img
              src={`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodeURIComponent(
                currentUsername
              )}`}
              alt="Avatar Preview"
              className="w-20 h-20 mx-auto rounded-full border-4 border-indigo-600"
            />
          </div>

          {/* Style Selection Grid */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Avatar Styles:</p>
            <div className="grid grid-cols-5 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {AVATAR_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedStyle === style
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white'
                  }`}
                  title={style}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(
                      currentUsername
                    )}`}
                    alt={style}
                    className="w-full h-auto rounded"
                  />
                  <p className="text-xs text-gray-600 truncate mt-1">{style}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSelectAvatar}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
