'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { GradeLevel } from '@/types';
import { Upload, X, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const gradeLevels: GradeLevel[] = [
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
  'College 1st Year', 'College 2nd Year', 'College 3rd Year', 'College 4th Year'
];

const commonHobbies = [
  'Gaming', 'Programming', 'Reading', 'Music', 'Art', 'Photography',
  'Sports', 'Writing', 'Cooking', 'Travel', 'Movies', 'Dancing'
];

interface ProfileEditorProps {
  onClose: () => void;
}

export default function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { profile, updateProfile } = useUserStore();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    username: profile?.username || '',
    grade: profile?.grade || 'College 1st Year',
    course: profile?.course || '',
    // Allow empty string while editing to avoid setting NaN on the number input
    age: profile?.age ?? '',
    hobbies: profile?.hobbies || [],
    expertise: profile?.expertise || [],
  });

  const [newHobby, setNewHobby] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [suggestedExpertise, setSuggestedExpertise] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addHobby = (hobby: string) => {
    if (hobby && !formData.hobbies.includes(hobby)) {
      handleInputChange('hobbies', [...formData.hobbies, hobby]);
      setNewHobby('');
    }
  };

  const removeHobby = (hobby: string) => {
    handleInputChange('hobbies', formData.hobbies.filter((h) => h !== hobby));
  };

  const addExpertise = (skill: string) => {
    if (skill && !formData.expertise.includes(skill)) {
      handleInputChange('expertise', [...formData.expertise, skill]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (skill: string) => {
    handleInputChange('expertise', formData.expertise.filter((e) => e !== skill));
  };

  const fetchAISuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch('/api/ai/suggest-expertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: formData.course,
          hobbies: formData.hobbies,
          grade: formData.grade,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuggestedExpertise(data.suggestions.filter(
          (s: string) => !formData.expertise.includes(s)
        ));
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Ensure age is a number before sending (default to 18 if empty)
      const payload = {
        ...formData,
        age: formData.age === '' || formData.age === null || formData.age === undefined
          ? 18
          : Number(formData.age),
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        updateProfile(payload);
        toast.success('Profile updated successfully!');
        onClose();
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade *
          </label>
          <select
            value={formData.grade}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {gradeLevels.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            min="13"
            max="100"
            value={formData.age}
            onChange={(e) => {
              const v = e.target.value;
              // Keep empty string while the user clears input to avoid NaN
              handleInputChange('age', v === '' ? '' : parseInt(v, 10));
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course/Strand *
        </label>
        <input
          type="text"
          value={formData.course}
          onChange={(e) => handleInputChange('course', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., BS Computer Science"
        />
      </div>

      {/* Hobbies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hobbies
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {commonHobbies.map((hobby) => (
            <button
              key={hobby}
              onClick={() => addHobby(hobby)}
              disabled={formData.hobbies.includes(hobby)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.hobbies.includes(hobby)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {hobby}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHobby(newHobby)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Add custom hobby"
          />
          <button
            onClick={() => addHobby(newHobby)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.hobbies.map((hobby) => (
            <span
              key={hobby}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{hobby}</span>
              <button onClick={() => removeHobby(hobby)} className="hover:text-indigo-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Expertise with AI Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Expertise
          </label>
          <button
            onClick={fetchAISuggestions}
            disabled={isLoadingSuggestions}
            className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            {isLoadingSuggestions ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>AI Suggestions</span>
          </button>
        </div>

        {suggestedExpertise.length > 0 && (
          <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700 font-medium mb-2">✨ Suggested Skills:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedExpertise.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addExpertise(skill)}
                  className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-300 hover:bg-purple-100"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newExpertise}
            onChange={(e) => setNewExpertise(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addExpertise(newExpertise)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Add expertise/skill"
          />
          <button
            onClick={() => addExpertise(newExpertise)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.expertise.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{skill}</span>
              <button onClick={() => removeExpertise(skill)} className="hover:text-indigo-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}
