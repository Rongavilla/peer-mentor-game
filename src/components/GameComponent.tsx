'use client'

import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '@/game/config'
import { useSocket } from '@/contexts/SocketContext'
import PlayerList from './PlayerList'
import AIChat from './AIChat'

export default function GameComponent() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const { socket, players, movePlayer } = useSocket()

  useEffect(() => {
    // Initialize Phaser game only on client side
    if (typeof window !== 'undefined' && !gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig)

      // Set up event bridges between Phaser and Socket.IO
      const registry = gameRef.current.registry

      // Listen for move events from Phaser
      registry.events.on('move-player', (data: { x: number; y: number }) => {
        movePlayer(data.x, data.y)
      })
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [movePlayer])

  // Emit socket events to Phaser registry
  useEffect(() => {
    if (!gameRef.current || !socket) return

    const registry = gameRef.current.registry

    socket.on('player-joined', (data) => {
      registry.events.emit('player-joined', data)
    })

    socket.on('player-left', (data) => {
      registry.events.emit('player-left', data)
    })

    socket.on('player-moved', (data) => {
      registry.events.emit('player-moved', data)
    })

    return () => {
      socket.off('player-joined')
      socket.off('player-left')
      socket.off('player-moved')
    }
  }, [socket])

  return (
    <>
      <div id="game-container" />
      <PlayerList />
      <AIChat />
    </>
  )
}