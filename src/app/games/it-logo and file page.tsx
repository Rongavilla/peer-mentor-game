'use client'
import { useState } from 'react'

export default function ItLogoPage() {
  const [choice, setChoice] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const correct = 'GITHUB'
  const options = ['GITHUB','MICROSOFT','REDHAT','GOOGLE']

  function check() {
    if (!choice) return setResult('Please select an option.')
    setResult(choice === correct ? '🎉 Correct — great job!' : '❌ Wrong — try another one.')
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Guess the IT Logo</h1>
        <p className="mt-1 text-sm text-gray-600">Identify the brand from the logo image below.</p>
      </header>

      <div className="mb-6 flex justify-center">
        <img src="/games/logo-quiz.png" alt="Logo" className="w-48 h-48 object-contain rounded border bg-white p-4" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => (
          <button key={opt} onClick={()=> { setChoice(opt); setResult(null) }} className={`p-4 text-left rounded border ${choice===opt ? 'ring-2 ring-indigo-400 bg-indigo-50' : 'bg-white'}`}>
            <div className="font-medium">{opt}</div>
            <div className="text-xs text-gray-500 mt-1">Click to select</div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={check} className="px-4 py-2 bg-green-600 text-white rounded">Check</button>
        <button onClick={()=> setResult(`Answer: ${correct}`)} className="px-3 py-2 bg-white border rounded">Reveal</button>
      </div>

      {result && <div className="mt-4 p-3 rounded bg-gray-50 border text-sm">{result}</div>}
    </main>
  )
}