'use client'

import { useState, useEffect } from 'react'
import { X, MessageCircle, User, Bell, CheckCircle } from 'lucide-react'

interface MenteeProfile {
  id: string
  name: string
  avatar: string
  assessmentScore: number
  badge: string
  badgeIcon: string
  expertise: string[]
  needsHelp: string[]
  assignedMentorId: string
  assignedTime: Date
  status: 'pending' | 'accepted' | 'in-progress'
}

// Mock mentee data that would be generated after assessment
export const mockMenteeNotifications: MenteeProfile[] = [
  {
    id: 'mentee1',
    name: 'John Doe',
    avatar: '👨‍🎓',
    assessmentScore: 12,
    badge: 'System Sage',
    badgeIcon: '⚙️',
    expertise: ['Data Structures', 'Operating Systems'],
    needsHelp: ['Networking', 'Database Design'],
    assignedMentorId: 'mentor1',
    assignedTime: new Date(Date.now() - 3600000),
    status: 'pending',
  },
]

export default function MentorNotifications() {
  const [notifications, setNotifications] = useState<MenteeProfile[]>([])
  const [selectedMentee, setSelectedMentee] = useState<MenteeProfile | null>(null)
  const [showMenteeProfile, setShowMenteeProfile] = useState(false)

  useEffect(() => {
    // Simulate receiving notifications
    setNotifications(mockMenteeNotifications)
  }, [])

  const handleAcceptMentee = (menteeId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === menteeId ? { ...n, status: 'accepted' } : n
      )
    )
  }

  const handleDeclineMentee = (menteeId: string) => {
    setNotifications(notifications.filter((n) => n.id !== menteeId))
  }

  const handleViewProfile = (mentee: MenteeProfile) => {
    setSelectedMentee(mentee)
    setShowMenteeProfile(true)
  }

  if (showMenteeProfile && selectedMentee) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mentee Profile</h2>
            <button
              onClick={() => setShowMenteeProfile(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mentee Info */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">{selectedMentee.avatar}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedMentee.name}</h3>
                <p className="text-gray-600">Mentee ID: {selectedMentee.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Assessment Score</p>
                <p className="text-2xl font-bold text-cyan-600">{selectedMentee.assessmentScore}/20</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Badge Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedMentee.badgeIcon} {selectedMentee.badge}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 font-semibold mb-2">Strengths:</p>
              <div className="flex flex-wrap gap-2">
                {selectedMentee.expertise.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 text-xs rounded-full font-semibold">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-700 font-semibold mb-2">Areas to Improve:</p>
              <div className="flex flex-wrap gap-2">
                {selectedMentee.needsHelp.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-semibold">
                    ⚠️ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mentor Notes Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-300">
            <p className="text-blue-900 font-bold text-lg mb-3">📝 Mentoring Plan</p>
            <p className="text-blue-800 text-sm mb-4">
              Based on {selectedMentee.name}'s assessment results, focus on:
            </p>
            <ol className="text-blue-800 text-sm space-y-2">
              <li>✅ Conduct initial assessment meeting to understand learning goals</li>
              <li>✅ Create personalized learning plan focusing on {selectedMentee.needsHelp.join(', ')}</li>
              <li>✅ Schedule weekly 1-on-1 sessions</li>
              <li>✅ Provide coding challenges and practical projects</li>
              <li>✅ Track progress and adjust curriculum as needed</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowMenteeProfile(false)}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
            >
              Back to Notifications
            </button>
            <button
              onClick={() => {
                handleAcceptMentee(selectedMentee.id)
                setShowMenteeProfile(false)
              }}
              className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
            >
              💬 Start Messaging
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Bell size={32} className="text-cyan-600" />
          Mentee Notifications
        </h2>
        <p className="text-gray-600">
          {notifications.length} mentee{notifications.length !== 1 ? 's' : ''} waiting for your guidance
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No new mentee notifications at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((mentee) => (
            <div
              key={mentee.id}
              className={`rounded-lg p-6 border-2 transition-all ${
                mentee.status === 'pending'
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-green-50 border-green-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-5xl">{mentee.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{mentee.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">ID: {mentee.id}</p>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{mentee.badgeIcon}</div>
                      <span className="text-sm font-semibold text-gray-700">
                        {mentee.badge} ({mentee.assessmentScore}/20)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-2">
                    {mentee.status === 'pending' ? '⏳ Pending Response' : '✅ Accepted'}
                  </p>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-300">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Strengths:</span> {mentee.expertise.join(', ')}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Needs Help With:</span> {mentee.needsHelp.join(', ')}
                </p>
              </div>

              {mentee.status === 'pending' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewProfile(mentee)}
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 flex items-center justify-center gap-2"
                  >
                    <User size={18} />
                    View Profile & Chat
                  </button>
                  <button
                    onClick={() => handleDeclineMentee(mentee.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewProfile(mentee)}
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Continue Chat
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
