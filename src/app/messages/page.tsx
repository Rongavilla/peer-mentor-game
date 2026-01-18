'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, Plus, Search, User as UserIcon, Users } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar: string
  recipientId: string
  recipientName: string
  recipientAvatar: string
  text: string
  timestamp: string
  read: boolean
}

interface Conversation {
  conversationId: string
  otherUserId: string
  otherUserName: string
  otherUserAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

interface UserProfile {
  id: string
  name: string
  username: string
  status: 'mentor' | 'mentee'
  expertise?: string[]
  hobbies?: string[]
  profilePicture?: string
}

export default function MessagesPage() {
  const router = useRouter()
  const profile = useUserStore((s) => s.profile)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!profile) {
      router.push('/signin')
    }
  }, [profile, router])

  // Fetch conversations
  useEffect(() => {
    if (!profile) return

    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/messages?userId=${profile.id}`)
        const data = await res.json()
        if (data.success) {
          setConversations(data.conversations)
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      }
    }

    fetchConversations()
    const interval = setInterval(fetchConversations, 3000)
    return () => clearInterval(interval)
  }, [profile])

  // Fetch all users for new conversation
  useEffect(() => {
    if (!showNewConversation) return

    try {
      const allUsersData = JSON.parse(localStorage.getItem('all_users') || '[]')
      // Filter out current user
      const filteredUsers = allUsersData.filter((u: UserProfile) => u.id !== profile?.id)
      setAllUsers(filteredUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [showNewConversation, profile])

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${selectedConversation.conversationId}`)
        const data = await res.json()
        if (data.success) {
          setMessages(data.messages)

          // Mark as read
          await fetch('/api/messages', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId: selectedConversation.conversationId,
              userId: profile?.id,
            }),
          })
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [selectedConversation, profile])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !profile) return

    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: profile.id,
          senderName: profile.name,
          senderAvatar: profile.profilePicture || '',
          recipientId: selectedConversation.otherUserId,
          recipientName: selectedConversation.otherUserName,
          recipientAvatar: selectedConversation.otherUserAvatar,
          text: newMessage,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        const res = await fetch(`/api/messages?conversationId=${selectedConversation.conversationId}`)
        const updatedData = await res.json()
        if (updatedData.success) {
          setMessages(updatedData.messages)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const startConversation = (otherUser: UserProfile) => {
    if (!profile) return

    const conversationId = [profile.id, otherUser.id].sort().join('_')
    setSelectedConversation({
      conversationId,
      otherUserId: otherUser.id,
      otherUserName: otherUser.name,
      otherUserAvatar: otherUser.profilePicture || '',
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    })
    setShowNewConversation(false)
  }

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle size={32} />
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>
          <button
            onClick={() => setShowNewConversation(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Plus size={20} />
            New Message
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="w-1/3 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
            {/* List Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Conversations</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start by clicking "New Message"</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.conversationId}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-blue-50 transition ${
                      selectedConversation?.conversationId === conv.conversationId
                        ? 'bg-blue-100 border-l-4 border-l-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {conv.otherUserAvatar || conv.otherUserName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-900">{conv.otherUserName}</p>
                          {conv.unreadCount > 0 && (
                            <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              {conv.unreadCount}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(conv.lastMessageTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                      {selectedConversation.otherUserAvatar || selectedConversation.otherUserName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedConversation.otherUserName}</p>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <MessageCircle size={40} className="mx-auto mb-2 opacity-30" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Send a message to start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === profile.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[60%] rounded-lg p-4 ${
                            msg.senderId === profile.id
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-300 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs mt-2 opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition flex items-center gap-2"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <MessageCircle size={40} className="mx-auto mb-2 opacity-30" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Plus size={24} />
                Start New Conversation
              </h2>
              <button
                onClick={() => setShowNewConversation(false)}
                className="hover:bg-white/20 p-1 rounded"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <UserIcon size={40} className="mx-auto mb-3 opacity-30" />
                  <p>{searchQuery ? 'No users found' : 'No other users available'}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => startConversation(user)}
                      className="w-full p-4 text-left hover:bg-blue-50 transition flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {user.profilePicture || user.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.status === 'mentor'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.status === 'mentor' ? '👨‍🏫 Mentor' : '👨‍🎓 Mentee'}
                          </span>
                          {user.expertise && user.expertise.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {user.expertise.slice(0, 2).join(', ')}
                              {user.expertise.length > 2 && ` +${user.expertise.length - 2}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-blue-500 hover:text-blue-700">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
