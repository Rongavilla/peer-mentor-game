'use client'

import React from 'react'
import { useSocket } from '@/contexts/SocketContext'

export default function PlayerList() {
  const { players, currentRoom, connected } = useSocket()

  if (!currentRoom) {
    return null
  }

  return (
    <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 rounded-lg p-4 min-w-[200px] shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold">Players</h3>
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      
      <div className="text-sm text-gray-300 mb-2">
        Room: {currentRoom.name}
      </div>
      
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center space-x-2 bg-gray-700 rounded px-3 py-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white text-sm">{player.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-400 text-center">
        {players.length} / {currentRoom.maxPlayers} players
      </div>
    </div>
  )
}
