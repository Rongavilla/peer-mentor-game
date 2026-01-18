'use client'

import { useState, useEffect } from 'react'
import { Send, X, ThumbsUp, Award, AlertCircle, Zap, ChevronRight } from 'lucide-react'

interface GuidanceMessage {
  id: string
  sender: 'mentee' | 'mentor'
  type: 'question' | 'guidance' | 'feedback' | 'introduction' | 'weakness-analysis'
  question?: string
  userAnswer?: string
  answer?: string
  explanation?: string
  feedback?: string
  points?: number
  timestamp: Date
}

interface MentorGuidanceProps {
  mentorName: string
  mentorAvatar: string
  weaknessTopic: string
  suggestedQuestions: string[]
  onClose: () => void
  onComplete: () => void
}

const MENTOR_ANSWERS = {
  'Data Structures': {
    'What is the difference between a Stack and a Queue?':
      'A Stack is a LIFO (Last-In-First-Out) data structure where elements are added and removed from the same end, while a Queue is FIFO (First-In-First-Out) where elements are added at the rear and removed from the front. Think of a Stack like a stack of plates and a Queue like a line at a store.',
    'Explain how Binary Search works and its time complexity':
      'Binary Search works on sorted arrays by repeatedly dividing the search space in half. It compares the target with the middle element - if smaller, search the left half; if larger, search the right half. Time complexity is O(log n), making it much faster than linear search O(n).',
    'What are the advantages of using a Linked List over an Array?':
      'Linked Lists offer dynamic memory allocation and efficient insertion/deletion (O(1) if position is known), while Arrays require contiguous memory. Linked Lists are better for frequently changing data, but Arrays are faster for random access.',
  },
  'Database Management': {
    'What are the ACID properties in databases?':
      'ACID stands for: (A)tomicity - transactions are all-or-nothing, (C)onsistency - valid state maintained, (I)solation - concurrent transactions don\'t interfere, (D)urability - committed data persists. These ensure reliable database operations.',
    'Explain database normalization and its different normal forms':
      'Normalization reduces data redundancy through normal forms: 1NF (no repeating groups), 2NF (remove partial dependencies), 3NF (remove transitive dependencies), BCNF (stricter 3NF). Higher normalization reduces anomalies but may require more joins.',
    'What is the difference between SQL and NoSQL?':
      'SQL (relational) uses structured schemas and ACID compliance, great for complex queries. NoSQL (document/key-value) offers flexibility and horizontal scaling, better for large unstructured data. Choose based on your data structure and scalability needs.',
  },
  'Networking': {
    'What is the difference between TCP and UDP?':
      'TCP is connection-oriented, reliable, ordered, slower - used for email, web. UDP is connectionless, fast, unreliable, no ordering - used for streaming, gaming. Choose based on whether you need guaranteed delivery vs speed.',
    'Explain the OSI model and its 7 layers':
      '7 Layers: Physical (cables), Data Link (MAC), Network (IP routing), Transport (TCP/UDP), Session (connections), Presentation (encryption), Application (HTTP/FTP). Memory aid: "Please Do Not Throw Sausage Pizza Away".',
    'What is HTTPS and how is it different from HTTP?':
      'HTTPS adds a security layer (SSL/TLS) to HTTP. It encrypts data between client and server using certificates, ensuring privacy and integrity. HTTP is plaintext and insecure. Always use HTTPS for sensitive data.',
  },
}

// Evaluate user's answer quality and provide personalized feedback
function evaluateAnswer(userAnswer: string, question: string): {
  isCorrect: boolean
  feedback: string
  weaknessArea: string
} {
  const answerLower = userAnswer.toLowerCase()
  
  // Simple evaluation logic - can be enhanced with AI later
  const keywordMap: { [key: string]: { keywords: string[]; weakness: string } } = {
    'What is the difference between a Stack and a Queue?': {
      keywords: ['lifo', 'fifo', 'last', 'first', 'order'],
      weakness: 'Basic Data Structure Concepts',
    },
    'Explain how Binary Search works and its time complexity': {
      keywords: ['divide', 'half', 'log', 'sorted', 'compare'],
      weakness: 'Search Algorithms',
    },
    'What are the advantages of using a Linked List over an Array?': {
      keywords: ['dynamic', 'insertion', 'deletion', 'memory', 'flexibility'],
      weakness: 'Memory Management',
    },
    'What are the ACID properties in databases?': {
      keywords: ['atomic', 'consistency', 'isolation', 'durability', 'transaction'],
      weakness: 'Database Transactions',
    },
    'Explain database normalization and its different normal forms': {
      keywords: ['1nf', '2nf', '3nf', 'redundancy', 'dependency', 'normal form'],
      weakness: 'Database Design',
    },
    'What is the difference between SQL and NoSQL?': {
      keywords: ['relational', 'schema', 'structured', 'flexible', 'sql', 'nosql'],
      weakness: 'Database Types',
    },
  }

  const questionData = keywordMap[question]
  if (!questionData) {
    return {
      isCorrect: answerLower.length > 20,
      feedback: "That's a thoughtful response! Let me explain the key concepts...",
      weaknessArea: 'Understanding Concepts',
    }
  }

  const hasKeywords = questionData.keywords.some((keyword) =>
    answerLower.includes(keyword)
  )

  if (answerLower.length < 10) {
    return {
      isCorrect: false,
      feedback: `I see you're still getting comfortable with this. No worries! That's why I'm here. Let me break down "${question}" for you in a simple way...`,
      weaknessArea: questionData.weakness,
    }
  } else if (hasKeywords) {
    return {
      isCorrect: true,
      feedback: "Great! You've got the right idea! Let me expand on that with more details...",
      weaknessArea: 'Strong Understanding',
    }
  } else {
    return {
      isCorrect: false,
      feedback: `I appreciate your effort! I can see there's room to deepen your understanding here. Let me explain it more clearly...`,
      weaknessArea: questionData.weakness,
    }
  }
}

export default function MentorGuidanceChat({
  mentorName,
  mentorAvatar,
  weaknessTopic,
  suggestedQuestions,
  onClose,
  onComplete,
}: MentorGuidanceProps) {
  const [messages, setMessages] = useState<GuidanceMessage[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState(0)
  const [identifiedWeaknesses, setIdentifiedWeaknesses] = useState<string[]>([])
  const [conversationStarted, setConversationStarted] = useState(false)

  // Initialize with introduction message
  useEffect(() => {
    if (!conversationStarted && messages.length === 0) {
      setMessages([
        {
          id: '0',
          sender: 'mentor',
          type: 'introduction',
          explanation: `Hi! 👋 I'm ${mentorName}, and I'm a real person here to help you! I see you're working on ${weaknessTopic} - that's great! I'm going to ask you some questions to understand where you're at. Don't worry if you're not sure - that's exactly why I'm here. Let's learn together! Ready for the first question? 😊`,
          timestamp: new Date(),
        },
      ])
      setConversationStarted(true)
    }
  }, [conversationStarted, mentorName, weaknessTopic, messages.length])

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return

    const question = suggestedQuestions[currentQuestion]

    // Add user's answer to messages
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'mentee',
        type: 'question',
        question,
        userAnswer,
        timestamp: new Date(),
      },
    ])

    // Evaluate the answer
    const evaluation = evaluateAnswer(userAnswer, question)

    // Simulate mentor thinking and responding with personalized feedback
    setTimeout(() => {
      const topicAnswers = MENTOR_ANSWERS[weaknessTopic as keyof typeof MENTOR_ANSWERS] || {}
      const correctAnswer =
        topicAnswers[question as keyof typeof topicAnswers] ||
        "This is an important concept to understand!"

      // Track weakness
      if (!evaluation.isCorrect) {
        setIdentifiedWeaknesses((prev) =>
          prev.includes(evaluation.weaknessArea)
            ? prev
            : [...prev, evaluation.weaknessArea]
        )
      }

      const mentorResponse = `${evaluation.feedback}

${correctAnswer}

${evaluation.isCorrect ? '✨ Great understanding!' : '💡 This is a key concept to master.'}`

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'mentor',
          type: 'guidance',
          answer: mentorResponse,
          feedback: evaluation.feedback,
          timestamp: new Date(),
        },
      ])
      setShowFeedback(true)
    }, 1000)

    setUserAnswer('')
  }

  const handleNextQuestion = () => {
    const points = 10
    setTotalPoints(totalPoints + points)
    setCompletedQuestions(completedQuestions + 1)

    // Add encouraging feedback
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 2).toString(),
        sender: 'mentor',
        type: 'feedback',
        feedback: `Awesome! 🎉 You earned ${points} points. You're doing great! Let's move to the next question.`,
        points,
        timestamp: new Date(),
      },
    ])

    setShowFeedback(false)

    if (currentQuestion < suggestedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // All questions completed - show analysis
      setTimeout(() => {
        const weaknessText = identifiedWeaknesses.length > 0
          ? `I noticed you might need to focus on: ${identifiedWeaknesses.join(', ')}. That's totally normal! We'll practice these areas with fun game questions next.`
          : `Great job! You showed solid understanding across these concepts!`

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 3).toString(),
            sender: 'mentor',
            type: 'weakness-analysis',
            feedback: `📊 Here's what I found: ${weaknessText}

Now, I want to give you some game-based practice questions focused on your weak areas. These will help you build real confidence and mastery. You've got this! 💪

Let's move to the practice game where you'll put your knowledge to the test!`,
            points: 0,
            timestamp: new Date(),
          },
        ])
      }, 500)
    }
  }

  const allQuestionsCompleted = completedQuestions === suggestedQuestions.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-96 md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{mentorAvatar}</div>
            <div>
              <h3 className="text-lg font-bold">{mentorName}</h3>
              <p className="text-xs text-orange-100">Guided Learning - {weaknessTopic}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-500 mb-4">Ready to learn about {weaknessTopic}?</p>
                <p className="text-sm text-gray-400">Ask your first question to get started!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.sender === 'mentee' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg p-4 ${
                    msg.sender === 'mentee'
                      ? 'bg-orange-600 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {msg.type === 'question' && (
                    <p className="text-sm font-semibold mb-1">Your Question:</p>
                  )}
                  {msg.question && <p className="text-sm font-bold">{msg.question}</p>}
                  {msg.answer && (
                    <div>
                      <p className="text-sm font-semibold mb-1">💡 Answer:</p>
                      <p className="text-sm">{msg.answer}</p>
                    </div>
                  )}
                  {msg.explanation && (
                    <div className="flex items-start gap-2">
                      {msg.type === 'feedback' && msg.points && (
                        <Award className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-1" />
                      )}
                      <p className="text-sm">{msg.explanation}</p>
                    </div>
                  )}
                  <p className="text-xs mt-2 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white rounded-b-lg">
          {!allQuestionsCompleted ? (
            currentQuestion < suggestedQuestions.length ? (
              <div className="space-y-3">
                <div className="text-xs text-gray-600 font-semibold">
                  Question {currentQuestion + 1} of {suggestedQuestions.length}
                </div>
                
                {/* Show current question */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-orange-900">
                    {suggestedQuestions[currentQuestion]}
                  </p>
                </div>

                {/* Show answer input */}
                {!showFeedback ? (
                  <div className="space-y-2">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows={3}
                    />
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim()}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      Submit Answer
                    </button>
                  </div>
                ) : (
                  // Show next button after mentor responds
                  <button
                    onClick={handleNextQuestion}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <ChevronRight size={18} />
                    {currentQuestion === suggestedQuestions.length - 1 ? 'See Analysis' : 'Next Question'}
                  </button>
                )}
              </div>
            ) : null
          ) : (
            <button
              onClick={onComplete}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
            >
              <Award size={18} />
              Start Practice Game ({totalPoints} pts)
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 px-4 py-2 border-t text-xs text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Progress</span>
            <span>{completedQuestions}/{suggestedQuestions.length}</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
              style={{
                width: `${(completedQuestions / suggestedQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
