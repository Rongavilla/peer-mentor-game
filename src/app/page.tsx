'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const GameComponent = dynamic(() => import('@/components/GameComponent'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full h-screen">
        <GameComponent />
      </div>
    </main>
  )
}
