'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface Player {
  id: string
  name: string
  x: number
  y: number
  roomId: string
}

interface Room {
  id: string
  name: string
  players: Player[]
  maxPlayers: number
  createdAt: number
}

interface SocketContextType {
  socket: Socket | null
  connected: boolean
  currentRoom: Room | null
  players: Player[]
  createRoom: (roomName: string, playerName: string) => void
  joinRoom: (roomId: string, playerName: string) => void
  leaveRoom: () => void
  sendMessage: (message: string) => void
  movePlayer: (x: number, y: number) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001'
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      console.log('Connected to game server')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from game server')
      setConnected(false)
    })

    newSocket.on('room-created', (data: { roomId: string; room: Room }) => {
      console.log('Room created:', data)
      setCurrentRoom(data.room)
      setPlayers(data.room.players)
    })

    newSocket.on('room-joined', (data: { roomId: string; room: Room }) => {
      console.log('Room joined:', data)
      setCurrentRoom(data.room)
      setPlayers(data.room.players)
    })

    newSocket.on('player-joined', (data: { player: Player }) => {
      console.log('Player joined:', data)
      setPlayers((prev) => [...prev, data.player])
    })

    newSocket.on('player-left', (data: { playerId: string; playerName: string }) => {
      console.log('Player left:', data)
      setPlayers((prev) => prev.filter((p) => p.id !== data.playerId))
    })

    newSocket.on('player-moved', (data: { playerId: string; x: number; y: number }) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === data.playerId ? { ...p, x: data.x, y: data.y } : p))
      )
    })

    newSocket.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message)
      alert(data.message)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const createRoom = useCallback(
    (roomName: string, playerName: string) => {
      if (socket) {
        socket.emit('create-room', { roomName, playerName })
      }
    },
    [socket]
  )

  const joinRoom = useCallback(
    (roomId: string, playerName: string) => {
      if (socket) {
        socket.emit('join-room', { roomId, playerName })
      }
    },
    [socket]
  )

  const leaveRoom = useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('leave-room', { roomId: currentRoom.id })
      setCurrentRoom(null)
      setPlayers([])
    }
  }, [socket, currentRoom])

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && currentRoom) {
        socket.emit('ai-chat', { message, roomId: currentRoom.id })
      }
    },
    [socket, currentRoom]
  )

  const movePlayer = useCallback(
    (x: number, y: number) => {
      if (socket && currentRoom) {
        socket.emit('player-move', { x, y, roomId: currentRoom.id })
      }
    },
    [socket, currentRoom]
  )

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        currentRoom,
        players,
        createRoom,
        joinRoom,
        leaveRoom,
        sendMessage,
        movePlayer,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
