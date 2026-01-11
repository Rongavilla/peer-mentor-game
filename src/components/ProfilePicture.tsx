'use client'
import React, { useState, useEffect } from 'react'
import ChangeProfileModal from './ChangeProfileModal'

export default function ProfilePicture({ initial }: { initial?: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    setUrl(localStorage.getItem('profilePicture') ?? initial ?? null)
  }, [initial])

  function handleUpdated(newUrl: string) {
    setUrl(newUrl)
    localStorage.setItem('profilePicture', newUrl)
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border">
          <img src={url ?? '/default-avatar.png'} alt="profile" className="w-full h-full object-cover" />
        </div>
        <button onClick={() => setOpen(true)} className="border px-3 py-1 rounded">Change Profile</button>
      </div>

      <ChangeProfileModal open={open} onClose={() => setOpen(false)} onUpdated={handleUpdated} current={url ?? undefined} />
    </div>
  )
}