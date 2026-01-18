'use client'

import { useState, useEffect } from 'react'
import { Award, X, Target } from 'lucide-react'

interface PracticeQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
}

interface PracticeBadge {
  name: string
  icon: string
  requirement: string
  points: number
}

const PRACTICE_GAMES = {
  'Data Structures': [
    {
      id: '1',
      question:
        'Which data structure would you use to implement the undo feature in a text editor?',
      options: ['Queue', 'Stack', 'Linked List', 'Hash Table'],
      correctAnswer: 1,
      explanation:
        'Stack is perfect for undo because you need LIFO (Last-In-First-Out) - the most recent action is undone first.',
      points: 15,
      difficulty: 'medium' as const,
    },
    {
      id: '2',
      question:
        'What is the time complexity of searching in a balanced Binary Search Tree?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correctAnswer: 1,
      explanation:
        'A balanced BST has logarithmic search time because each comparison eliminates half the remaining elements.',
      points: 10,
      difficulty: 'easy' as const,
    },
    {
      id: '3',
      question:
        'How would you detect a cycle in a linked list using optimal space?',
      options: [
        'Use a Set to store visited nodes',
        'Use Floyd\'s cycle detection (tortoise and hare)',
        'Sort the list',
        'Use nested loops',
      ],
      correctAnswer: 1,
      explanation:
        'Floyd\'s algorithm uses O(1) space by using two pointers at different speeds - if they meet, there\'s a cycle.',
      points: 20,
      difficulty: 'hard' as const,
    },
  ],
  'Database Management': [
    {
      id: '1',
      question:
        'You have N users and each user has multiple orders. How would you structure the tables?',
      options: [
        'One table with all data',
        'Users table and Orders table with foreign key',
        'Multiple copies of user data in each order',
        'All data in JSON',
      ],
      correctAnswer: 1,
      explanation:
        'This follows 1NF normalization - separate related data into different tables and use foreign keys to establish relationships.',
      points: 15,
      difficulty: 'medium' as const,
    },
    {
      id: '2',
      question: 'Which SQL command is NOT a DML (Data Manipulation Language)?',
      options: ['INSERT', 'UPDATE', 'DELETE', 'CREATE'],
      correctAnswer: 3,
      explanation:
        'CREATE is DDL (Data Definition Language). DML includes INSERT, UPDATE, DELETE, SELECT. DDL includes CREATE, ALTER, DROP.',
      points: 10,
      difficulty: 'easy' as const,
    },
    {
      id: '3',
      question:
        'How do database indexes improve performance? What\'s the tradeoff?',
      options: [
        'Faster reads, slower writes and more storage',
        'Faster everything, no tradeoff',
        'Slower reads, faster writes',
        'No effect on performance',
      ],
      correctAnswer: 0,
      explanation:
        'Indexes speed up SELECT queries by allowing quick lookups, but slow down INSERT/UPDATE/DELETE because indexes must be maintained.',
      points: 20,
      difficulty: 'hard' as const,
    },
  ],
  'System Architecture': [
    {
      id: '1',
      question:
        'Why would you use caching in a web application architecture?',
      options: [
        'To store user passwords',
        'To reduce database load and improve response time',
        'To increase storage usage',
        'To make code harder to understand',
      ],
      correctAnswer: 1,
      explanation:
        'Caching stores frequently accessed data in fast memory (Redis, Memcached) to avoid repeated database queries.',
      points: 15,
      difficulty: 'medium' as const,
    },
    {
      id: '2',
      question: 'What does horizontal scaling mean?',
      options: [
        'Adding more power to one server',
        'Adding more servers to your system',
        'Removing servers',
        'Changing the database',
      ],
      correctAnswer: 1,
      explanation:
        'Horizontal scaling (scaling out) adds more machines and distributes load. Vertical scaling (scaling up) adds resources to one machine.',
      points: 10,
      difficulty: 'easy' as const,
    },
  ],
}

const PRACTICE_BADGES: PracticeBadge[] = [
  {
    name: 'Practice Starter',
    icon: '🌱',
    requirement: 'Complete first practice game',
    points: 25,
  },
  {
    name: 'Knowledge Seeker',
    icon: '📚',
    requirement: 'Earn 50+ points',
    points: 50,
  },
  {
    name: 'Skill Master',
    icon: '🏆',
    requirement: 'Get 80%+ accuracy',
    points: 100,
  },
  {
    name: 'Expert Level',
    icon: '👑',
    requirement: 'Complete all hard questions',
    points: 150,
  },
]

export default function WeaknessPracticeGame({
  weaknessTopic,
  onClose,
}: {
  weaknessTopic: string
  onClose: () => void
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState<PracticeBadge[]>([])
  const [completed, setCompleted] = useState(false)

  const questions =
    PRACTICE_GAMES[weaknessTopic as keyof typeof PRACTICE_GAMES] || []
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1)
      setTotalPoints(totalPoints + currentQuestion.points)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      completeGame()
    }
  }

  const completeGame = () => {
    const badges: PracticeBadge[] = []
    const accuracy = (score / questions.length) * 100

    if (totalPoints >= 25) badges.push(PRACTICE_BADGES[0])
    if (totalPoints >= 50) badges.push(PRACTICE_BADGES[1])
    if (accuracy >= 80) badges.push(PRACTICE_BADGES[2])
    if (score === questions.length) badges.push(PRACTICE_BADGES[3])

    setEarnedBadges(badges)
    setCompleted(true)
  }

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Practice Complete!
            </h2>

            {/* Score */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
              <p className="text-5xl font-bold text-purple-600 mb-2">
                {score}/{questions.length}
              </p>
              <p className="text-lg text-gray-700">
                Accuracy: {((score / questions.length) * 100).toFixed(1)}%
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {totalPoints} Points Earned!
              </p>
            </div>

            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div className="mb-6">
                <p className="text-xl font-bold text-gray-900 mb-4">
                  🏅 Badges Earned:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.name}
                      className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4 border-2 border-yellow-400"
                    >
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="font-bold text-gray-900 text-sm">
                        {badge.name}
                      </p>
                      <p className="text-xs text-gray-600">{badge.points} pts</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-300">
              <p className="text-gray-700 mb-3">
                <span className="font-bold">Great effort!</span> You've completed
                the practice game for <span className="font-bold">{weaknessTopic}</span>. Keep
                practicing similar topics to strengthen your skills. Your mentor will
                continue to support your learning journey.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto py-6">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {weaknessTopic} Practice Game
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="font-bold text-purple-600">
              {totalPoints} Points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>

          {/* Difficulty Badge */}
          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800'
                  : currentQuestion.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {currentQuestion.difficulty.charAt(0).toUpperCase() +
                currentQuestion.difficulty.slice(1)}{' '}
              ({currentQuestion.points} pts)
            </span>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showFeedback && handleAnswer(idx)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === idx
                    ? idx === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-purple-400'
                } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedAnswer === idx
                        ? idx === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswer === idx && (
                      <span className="text-sm font-bold">
                        {idx === currentQuestion.correctAnswer ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 border-2 border-green-300'
                : 'bg-red-50 border-2 border-red-300'
            }`}
          >
            <p className="font-bold mb-2">
              {selectedAnswer === currentQuestion.correctAnswer
                ? '✓ Correct!'
                : '✗ Not quite...'}
            </p>
            <p className="text-gray-700 mb-3">{currentQuestion.explanation}</p>
            <button
              onClick={handleNext}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
            >
              {currentQuestionIndex < questions.length - 1
                ? 'Next Question'
                : 'See Results'}
            </button>
          </div>
        )}

        {!showFeedback && (
          <p className="text-center text-gray-600 text-sm">
            Choose an answer to continue
          </p>
        )}
      </div>
    </div>
  )
}
