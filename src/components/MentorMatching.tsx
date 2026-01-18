'use client'

import { useState, useEffect } from 'react'
import { Send, X, MessageCircle, User, Award } from 'lucide-react'

interface Mentor {
  id: string
  name: string
  avatar: string
  expertise: string[]
  bio: string
  rating: number
  isAvailable: boolean
}

interface Message {
  id: string
  sender: 'mentor' | 'mentee'
  text: string
  timestamp: Date
}

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '👩‍💻',
    expertise: ['Data Structures', 'Algorithms', 'System Design'],
    bio: 'Senior Software Engineer with 8 years of experience in backend development.',
    rating: 4.9,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Alex Chen',
    avatar: '👨‍💼',
    expertise: ['Database Design', 'SQL', 'DBMS'],
    bio: 'Database architect specializing in enterprise systems and optimization.',
    rating: 4.8,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    avatar: '👩‍🔬',
    expertise: ['Networking', 'Operating Systems', 'System Architecture'],
    bio: 'Tech lead with passion for teaching and mentoring junior developers.',
    rating: 4.7,
    isAvailable: true,
  },
]

export default function MentorMatching({ score, badgeIcon, badgeName }: { score: number; badgeIcon: string; badgeName: string }) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showMessaging, setShowMessaging] = useState(false)
  const [matchedMentor, setMatchedMentor] = useState<Mentor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-match mentor based on score with loading simulation
  useEffect(() => {
    // Simulate AI matching process
    const timer = setTimeout(() => {
      let recommended: Mentor
      if (score < 10) {
        recommended = mockMentors[0] // Sarah for foundational needs
      } else if (score < 15) {
        recommended = mockMentors[1] // Alex for intermediate
      } else {
        recommended = mockMentors[2] // Maria for advanced
      }
      setMatchedMentor(recommended)
      setIsLoading(false)
    }, 2500) // 2.5 second loading animation

    return () => clearTimeout(timer)
  }, [score])

  const handleConnectWithMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setMessages([
      {
        id: '1',
        sender: 'mentor',
        text: `Hi! 👋 I'm ${mentor.name}, your assigned mentor. I've reviewed your assessment and I'm excited to help you on your learning journey! Let's discuss your goals and create a learning plan. Feel free to ask me anything!`,
        timestamp: new Date(),
      },
    ])
    setShowMessaging(true)
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const menteeMsg: Message = {
        id: Date.now().toString(),
        sender: 'mentee',
        text: newMessage,
        timestamp: new Date(),
      }
      setMessages([...messages, menteeMsg])
      setNewMessage('')

      // Simulate mentor response
      setTimeout(() => {
        const mentorResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'mentor',
          text: `That's a great question! Let me explain that in detail. Based on your assessment score of ${score}/20 and your ${badgeName} badge, I think we should focus on strengthening your fundamentals. I'll create a personalized learning plan for you. When are you available for our first session?`,
          timestamp: new Date(Date.now() + 1000),
        }
        setMessages((prev) => [...prev, mentorResponse])
      }, 1500)
    }
  }

  if (showMessaging && selectedMentor) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-96 md:h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{selectedMentor.avatar}</div>
              <div>
                <h3 className="text-lg font-bold">{selectedMentor.name}</h3>
                <p className="text-xs text-cyan-100">⭐ {selectedMentor.rating}/5.0</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowMessaging(false)
                setSelectedMentor(null)
              }}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.sender === 'mentee' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                    msg.sender === 'mentee'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-2 ${msg.sender === 'mentee' ? 'text-cyan-100' : 'text-gray-600'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading Screen while matching mentor
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-5xl animate-bounce">🤖</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Matching in Progress...</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-cyan-600 rounded-full animate-pulse"></div>
                <p className="text-gray-700">Analyzing your assessment...</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-cyan-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <p className="text-gray-700">Finding perfect mentor match...</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-cyan-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <p className="text-gray-700">Preparing personalized pairing...</p>
              </div>
            </div>

            {/* Loading Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-full rounded-full animate-pulse w-full"></div>
            </div>
            <p className="text-sm text-gray-600 mt-4">This usually takes just a moment...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto py-6">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{badgeIcon}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h2>
          <p className="text-xl text-gray-700 mb-4">
            You've earned the <span className="font-bold text-cyan-600">{badgeName}</span> badge with a score of{' '}
            <span className="font-bold text-cyan-600">{score}/20</span>
          </p>
        </div>

        {/* AI Matching Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8 border-2 border-purple-200">
          <p className="text-gray-900 font-bold text-lg mb-3">🤖 AI Mentor Matching Analysis</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Our intelligent matching system has analyzed your assessment results and learning profile. Based on your{' '}
            <span className="font-bold">{badgeName}</span> level and specific knowledge gaps, we've identified the perfect mentor to accelerate your learning journey.
          </p>
        </div>

        {/* Matched Mentor Highlight */}
        {matchedMentor && (
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg p-6 mb-8 border-3 border-cyan-500">
            <p className="text-gray-900 font-bold text-center mb-4">✨ YOUR RECOMMENDED MENTOR</p>
            <div className="flex items-center gap-4 justify-center">
              <div className="text-6xl">{matchedMentor.avatar}</div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{matchedMentor.name}</h3>
                <p className="text-gray-700 text-sm mb-2">{matchedMentor.bio}</p>
                <p className="text-gray-600 text-xs font-semibold">⭐ {matchedMentor.rating}/5.0 Rating</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-cyan-300">
              <p className="text-gray-700 text-sm text-center font-semibold">Expertise:</p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {matchedMentor.expertise.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-cyan-600 text-white text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Available Mentors */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Other Available Mentors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockMentors.map((mentor) => (
              <div
                key={mentor.id}
                className={`rounded-lg p-6 border-2 transition-all ${
                  matchedMentor?.id === mentor.id
                    ? 'border-cyan-600 bg-cyan-50'
                    : 'border-gray-300 bg-white hover:border-cyan-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{mentor.avatar}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{mentor.name}</h4>
                  {matchedMentor?.id === mentor.id && (
                    <p className="text-xs bg-cyan-600 text-white px-3 py-1 rounded-full inline-block mb-2">
                      RECOMMENDED
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mb-3 h-12 overflow-hidden">{mentor.bio}</p>
                  <p className="text-sm font-semibold text-gray-700 mb-3">⭐ {mentor.rating}/5.0</p>
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {mentor.expertise.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleConnectWithMentor(mentor)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
                      matchedMentor?.id === mentor.id
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {matchedMentor?.id === mentor.id ? '💬 Message Mentor' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-6 animate-bounce">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">Scroll down for more</p>
              <svg className="w-6 h-6 text-cyan-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
          <p className="text-blue-900 font-bold text-lg mb-3">📋 Next Steps:</p>
          <ol className="text-blue-800 text-sm space-y-2">
            <li>✅ <span className="font-semibold">Connect with your mentor</span> by clicking "Message Mentor" or "Connect" above</li>
            <li>✅ <span className="font-semibold">Introduce yourself</span> and discuss your learning goals</li>
            <li>✅ <span className="font-semibold">Schedule your first session</span> with your mentor</li>
            <li>✅ <span className="font-semibold">Start your personalized learning plan</span> to improve your IT expertise</li>
          </ol>
        </div>

        {/* Close Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
