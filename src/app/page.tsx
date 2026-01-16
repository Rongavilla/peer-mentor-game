'use client'

import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <nav className="border-b border-slate-700/50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                SQ
              </div>
              <span className="text-xl font-bold text-white">StudyQuest</span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <h1 className="text-7xl font-black text-white mb-4 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            StudyQuest
          </h1>
          <p className="text-2xl text-gray-300 mb-12 text-center">Master IT skills through games and mentorship</p>
          
          <Link href="/signin">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition mb-4 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70">
              Get Started
            </button>
          </Link>
        </section>

        {/* How It Works Section */}
        <section className="bg-slate-800/50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">How It Works</h2>
          <p className="text-gray-400 text-center mb-12">Simple steps to master IT skills</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Play the Game</h3>
              <p className="text-gray-400">Answer IT-related questions and earn badges based on your score</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Get Matched with Mentors</h3>
              <p className="text-gray-400">Our AI analyzes your score and expertise to find the perfect mentor</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn Together</h3>
              <p className="text-gray-400">Connect with mentors who match your skill level and interests</p>
            </div>
          </div>
        </div>
        </section>

        {/* What is StudyQuest Section */}
        <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">What is StudyQuest?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn Through Play</h3>
              <p className="text-gray-400">Test your IT knowledge through interactive games and earn badges</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Powered by AI</h3>
              <p className="text-gray-400">Our AI matches you with mentors based on your expertise and learning goals</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Proven Results</h3>
              <p className="text-gray-400">Students using StudyQuest report faster learning and better retention</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">For Everyone</h3>
              <p className="text-gray-400">Whether you're learning basic IT or advanced skills, StudyQuest works for you</p>
            </div>
          </div>

          <p className="text-gray-300 text-center text-lg leading-relaxed">
            StudyQuest is an innovative platform that combines gamified learning with AI-powered mentor matching. 
            Test your IT knowledge through interactive games, earn badges that showcase your expertise, and get matched 
            with experienced mentors who can help you grow further. Learn at your own pace, in your own way.
          </p>
        </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700 py-8 px-4 text-center text-gray-400">
          <p>© 2026 StudyQuest. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}