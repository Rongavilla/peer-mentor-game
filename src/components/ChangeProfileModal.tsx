'use client'
import React, { useState, useRef } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onUpdated: (url: string) => void
  current?: string
}

export default function ChangeProfileModal({ open, onClose, onUpdated, current }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  if (!open) return null

  function handleChoose() {
    fileRef.current?.click()
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    console.log('handleFile called, file:', file)
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      console.log('file read, setting preview')
      setPreview(String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  async function handleConfirm() {
    if (!preview) {
      console.log('Confirm blocked: no preview')
      return
    }
    try {
      setLoading(true)
      console.log('Uploading: preview length', preview.length)
      const body = JSON.stringify({ data: preview, name: `profile-${Date.now()}.png` })
      const res = await fetch('/api/profile/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      const json = await res.json()
      console.log('upload response', res.status, json)
      if (res.ok && json?.url) {
        const urlWithTs = `${json.url}${json.url.includes('?') ? '&' : '?'}t=${Date.now()}`
        onUpdated(urlWithTs)
        setOk(true)
        setTimeout(() => {
          setOk(false)
          onClose()
        }, 1200)
      } else {
        alert('Upload failed: ' + (json?.error ?? res.status))
      }
    } catch (err) {
      console.error('Upload error', err)
      alert('Upload error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Profile Picture</h3>

        <div className="mb-4 text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border mx-auto mb-2">
            <img src={preview ?? current ?? '/default-avatar.png'} alt="preview" className="w-full h-full object-cover" />
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button onClick={handleChoose} className="mr-2 px-3 py-1 border rounded">Choose File</button>
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {loading ? <span>Uploading...</span> : ok ? (
              <div className="inline-flex items-center gap-2 text-green-600 font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                OK
              </div>
            ) : null}
          </div>

          <div>
            <button onClick={handleConfirm} disabled={!preview || loading} className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}