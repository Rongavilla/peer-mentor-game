'use client'

import { useState } from 'react'
import { Award } from 'lucide-react'

interface Question {
  id: number
  level: number
  question: string
  options: string[]
  correctAnswer: number
}

const assessmentQuestions: Question[] = [
  // Level 1 - Data Structures and Algorithms
  {
    id: 1,
    level: 1,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(2^n)'],
    correctAnswer: 1,
  },
  {
    id: 2,
    level: 1,
    question: 'Which data structure uses LIFO principle?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correctAnswer: 1,
  },
  {
    id: 3,
    level: 1,
    question: 'What is the space complexity of merge sort?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 2,
  },
  // Level 2 - Database Management Systems (DBMS)
  {
    id: 4,
    level: 2,
    question: 'What does ACID stand for in DBMS?',
    options: ['Atomicity, Consistency, Isolation, Durability', 'Attribute, Class, Index, Data', 'Access, Control, Index, Database', 'Authentication, Certification, Integration, Deployment'],
    correctAnswer: 0,
  },
  {
    id: 5,
    level: 2,
    question: 'Which normal form removes transitive dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: 2,
  },
  {
    id: 6,
    level: 2,
    question: 'What is the primary purpose of an index in a database?',
    options: ['Store data', 'Improve query performance', 'Encrypt data', 'Backup data'],
    correctAnswer: 1,
  },
  // Level 3 - Networking and Communication
  {
    id: 7,
    level: 3,
    question: 'What is the default port number for HTTP?',
    options: ['21', '25', '80', '443'],
    correctAnswer: 2,
  },
  {
    id: 8,
    level: 3,
    question: 'Which OSI layer deals with routing?',
    options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
    correctAnswer: 1,
  },
  {
    id: 9,
    level: 3,
    question: 'What does TCP stand for?',
    options: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Transfer Communication Process', 'Transmission Control Process'],
    correctAnswer: 1,
  },
  // Level 4 - Operating Systems
  {
    id: 10,
    level: 4,
    question: 'What is the main purpose of virtual memory?',
    options: ['Increase CPU speed', 'Extend available memory', 'Improve security', 'Reduce latency'],
    correctAnswer: 1,
  },
  {
    id: 11,
    level: 4,
    question: 'Which scheduling algorithm can cause starvation?',
    options: ['FCFS', 'Priority Scheduling', 'Round Robin', 'SJF'],
    correctAnswer: 1,
  },
  {
    id: 12,
    level: 4,
    question: 'What is the purpose of a file system?',
    options: ['Execute programs', 'Organize and store files', 'Manage memory', 'Control hardware'],
    correctAnswer: 1,
  },
  // Level 5 - Programming Languages and Software Engineering
  {
    id: 13,
    level: 5,
    question: 'What is the difference between stack and heap memory?',
    options: ['Stack is faster, heap is larger', 'Both are the same', 'Heap is only for objects', 'Stack stores data permanently'],
    correctAnswer: 0,
  },
  {
    id: 14,
    level: 5,
    question: 'Which design pattern restricts object instantiation?',
    options: ['Factory', 'Singleton', 'Observer', 'Strategy'],
    correctAnswer: 1,
  },
  {
    id: 15,
    level: 5,
    question: 'What does OOP stand for?',
    options: ['Object Oriented Programming', 'Object Oriented Process', 'Object Operator Programming', 'Object Output Programming'],
    correctAnswer: 0,
  },
  // Level 6 - Computer Architecture and Systems Design
  {
    id: 16,
    level: 6,
    question: 'What is the fetch-execute cycle?',
    options: ['Memory management process', 'CPU instruction execution process', 'Data storage method', 'Network communication'],
    correctAnswer: 1,
  },
  {
    id: 17,
    level: 6,
    question: 'What is cache memory used for?',
    options: ['Store permanent data', 'Speed up CPU-memory communication', 'Backup storage', 'Virtual memory'],
    correctAnswer: 1,
  },
  {
    id: 18,
    level: 6,
    question: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Central Program Utility', 'Control Processing Unit', 'Central Process Unit'],
    correctAnswer: 0,
  },
  // Level 7 - Information Systems and Data Management
  {
    id: 19,
    level: 7,
    question: 'What is the primary benefit of data normalization?',
    options: ['Increase speed', 'Reduce redundancy', 'Improve security', 'Enhance backup'],
    correctAnswer: 1,
  },
  {
    id: 20,
    level: 7,
    question: 'What is the main goal of information security?',
    options: ['Store more data', 'Protect data integrity and confidentiality', 'Speed up queries', 'Reduce costs'],
    correctAnswer: 1,
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

export default function ITAssessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const currentQuestion = assessmentQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers, optionIndex]
    setSelectedAnswers(newAnswers)

    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const earnedBadges = badges.filter((badge) => score >= badge.minScore)
  const highestBadge = earnedBadges[earnedBadges.length - 1] || badges[0]

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{highestBadge.icon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
            
            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-6 mb-6">
              <p className="text-5xl font-bold text-cyan-600 mb-2">{score}/20</p>
              <p className="text-lg text-gray-700">Your Score</p>
            </div>

            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-900 mb-2">Badge Earned:</p>
              <div className="text-4xl mb-2">{highestBadge.icon}</div>
              <p className="text-2xl font-bold text-cyan-600">{highestBadge.name}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
              <p className="text-gray-700 mb-4">
                Based on your assessment score, you will be connected to a designated IT mentor who will help guide your learning journey and address your knowledge gaps.
              </p>
              <p className="text-gray-900 font-semibold">
                Your mentor will contact you soon to schedule your first session.
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {assessmentQuestions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-cyan-600 hover:bg-cyan-50 transition-all"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Click an answer to continue to the next question
          </p>
        </div>
      </div>
    </div>
  )
}
