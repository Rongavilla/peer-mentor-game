'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/contexts/SocketContext'

interface Message {
  id: string
  sender: string
  text: string
  timestamp: number
  isAI?: boolean
}

export default function AIChat() {
  const { socket, currentRoom } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!socket) return

    socket.on('ai-message', (data: { playerId: string; message: string; timestamp: number }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${data.timestamp}-${data.playerId}`,
          sender: 'Player',
          text: data.message,
          timestamp: data.timestamp,
        },
      ])
    })

    return () => {
      socket.off('ai-message')
    }
  }, [socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentRoom) return

    const userMessage = inputMessage.trim()
    const timestamp = Date.now()
    setInputMessage('')
    setIsLoading(true)

    // Add user message
    const userMsg: Message = {
      id: `${timestamp}-user`,
      sender: 'You',
      text: userMessage,
      timestamp: timestamp,
    }
    setMessages((prev) => [...prev, userMsg])

    try {
      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: `Room: ${currentRoom.name}`,
        }),
      })

      const data = await response.json()

      // Add AI response
      const aiMsg: Message = {
        id: `${data.timestamp}-ai`,
        sender: 'AI Mentor',
        text: data.response,
        timestamp: data.timestamp,
        isAI: true,
      }
      setMessages((prev) => [...prev, aiMsg])

      // Broadcast to other players
      if (socket && currentRoom) {
        socket.emit('ai-chat', {
          message: `AI Mentor: ${data.response}`,
          roomId: currentRoom.id,
        })
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMsg: Message = {
        id: `${Date.now()}-error`,
        sender: 'System',
        text: 'Failed to get AI response. Please try again.',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!currentRoom) return null

  return (
    <div className="absolute bottom-4 left-4 w-80 bg-gray-800 bg-opacity-95 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white font-bold">🤖 AI Mentor</span>
        </div>
        <button className="text-white text-xl">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Chat Content */}
      {isExpanded && (
        <>
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-8">
                <p>👋 Hi! I'm your AI Mentor.</p>
                <p className="mt-2">Ask me anything about coding or learning!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${
                    msg.isAI ? 'bg-purple-900 bg-opacity-50' : 'bg-gray-700'
                  } rounded-lg p-3`}
                >
                  <div className="text-xs text-gray-400 mb-1">{msg.sender}</div>
                  <div className="text-white text-sm">{msg.text}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="bg-purple-900 bg-opacity-50 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">AI Mentor</div>
                <div className="text-white text-sm">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-800 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask AI mentor..."
                disabled={isLoading}
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
