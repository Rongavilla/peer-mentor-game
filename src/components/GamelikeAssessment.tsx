'use client'

import { useState } from 'react'
import { Volume2 } from 'lucide-react'

interface Question {
  id: number
  level: number
  image: string
  hint: string
  answer: string
  explanation: string
  options: string[]
}

const assessmentQuestions: Question[] = [
  // Level 1 - Data Structures and Algorithms
  {
    id: 1,
    level: 1,
    image: '📚',
    hint: 'A linear structure where elements follow LIFO principle - Last In, First Out',
    answer: 'STACK',
    explanation: 'A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements are added and removed from the same end called the top. Common examples include browser history and undo operations.',
    options: ['QUEUE', 'STACK', 'ARRAY', 'GRAPH'],
  },
  {
    id: 2,
    level: 1,
    image: '🔍',
    hint: 'The time complexity of binary search algorithm',
    answer: 'LOGN',
    explanation: 'Binary search has O(log n) time complexity. It works by repeatedly dividing the search interval in half. This is much faster than linear search which is O(n), especially for large sorted arrays.',
    options: ['ON', 'LOGN', 'ON2', 'O2N'],
  },
  {
    id: 3,
    level: 1,
    image: '🚶',
    hint: 'A structure where elements are arranged sequentially with FIFO principle',
    answer: 'QUEUE',
    explanation: 'A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Elements are added at the rear and removed from the front. Real-world examples include printer queues and customer service lines.',
    options: ['STACK', 'QUEUE', 'TREE', 'HEAP'],
  },

  // Level 2 - Database Management Systems (DBMS)
  {
    id: 4,
    level: 2,
    image: '🗄️',
    hint: 'First letter: A, Properties of reliable database transactions',
    answer: 'ACID',
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. These are the four key properties that guarantee reliable database transactions and data integrity.',
    options: ['CRUD', 'ACID', 'BASE', 'SQL'],
  },
  {
    id: 5,
    level: 2,
    image: '📊',
    hint: 'Data organization method to eliminate redundancy and anomalies',
    answer: 'NORMALIZATION',
    explanation: 'Normalization is the process of organizing database tables to minimize redundancy and dependency. It involves dividing data into multiple tables using normal forms (1NF, 2NF, 3NF, BCNF) to improve data integrity.',
    options: ['DENORMALIZATION', 'NORMALIZATION', 'SERIALIZATION', 'FRAGMENTATION'],
  },
  {
    id: 6,
    level: 2,
    image: '💾',
    hint: 'A structured query language for managing databases',
    answer: 'SQL',
    explanation: 'SQL (Structured Query Language) is the standard programming language used to manage and manipulate relational databases. It enables you to create, read, update, and delete data in databases.',
    options: ['NOSQL', 'SQL', 'XML', 'JSON'],
  },

  // Level 3 - Networking and Communication
  {
    id: 7,
    level: 3,
    image: '🔗',
    hint: 'The internet protocol ensuring data delivery between computers',
    answer: 'TCP',
    explanation: 'TCP (Transmission Control Protocol) is a core protocol of the Internet Protocol Suite. It provides reliable, ordered, and error-checked delivery of data packets over networks. HTTP, FTP, and SMTP all use TCP.',
    options: ['UDP', 'TCP', 'ICMP', 'IGMP'],
  },
  {
    id: 8,
    level: 3,
    image: '🔐',
    hint: 'Default port number for secure web communication (HTTPS)',
    answer: '443',
    explanation: 'Port 443 is the default port for HTTPS (HTTP Secure), which is the secure version of HTTP. It uses SSL/TLS encryption to protect data transmission between web browsers and servers.',
    options: ['80', '443', '22', '3306'],
  },
  {
    id: 9,
    level: 3,
    image: '📡',
    hint: 'A network device that connects different networks and routes data',
    answer: 'ROUTER',
    explanation: 'A Router is a networking device that forwards data packets between computer networks. It reads the destination IP address and routes packets to the appropriate network. Essential for internet connectivity and network segmentation.',
    options: ['SWITCH', 'ROUTER', 'GATEWAY', 'MODEM'],
  },

  // Level 4 - Operating Systems
  {
    id: 10,
    level: 4,
    image: '🖥️',
    hint: 'The system that manages hardware and software resources on a computer',
    answer: 'OS',
    explanation: 'An Operating System (OS) is system software that manages hardware resources and provides services for computer programs. Common examples include Windows, macOS, Linux, iOS, and Android.',
    options: ['BIOS', 'OS', 'FIRMWARE', 'BOOTLOADER'],
  },
  {
    id: 11,
    level: 4,
    image: '💾',
    hint: 'Memory management technique that extends RAM using disk storage',
    answer: 'VIRTUAL',
    explanation: 'Virtual Memory is a memory management technique that extends a computer\'s available RAM by using part of the hard drive or SSD. It allows programs to use more memory than physically available, though it\'s slower than actual RAM.',
    options: ['CACHE', 'VIRTUAL', 'SHARED', 'PHYSICAL'],
  },
  {
    id: 12,
    level: 4,
    image: '⚡',
    hint: 'Process of switching between multiple programs rapidly on a single CPU',
    answer: 'MULTITASKING',
    explanation: 'Multitasking is the ability of an OS to run multiple processes concurrently on a single CPU by switching between them rapidly. This creates the illusion that programs run simultaneously, though only one executes at a time on a single-core processor.',
    options: ['MULTIPROCESSING', 'MULTITASKING', 'THREADING', 'FORKING'],
  },

  // Level 5 - Programming Languages and Software Engineering
  {
    id: 13,
    level: 5,
    image: '🔷',
    hint: 'A programming paradigm based on objects and data encapsulation',
    answer: 'OOP',
    explanation: 'Object-Oriented Programming (OOP) is a programming paradigm that uses objects and classes. Key concepts include encapsulation, inheritance, and polymorphism. Languages like Java, C++, and Python support OOP.',
    options: ['FP', 'OOP', 'BP', 'LP'],
  },
  {
    id: 14,
    level: 5,
    image: '1️⃣',
    hint: 'Design pattern that restricts a class to have only one instance',
    answer: 'SINGLETON',
    explanation: 'The Singleton pattern is a design pattern that restricts the instantiation of a class to a single object. This is useful for coordinating actions across a system, like database connections or logging services.',
    options: ['FACTORY', 'SINGLETON', 'OBSERVER', 'STRATEGY'],
  },
  {
    id: 15,
    level: 5,
    image: '🧩',
    hint: 'Source code organization approach where related code is grouped together',
    answer: 'MODULAR',
    explanation: 'Modular programming is an approach to organizing code into self-contained, reusable modules. Each module handles a specific functionality, making code easier to maintain, test, and reuse across different parts of an application.',
    options: ['PROCEDURAL', 'MODULAR', 'MONOLITHIC', 'DISTRIBUTED'],
  },

  // Level 6 - Computer Architecture and Systems Design
  {
    id: 16,
    level: 6,
    image: '⚙️',
    hint: 'The central processing unit that executes instructions in a computer',
    answer: 'CPU',
    explanation: 'The CPU (Central Processing Unit) is the primary component of a computer that performs most of the processing. It executes instructions from programs, performs calculations, and controls the operations of other components.',
    options: ['GPU', 'CPU', 'RAM', 'SSD'],
  },
  {
    id: 17,
    level: 6,
    image: '⚡',
    hint: 'Fast memory located on the CPU for storing frequently accessed data',
    answer: 'CACHE',
    explanation: 'Cache is a small, fast memory located on or near the CPU that stores copies of data from main memory. It reduces latency and improves performance by providing quick access to frequently used data and instructions.',
    options: ['RAM', 'CACHE', 'VRAM', 'PRAM'],
  },
  {
    id: 18,
    level: 6,
    image: '🔄',
    hint: 'The sequence of fetching, decoding, and executing CPU instructions',
    answer: 'FETCH',
    explanation: 'The Fetch-Decode-Execute cycle is the fundamental process by which a CPU executes instructions. It fetches an instruction from memory, decodes it to understand what operation to perform, and then executes it.',
    options: ['DECODE', 'FETCH', 'EXECUTE', 'STORE'],
  },

  // Level 7 - Information Systems and Data Management
  {
    id: 19,
    level: 7,
    image: '📦',
    hint: 'A system organized to store, protect, and retrieve data safely',
    answer: 'DATABASE',
    explanation: 'A Database is an organized collection of structured data stored and accessed electronically. It provides mechanisms for storing, retrieving, and managing data efficiently, with security and integrity controls.',
    options: ['SPREADSHEET', 'DATABASE', 'FILE', 'ARCHIVE'],
  },
  {
    id: 20,
    level: 7,
    image: '🛡️',
    hint: 'The practice of protecting systems and data from unauthorized access',
    answer: 'SECURITY',
    explanation: 'Information Security is the practice of protecting information and information systems from unauthorized access, modification, or disruption. It includes authentication, encryption, firewalls, and access controls.',
    options: ['PRIVACY', 'SECURITY', 'ENCRYPTION', 'FIREWALL'],
  },
]

const badges = [
  { level: 1, name: 'Data Apprentice', icon: '📚', minScore: 2 },
  { level: 2, name: 'Database Scholar', icon: '🗄️', minScore: 5 },
  { level: 3, name: 'Network Navigator', icon: '🌐', minScore: 8 },
  { level: 4, name: 'System Sage', icon: '⚙️', minScore: 11 },
  { level: 5, name: 'Code Craftsman', icon: '💻', minScore: 14 },
  { level: 6, name: 'Architecture Expert', icon: '🏗️', minScore: 17 },
  { level: 7, name: 'IT Master', icon: '👑', minScore: 20 },
]

export default function GamelikeAssessment({
  onComplete,
}: {
  onComplete?: (score: number, badgeIcon: string, badgeName: string) => void
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = assessmentQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100
  const correctAnswer = currentQuestion.answer

  // Shuffle options for letter boxes
  const shuffledLetters = [...correctAnswer].sort(() => Math.random() - 0.5)
  const allLetters = [...shuffledLetters, ...currentQuestion.options.flatMap(opt => opt.split(''))]
  const uniqueLetters = Array.from(new Set(allLetters)).slice(0, 8)

  const handleLetterClick = (letter: string) => {
    if (userAnswer.length < correctAnswer.length) {
      setUserAnswer(userAnswer + letter)
      setSelectedLetters([...selectedLetters, letter])
    }
  }

  const handleRemoveLetter = () => {
    setUserAnswer(userAnswer.slice(0, -1))
    setSelectedLetters(selectedLetters.slice(0, -1))
  }

  const handleSubmitAnswer = () => {
    const correct = userAnswer.toUpperCase() === correctAnswer.toUpperCase()
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore(score + 1)
      setTimeout(() => {
        goToNextQuestion()
      }, 2000)
    } else {
      setShowExplanation(true)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer('')
      setSelectedLetters([])
      setShowFeedback(false)
      setShowExplanation(false)
    } else {
      setShowResults(true)
    }
  }

  const earnedBadges = badges.filter((badge) => score >= badge.minScore)
  const highestBadge = earnedBadges[earnedBadges.length - 1] || badges[0]

  if (showResults) {
    const isPerfectScore = score === 20
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto py-8">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="text-center">
            {/* Congratulations for Perfect Score */}
            {isPerfectScore && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg border-2 border-yellow-400 animate-pulse">
                <p className="text-2xl font-black text-orange-700">🎉 PERFECT SCORE! 🎉</p>
                <p className="text-lg font-bold text-orange-600 mt-2">Outstanding! You got all 20 correct!</p>
              </div>
            )}

            <div className="text-5xl mb-3">{highestBadge.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Assessment Complete!</h2>

            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4 mb-4">
              <p className="text-4xl font-bold text-cyan-600 mb-1">{score}/20</p>
              <p className="text-sm text-gray-700">Your Score</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Badge Earned:</p>
              <div className="text-3xl mb-1">{highestBadge.icon}</div>
              <p className="text-lg font-bold text-cyan-600">{highestBadge.name}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left text-sm">
              <p className="text-gray-700 mb-2">
                ✅ Assessment submitted successfully! An AI algorithm is now analyzing your performance and will connect you with the perfect mentor who matches your learning needs.
              </p>
              <p className="text-gray-900 font-semibold">
                📬 Your mentor will be notified and will contact you soon to schedule your first session.
              </p>
            </div>

            <button
              onClick={() => {
                if (onComplete) {
                  onComplete(score, highestBadge.icon, highestBadge.name)
                }
              }}
              className="w-full px-6 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 text-sm"
            >
              Continue to Mentor Matching
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto py-10">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-semibold">Question {currentQuestionIndex + 1} of {assessmentQuestions.length}</span>
            <span className="font-semibold">Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-cyan-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 min-h-64">
            <div className="text-7xl mb-4 animate-bounce">{currentQuestion.image}</div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold mb-2">Hint:</p>
              <p className="text-gray-600 text-sm italic">{currentQuestion.hint}</p>
            </div>
          </div>

          {/* Answer Section */}
          <div className="flex flex-col justify-center">
            {/* Answer Boxes */}
            <div className="mb-8">
              <div className="flex gap-2 flex-wrap mb-4 justify-center">
                {Array.from(correctAnswer).map((_, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 border-4 border-cyan-600 rounded-lg flex items-center justify-center text-lg font-bold bg-cyan-50 text-cyan-700"
                  >
                    {userAnswer[index] || ''}
                  </div>
                ))}
              </div>

              {userAnswer.length > 0 && (
                <button
                  onClick={handleRemoveLetter}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 mb-4 text-sm"
                >
                  ← Remove Letter
                </button>
              )}
            </div>

            {/* Letter Boxes */}
            <div className="mb-6">
              <p className="text-gray-700 font-semibold text-center mb-3">Choose Letters:</p>
              <div className="grid grid-cols-4 gap-2">
                {uniqueLetters.map((letter, index) => (
                  <button
                    key={index}
                    onClick={() => handleLetterClick(letter)}
                    disabled={userAnswer.length >= correctAnswer.length}
                    className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold text-lg rounded-lg hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 transition-all"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={userAnswer.length !== correctAnswer.length}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              ✓ Submit Answer
            </button>
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`rounded-lg p-6 mb-4 ${isCorrect ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'}`}>
            <p className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '✅ Correct! Great job!' : '❌ Incorrect! Try again.'}
            </p>
            {isCorrect && <p className="text-green-700 mt-2">The answer is: <span className="font-bold text-xl">{correctAnswer}</span></p>}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300 mb-4">
            <p className="text-blue-900 font-bold text-lg mb-3">📖 Correct Answer & Explanation:</p>
            <p className="text-blue-900 font-bold text-xl mb-3">Answer: {correctAnswer}</p>
            <p className="text-blue-800 text-sm leading-relaxed mb-4">{currentQuestion.explanation}</p>
            <button
              onClick={goToNextQuestion}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Continue to Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
