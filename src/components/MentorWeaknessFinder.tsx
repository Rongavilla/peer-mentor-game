'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Target, Award } from 'lucide-react'

interface WeaknessArea {
  topic: string
  icon: string
  description: string
  questions: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface UserWeakness {
  topic: string
  icon: string
  description: string
  suggestedQuestions: string[]
}

const ASSESSMENT_TOPICS = {
  'Data Structures': {
    icon: '📦',
    description: 'Understanding stacks, queues, linked lists, and other data structures',
    questions: [
      'What is the difference between a Stack and a Queue?',
      'Explain how Binary Search works and its time complexity',
      'What are the advantages of using a Linked List over an Array?',
      'How does a Hash Table handle collisions?',
      'What is a Graph and what are its applications?',
    ],
  },
  'Database Management': {
    icon: '🗄️',
    description: 'SQL, normalization, ACID properties, and database design',
    questions: [
      'What are the ACID properties in databases?',
      'Explain database normalization and its different normal forms',
      'What is the difference between SQL and NoSQL?',
      'How do indexes improve database performance?',
      'What is a JOIN and how many types of JOINs are there?',
    ],
  },
  'Networking': {
    icon: '🌐',
    description: 'TCP/IP, protocols, networking concepts',
    questions: [
      'What is the difference between TCP and UDP?',
      'Explain the OSI model and its 7 layers',
      'What is HTTPS and how is it different from HTTP?',
      'What is DNS and how does it work?',
      'What are firewalls and how do they protect networks?',
    ],
  },
  'Operating Systems': {
    icon: '⚙️',
    description: 'Processes, memory management, scheduling',
    questions: [
      'What is the difference between a Process and a Thread?',
      'Explain Virtual Memory and its advantages',
      'What is Deadlock and how can it be prevented?',
      'What are the different CPU scheduling algorithms?',
      'How does a file system organize and store data?',
    ],
  },
  'Programming Concepts': {
    icon: '💻',
    description: 'OOP, design patterns, algorithms',
    questions: [
      'What are the four pillars of Object-Oriented Programming?',
      'Explain the difference between polymorphism and inheritance',
      'What is a Design Pattern and what are common patterns?',
      'What is the difference between Synchronous and Asynchronous programming?',
      'How do you optimize algorithms for better performance?',
    ],
  },
  'System Architecture': {
    icon: '🏗️',
    description: 'Caching, scalability, distributed systems',
    questions: [
      'What is the purpose of caching in system design?',
      'Explain the difference between horizontal and vertical scaling',
      'What is load balancing and why is it important?',
      'How does a microservices architecture work?',
      'What are the advantages of CDN (Content Delivery Network)?',
    ],
  },
  'Security': {
    icon: '🔒',
    description: 'Encryption, authentication, security best practices',
    questions: [
      'What is the difference between encryption and hashing?',
      'Explain authentication vs authorization',
      'What is SQL injection and how can you prevent it?',
      'What is a digital certificate and how does it work?',
      'What are the best practices for secure password storage?',
    ],
  },
}

// Determine weaknesses based on assessment score
function findWeakAreas(score: number): UserWeakness[] {
  const weakAreas: UserWeakness[] = []

  // If low score, all areas are weak
  if (score < 5) {
    Object.entries(ASSESSMENT_TOPICS).forEach(([topic, data]) => {
      weakAreas.push({
        topic,
        icon: data.icon,
        description: data.description,
        suggestedQuestions: data.questions.slice(0, 3),
      })
    })
  }
  // If medium score, focus on specific areas
  else if (score < 10) {
    const weakTopics = [
      'Data Structures',
      'Database Management',
      'Operating Systems',
    ]
    weakTopics.forEach((topic) => {
      const data = ASSESSMENT_TOPICS[topic as keyof typeof ASSESSMENT_TOPICS]
      if (data) {
        weakAreas.push({
          topic,
          icon: data.icon,
          description: data.description,
          suggestedQuestions: data.questions.slice(0, 3),
        })
      }
    })
  }
  // If high score, focus on advanced topics
  else if (score < 15) {
    const weakTopics = ['System Architecture', 'Programming Concepts']
    weakTopics.forEach((topic) => {
      const data = ASSESSMENT_TOPICS[topic as keyof typeof ASSESSMENT_TOPICS]
      if (data) {
        weakAreas.push({
          topic,
          icon: data.icon,
          description: data.description,
          suggestedQuestions: data.questions.slice(1, 4),
        })
      }
    })
  }
  // Very high score, security and advanced topics
  else {
    const weakTopics = ['Security', 'System Architecture']
    weakTopics.forEach((topic) => {
      const data = ASSESSMENT_TOPICS[topic as keyof typeof ASSESSMENT_TOPICS]
      if (data) {
        weakAreas.push({
          topic,
          icon: data.icon,
          description: data.description,
          suggestedQuestions: data.questions.slice(2, 5),
        })
      }
    })
  }

  return weakAreas
}

export default function MentorWeaknessFinder({
  score,
  badgeName,
  onStartPractice,
}: {
  score: number
  badgeName: string
  onStartPractice: (weakAreas: UserWeakness[]) => void
}) {
  const [weaknesses, setWeaknesses] = useState<UserWeakness[]>([])
  const [selectedArea, setSelectedArea] = useState<UserWeakness | null>(null)

  useEffect(() => {
    const foundWeaknesses = findWeakAreas(score)
    setWeaknesses(foundWeaknesses)
    if (foundWeaknesses.length > 0) {
      setSelectedArea(foundWeaknesses[0])
    }
  }, [score])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto py-6">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-900">
              Your Learning Areas
            </h2>
          </div>
          <p className="text-gray-700">
            Based on your <span className="font-bold text-cyan-600">{badgeName}</span> achievement, we've identified areas where you can improve. Your mentor will help you strengthen these skills through targeted practice.
          </p>
        </div>

        {/* Weakness Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {weaknesses.map((weakness) => (
            <div
              key={weakness.topic}
              onClick={() => setSelectedArea(weakness)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedArea?.topic === weakness.topic
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white hover:border-orange-400'
              }`}
            >
              <div className="text-4xl mb-3">{weakness.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {weakness.topic}
              </h3>
              <p className="text-sm text-gray-600">{weakness.description}</p>
            </div>
          ))}
        </div>

        {/* Selected Area Details */}
        {selectedArea && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 mb-8 border-2 border-orange-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Questions to Practice: {selectedArea.topic}
            </h3>
            <div className="space-y-3">
              {selectedArea.suggestedQuestions.map((question, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 bg-white rounded-lg border border-orange-200"
                >
                  <span className="text-orange-500 font-bold flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <p className="text-gray-700">{question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border-2 border-blue-300 flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-blue-900 font-bold mb-2">How This Works:</p>
            <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
              <li>Your mentor will answer these practice questions</li>
              <li>You'll receive detailed explanations and guidance</li>
              <li>Complete practice challenges to earn badges</li>
              <li>Track your progress and improvement</li>
            </ol>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onStartPractice(weaknesses)}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-5 h-5" />
          Start Practice with Mentor
        </button>
      </div>
    </div>
  )
}
