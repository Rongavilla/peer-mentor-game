'use client';

import { useState, useEffect } from 'react';
import { MatchScore } from '@/types';
import { Search, Filter, Loader2, UserPlus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkillMatching() {
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    fetchMatches();
  }, [skillFilter, courseFilter]);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (skillFilter) params.append('skill', skillFilter);
      if (courseFilter) params.append('course', courseFilter);

      const response = await fetch(`/api/matching?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    toast.success('Connection request sent! (Demo mode)');
  };

  const filteredMatches = matches.filter(
    (match) =>
      match.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.profile.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <input
            type="text"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="Filter by skill..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="text"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            placeholder="Filter by course..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Matches List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600">No matches found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <div
              key={match.userId}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Profile Picture */}
                  <img
                    src={match.profile.profilePicture}
                    alt={match.profile.name}
                    className="w-16 h-16 rounded-full border-2 border-indigo-500"
                  />

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {match.profile.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.profile.status === 'mentor'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {match.profile.status === 'mentor' ? '🎯 Mentor' : '🎓 Mentee'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      @{match.profile.username} • {match.profile.grade}
                    </p>

                    {/* Match Score */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {match.compatibilityScore}% Match
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {match.profile.course}
                      </span>
                    </div>

                    {/* Match Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-sm font-bold text-blue-700">
                          {match.skillsMatch}%
                        </div>
                        <div className="text-xs text-blue-600">Skills</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-sm font-bold text-green-700">
                          {match.courseMatch}%
                        </div>
                        <div className="text-xs text-green-600">Course</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="text-sm font-bold text-purple-700">
                          {match.hobbiesMatch}%
                        </div>
                        <div className="text-xs text-purple-600">Hobbies</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <div className="text-sm font-bold text-orange-700">
                          {match.gradeLevelMatch}%
                        </div>
                        <div className="text-xs text-orange-600">Grade</div>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {match.matchReasons.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Why this match:
                        </p>
                        <ul className="space-y-1">
                          {match.matchReasons.map((reason, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start">
                              <span className="text-green-500 mr-1">✓</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2">
                      {match.profile.expertise.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {match.profile.expertise.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{match.profile.expertise.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <button
                  onClick={() => handleConnect(match.userId)}
                  className="ml-4 flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
