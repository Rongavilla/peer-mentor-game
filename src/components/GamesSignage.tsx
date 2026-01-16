'use client'

import { useState } from 'react'
import GamelikeAssessment from './GamelikeAssessment'
import MentorMatching from './MentorMatching'

interface AssessmentState {
  completed: boolean
  score: number
  badgeIcon: string
  badgeName: string
}

export default function GamesSignage() {
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [assessmentState, setAssessmentState] = useState<AssessmentState | null>(null)

  return (
    <section className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Games and Challenges</h2>
        <p className="mt-1 text-sm text-gray-600">Play short IT-themed games to earn badges and learn while having fun.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => setShowNoteModal(true)}
          className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-cyan-50 to-blue-50 text-left hover:scale-105 transform transition-transform"
        >
          <div className="p-6 text-center">
            <img src="/games/four-pics-improved-logo.svg" alt="Let's Match" className="w-32 h-32 mx-auto mb-3 rounded-lg" />
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Times New Roman' }}>Let's Match</h3>
            <p className="mt-2 text-sm text-gray-600">Take an IT expertise assessment and find your perfect mentor match.</p>
            <button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md font-medium hover:bg-cyan-700">Start Assessment</button>
          </div>
        </button>
      </div>

      {/* Assessment Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">TAKE NOTE</h2>
              <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
                <p className="font-semibold">To all new and incoming IT Experts:</p>
                
                <p>Please be informed that you will be given a set of 20 assessment questions covering various IT-related topics. These questions are designed to evaluate your fundamental knowledge and expertise in the following areas:</p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Data Structures and Algorithms</li>
                  <li>Database Management Systems (DBMS)</li>
                  <li>Networking and Communication</li>
                  <li>Operating Systems</li>
                  <li>Programming Languages and Software Engineering</li>
                  <li>Computer Architecture and Systems Design</li>
                  <li>Information Systems and Data Management</li>
                </ul>

                <p>The assessment scores will be used as the basis for AI-powered mentor matching. Based on your results, you will be automatically connected to a designated mentor. Participants with lower scores will be matched with IT experts who will provide guidance, support, and assistance to help improve their skills.</p>

                <p className="font-semibold">Kindly prepare accordingly. Thank you for your cooperation.</p>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setShowNoteModal(false)
                    setShowAssessment(true)
                  }}
                  className="flex-1 px-6 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
                >
                  Continue to Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Component */}
      {showAssessment && !assessmentState?.completed && (
        <GamelikeAssessment
          onComplete={(score, badgeIcon, badgeName) => {
            setAssessmentState({
              completed: true,
              score,
              badgeIcon,
              badgeName,
            })
          }}
        />
      )}

      {/* Mentor Matching Component */}
      {assessmentState?.completed && (
        <MentorMatching
          score={assessmentState.score}
          badgeIcon={assessmentState.badgeIcon}
          badgeName={assessmentState.badgeName}
        />
      )}
    </section>
  )
}