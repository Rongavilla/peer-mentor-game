'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SocketProvider } from '@/contexts/SocketContext'
import Lobby from '@/components/Lobby'

const GameComponent = dynamic(() => import('@/components/GameComponent'), {
  ssr: false,
})

export default function Home() {
  const [inGame, setInGame] = useState(false)

  return (
    <SocketProvider>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {!inGame ? (
          <Lobby onRoomJoined={() => setInGame(true)} />
        ) : (
          <div className="w-full h-screen relative">
            <GameComponent />
          </div>
        )}
      </main>
    </SocketProvider>
  )
}
