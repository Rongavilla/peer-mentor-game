'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, User, Clock } from 'lucide-react'

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

interface MessagingProps {
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string
}

export default function Messaging({
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: MessagingProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMessaging, setShowMessaging] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  useEffect(() => {
    if (!showMessaging) return

    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/messages?userId=${currentUserId}`)
        const data = await res.json()
        if (data.success) {
          setConversations(data.conversations)
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      }
    }

    fetchConversations()
    const interval = setInterval(fetchConversations, 3000) // Refresh every 3 seconds
    return () => clearInterval(interval)
  }, [currentUserId, showMessaging])

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
              userId: currentUserId,
            }),
          })
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 2000) // Refresh every 2 seconds
    return () => clearInterval(interval)
  }, [selectedConversation, currentUserId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          recipientId: selectedConversation.otherUserId,
          recipientName: selectedConversation.otherUserName,
          recipientAvatar: selectedConversation.otherUserAvatar,
          text: newMessage,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        // Refetch messages
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

  const startConversation = (otherUserId: string, otherUserName: string, otherUserAvatar: string) => {
    const conversationId = [currentUserId, otherUserId].sort().join('_')
    setSelectedConversation({
      conversationId,
      otherUserId,
      otherUserName,
      otherUserAvatar,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    })
  }

  return (
    <div className="relative">
      {/* Floating Message Button */}
      <button
        onClick={() => setShowMessaging(!showMessaging)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-40"
        title="Messages"
      >
        <MessageCircle size={24} />
        {conversations.some((c) => c.unreadCount > 0) && (
          <div className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
            {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
          </div>
        )}
      </button>

      {/* Messaging Modal */}
      {showMessaging && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl z-50 w-96 h-[600px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-bold">Messages</h3>
            </div>
            <button
              onClick={() => setShowMessaging(false)}
              className="hover:bg-white/20 p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.conversationId}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-3 text-left border-b border-gray-200 hover:bg-gray-100 transition ${
                      selectedConversation?.conversationId === conv.conversationId
                        ? 'bg-blue-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                        {conv.otherUserAvatar || conv.otherUserName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{conv.otherUserName}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200 bg-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                    {selectedConversation.otherUserAvatar || selectedConversation.otherUserName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{selectedConversation.otherUserName}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Start a conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderId === currentUserId
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-300 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70">
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

                {/* Input */}
                <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
