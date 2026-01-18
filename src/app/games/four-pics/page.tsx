'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { Toaster, toast } from 'react-hot-toast'

interface GameQuestion {
  id: number
  image: string
  answer: string
  hint: string
  allLetters: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    answer: 'COMPUTER',
    hint: 'Electronic device for processing data',
    allLetters: ['C', 'O', 'M', 'P', 'U', 'T', 'E', 'R', 'S', 'D'],
    difficulty: 'easy'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80',
    answer: 'KEYBOARD',
    hint: 'Input device with keys',
    allLetters: ['K', 'E', 'Y', 'B', 'O', 'A', 'R', 'D', 'M', 'P'],
    difficulty: 'easy'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
    answer: 'MONITOR',
    hint: 'Screen for displaying output',
    allLetters: ['M', 'O', 'N', 'I', 'T', 'O', 'R', 'S', 'L', 'D'],
    difficulty: 'easy'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1546776310-fb3fc6f95f98?w=600&q=80',
    answer: 'MOUSE',
    hint: 'Pointing device',
    allLetters: ['M', 'O', 'U', 'S', 'E', 'P', 'D', 'K', 'W', 'X'],
    difficulty: 'easy'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=600&q=80',
    answer: 'PRINTER',
    hint: 'Device that produces hard copies',
    allLetters: ['P', 'R', 'I', 'N', 'T', 'E', 'R', 'S', 'C', 'O'],
    difficulty: 'medium'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70674b6e?w=600&q=80',
    answer: 'LAPTOP',
    hint: 'Portable computer',
    allLetters: ['L', 'A', 'P', 'T', 'O', 'P', 'C', 'M', 'D', 'E'],
    difficulty: 'easy'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1517694712025-ce98b8f13f51?w=600&q=80',
    answer: 'ROUTER',
    hint: 'Network device for data transmission',
    allLetters: ['R', 'O', 'U', 'T', 'E', 'R', 'N', 'W', 'S', 'G'],
    difficulty: 'medium'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1551445432-9ebf3df91b58?w=600&q=80',
    answer: 'SERVER',
    hint: 'Powerful computer that provides services',
    allLetters: ['S', 'E', 'R', 'V', 'E', 'R', 'C', 'D', 'P', 'O'],
    difficulty: 'medium'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1550751827-4bd94c3e7e77?w=600&q=80',
    answer: 'HARDDRIVE',
    hint: 'Storage device for data',
    allLetters: ['H', 'A', 'R', 'D', 'D', 'R', 'I', 'V', 'E', 'S'],
    difficulty: 'hard'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1517694712562-ba56fb0f737f?w=600&q=80',
    answer: 'TELEPHONE',
    hint: 'Communication device',
    allLetters: ['T', 'E', 'L', 'E', 'P', 'H', 'O', 'N', 'E', 'M'],
    difficulty: 'hard'
  }
]

export default function GuessThePictureITEdition() {
  const router = useRouter()
  const profile = useUserStore((s) => s.profile)
  const [isHydrated, setIsHydrated] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])
  const [showHint, setShowHint] = useState(false)
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [isWrong, setIsWrong] = useState(false)
  const [slideIn, setSlideIn] = useState(true)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !profile) {
      router.push('/signin')
    }
  }, [profile, router, isHydrated])

  useEffect(() => {
    if (isHydrated && currentQuestion < GAME_QUESTIONS.length) {
      const letters = [...GAME_QUESTIONS[currentQuestion].allLetters]
      setAvailableLetters(letters.sort(() => Math.random() - 0.5))
      setSelectedLetters([])
      setShowHint(false)
      setIsWrong(false)
      setSlideIn(true)
    }
  }, [currentQuestion, isHydrated])

  const currentGameQuestion = GAME_QUESTIONS[currentQuestion]
  const selectedWord = selectedLetters.map((i) => availableLetters[i]).join('')

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50, 100, 50])
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedWord.toUpperCase() === currentGameQuestion.answer) {
      setScore(score + 10)
      toast.success('✅ Correct!')
      setTimeout(() => {
        setSlideIn(false)
        setTimeout(() => {
          if (currentQuestion + 1 < GAME_QUESTIONS.length) {
            setCurrentQuestion(currentQuestion + 1)
          } else {
            setGameOver(true)
          }
        }, 300)
      }, 800)
    } else {
      setIsWrong(true)
      vibrate()
      toast.error(`❌ Wrong! Answer: ${currentGameQuestion.answer}`)
      setTimeout(() => setIsWrong(false), 600)
    }
  }

  if (!isHydrated || !profile) return null

  if (gameOver) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4'>
        <div className='bg-white p-8 rounded-2xl text-center shadow-2xl'>
          <h2 className='text-3xl font-bold mb-4 text-gray-900'>Game Over! 🎉</h2>
          <p className='text-6xl font-bold text-blue-600 mb-2'>{score}/100</p>
          <p className='text-gray-600 mb-6'>Great job! You got {score / 10} out of 10 correct!</p>
          <button
            onClick={() => {
              setScore(0)
              setCurrentQuestion(0)
              setGameOver(false)
              setSelectedLetters([])
            }}
            className='px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition'
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4'>
      <Toaster />
      <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='flex justify-between mb-6 text-white'>
          <button onClick={() => router.push('/dashboard')} className='hover:opacity-75 transition'>
            ← Back
          </button>
          <div className='bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold'>
            Level {currentQuestion + 1}/10
          </div>
          <div className='font-bold text-lg'>⭐ {score}</div>
        </div>

        {/* Picture Container with Slide Animation */}
        <div
          className={`mb-6 transition-all duration-300 transform ${
            slideIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <div className='bg-white p-4 rounded-lg shadow-lg'>
            <img
              src={currentGameQuestion.image}
              alt='Guess the picture'
              className='w-full h-80 object-cover rounded-lg border-4 border-gray-800'
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
              }}
            />
          </div>
        </div>

        {/* Hint Button */}
        <div className='bg-gray-800 p-4 rounded-lg mb-6'>
          <button
            onClick={() => setShowHint(!showHint)}
            className='bg-yellow-400 text-gray-900 w-full py-3 rounded font-bold hover:bg-yellow-300 transition'
          >
            💡 {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && <div className='mt-3 bg-yellow-100 p-4 rounded text-gray-900 font-semibold'>{currentGameQuestion.hint}</div>}
        </div>

        {/* Question/Label */}
        <div className='bg-indigo-800 p-4 rounded-lg mb-6 text-center'>
          <p className='text-white text-lg font-bold'>What IT device is this?</p>
        </div>

        {/* Selected Letters Display - Inside Box */}
        <div className='bg-white p-6 rounded-lg mb-6 min-h-24 border-4 border-blue-600 flex flex-wrap items-center justify-center gap-2'>
          {selectedLetters.length === 0 ? (
            <p className='text-gray-400 text-lg'>Select letters below...</p>
          ) : (
            selectedLetters.map((i, pos) => (
              <button
                key={pos}
                onClick={() => setSelectedLetters(selectedLetters.filter((_, idx) => idx !== pos))}
                className='bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md'
              >
                {availableLetters[i]}
              </button>
            ))
          )}
        </div>

        {/* Letter Grid - Letters Inside Boxes */}
        <div className='bg-gray-900 p-4 rounded-lg mb-6'>
          <div className='grid grid-cols-5 gap-2'>
            {availableLetters.map((letter, index) => {
              const isSelected = selectedLetters.includes(index)
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!isSelected) {
                      setSelectedLetters([...selectedLetters, index])
                    }
                  }}
                  disabled={isSelected}
                  className={`py-4 rounded font-bold font-lg transition transform ${
                    isWrong ? 'animate-bounce' : ''
                  } ${
                    isSelected
                      ? 'bg-gray-500 opacity-40 cursor-not-allowed'
                      : 'bg-white hover:bg-yellow-300 hover:scale-105 active:scale-95'
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={() => setSelectedLetters([])}
            className='flex-1 py-4 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition'
          >
            Clear
          </button>
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedLetters.length === 0}
            className='flex-1 py-4 bg-green-500 text-white rounded font-bold disabled:opacity-50 hover:bg-green-600 disabled:hover:bg-green-500 transition'
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  )
}