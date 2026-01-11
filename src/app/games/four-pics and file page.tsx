'use client'
import { useState } from 'react'

export default function FourPicsPage() {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const correct = 'NODE' // change per puzzle later
  const images = ['/games/fp1.jpg','/games/fp2.jpg','/games/fp3.jpg','/games/fp4.jpg']

  function submit() {
    if (!answer.trim()) return setFeedback('Please enter an answer.')
    if (answer.trim().toUpperCase() === correct) setFeedback('🎉 Correct — well done! +10 XP')
    else setFeedback('❌ Not quite — try again or reveal the answer.')
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">4 Pics 1 Word</h1>
        <p className="mt-1 text-sm text-gray-600">Solve the IT-themed puzzle to earn rewards.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {images.map((src) => (
          <div key={src} className="rounded overflow-hidden border bg-white">
            <img src={src} alt="" className="w-full h-48 object-cover" />
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-start">
        <input value={answer} onChange={(e)=>setAnswer(e.target.value)} placeholder="Type answer" className="flex-1 border rounded p-2" />
        <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
        <button onClick={()=> setFeedback(`Answer: ${correct}`)} className="px-3 py-2 bg-white border rounded">Reveal</button>
      </div>

      {feedback && <div className="mt-4 p-3 rounded bg-gray-50 border text-sm">{feedback}</div>}
    </main>
  )
}