'use client'

import { MessageCircle, Bell } from 'lucide-react'
import Link from 'next/link'

interface MentorMessage {
  id: string
  senderName: string
  message: string
  timestamp: Date
  unread: boolean
}

export default function MentorMessageBanner({ mentorMessages }: { mentorMessages?: MentorMessage[] }) {
  const messages = mentorMessages || []
  const unreadCount = messages.filter((m) => m.unread).length

  if (messages.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-400 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl">💬</div>
        <div className="flex-1">
          <p className="font-bold text-gray-900">New Messages from Your Mentor!</p>
          <p className="text-sm text-gray-700 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'Check your messages'}
          </p>
          {messages.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              Latest: <span className="font-semibold">{messages[0].senderName}</span> - {messages[0].message.substring(0, 50)}...
            </p>
          )}
        </div>
        <Link
          href="/messages"
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 whitespace-nowrap"
        >
          View Messages
        </Link>
      </div>
    </div>
  )
}
