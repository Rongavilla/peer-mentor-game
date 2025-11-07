'use client'

import React, { useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'

interface LobbyProps {
  onRoomJoined: () => void
}

export default function Lobby({ onRoomJoined }: LobbyProps) {
  const { createRoom, joinRoom, connected } = useSocket()
  const [playerName, setPlayerName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [roomIdToJoin, setRoomIdToJoin] = useState('')
  const [showCreateRoom, setShowCreateRoom] = useState(true)

  const handleCreateRoom = () => {
    if (playerName.trim() && roomName.trim()) {
      createRoom(roomName, playerName)
      onRoomJoined()
    } else {
      alert('Please enter both player name and room name')
    }
  }

  const handleJoinRoom = () => {
    if (playerName.trim() && roomIdToJoin.trim()) {
      joinRoom(roomIdToJoin, playerName)
      onRoomJoined()
    } else {
      alert('Please enter both player name and room ID')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          CodeQuest Academy
        </h1>
        <p className="text-center text-gray-300 mb-6">Multiplayer Mentorship Game</p>

        {/* Connection Status */}
        <div className="mb-6 flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-300">
            {connected ? 'Connected to server' : 'Connecting...'}
          </span>
        </div>

        {/* Player Name Input */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        {/* Tab Selector */}
        <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setShowCreateRoom(true)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              showCreateRoom
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setShowCreateRoom(false)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              !showCreateRoom
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Join Room
          </button>
        </div>

        {/* Create Room Form */}
        {showCreateRoom ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter room name"
                maxLength={30}
              />
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={!connected}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create & Join Room
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">Room ID</label>
              <input
                type="text"
                value={roomIdToJoin}
                onChange={(e) => setRoomIdToJoin(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter room ID"
              />
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={!connected}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Room
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>🎮 Play together with friends</p>
          <p>🤖 AI-powered mentorship</p>
          <p>🏆 Learn and grow as a team</p>
        </div>
      </div>
    </div>
  )
}
