'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { saveUserToDatabase, saveActivityLog } from '@/lib/database'
import { UserPlus, User, Lock, BookOpen, Trophy, ChevronRight } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

const HOBBIES = ['Gaming', 'Programming', 'Reading', 'Music', 'Art', 'Photography', 'Sports', 'Writing', 'Cooking', 'Travel', 'Movies', 'Dancing']
const GRADES = ['School', 'College 1st Year', 'College 2nd Year', 'College 3rd Year', 'College 4th Year', 'Postgraduate']
const STATUS_OPTIONS = ['mentee', 'mentor']

export default function SignUpPage() {
  const router = useRouter()
  const setProfile = useUserStore((s) => s.setProfile)

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('College 1st Year')
  const [age, setAge] = useState('')
  const [course, setCourse] = useState('')
  const [status, setStatus] = useState('mentee')
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [customHobby, setCustomHobby] = useState('')
  const [expertise, setExpertise] = useState<string[]>([])
  const [customExpertise, setCustomExpertise] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    )
  }

  const addCustomHobby = () => {
    if (customHobby.trim() && !selectedHobbies.includes(customHobby)) {
      setSelectedHobbies([...selectedHobbies, customHobby])
      setCustomHobby('')
    }
  }

  const addCustomExpertise = () => {
    if (customExpertise.trim() && !expertise.includes(customExpertise)) {
      setExpertise([...expertise, customExpertise])
      setCustomExpertise('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          username, 
          password,
          grade,
          age: parseInt(age),
          course,
          status,
          hobbies: selectedHobbies,
          expertise
        }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Sign up failed')
      } else {
        setProfile(data.profile)
        saveUserToDatabase(data.profile)
        if (data.activityLog) {
          saveActivityLog(data.activityLog)
        }
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Create your account</h2>
                <p className="text-gray-300">Fill in your details to join StudyQuest</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Full name *</label>
                  <div className="mt-1 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 pr-4 py-3 block w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">Username *</label>
                  <div className="mt-1 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-12 pr-4 py-3 block w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                        placeholder="choose a username"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Password *</label>
                <div className="mt-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-4 py-3 block w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                      placeholder="create a password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Education
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">Grade *</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="mt-1 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                      required
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g} className="bg-slate-800">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Age *</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="mt-1 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                      placeholder="18"
                      min="10"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Course/Strand *</label>
                    <input
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="mt-1 block w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                      placeholder="e.g., BS Computer Science"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5 text-pink-400" />
                  What's your role?
                </h3>
                <div className="flex gap-4">
                  {STATUS_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="status"
                        value={option}
                        checked={status === option}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className="capitalize text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <label className="block text-sm font-medium text-gray-200 mb-3">Hobbies</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {HOBBIES.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className={`px-3 py-2 text-sm rounded-full border font-medium transition-all ${
                        selectedHobbies.includes(hobby)
                          ? 'bg-blue-500/30 border-blue-400 text-blue-200'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={customHobby}
                    onChange={(e) => setCustomHobby(e.target.value)}
                    placeholder="Add custom hobby"
                    className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHobby())}
                  />
                  <button
                    type="button"
                    onClick={addCustomHobby}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-medium hover:bg-blue-500/30 border border-blue-400/50 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {selectedHobbies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedHobbies.map((hobby) => (
                      <span key={hobby} className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-400/50">
                        {hobby}
                        <button
                          type="button"
                          onClick={() => setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby))}
                          className="ml-1 hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-6">
                <label className="block text-sm font-medium text-gray-200 mb-3">Expertise/Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={customExpertise}
                    onChange={(e) => setCustomExpertise(e.target.value)}
                    placeholder="Add expertise (e.g., Python, Mathematics)"
                    className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomExpertise())}
                  />
                  <button
                    type="button"
                    onClick={addCustomExpertise}
                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg font-medium hover:bg-purple-500/30 border border-purple-400/50 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill) => (
                      <span key={skill} className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-purple-400/50">
                        {skill}
                        <button
                          type="button"
                          onClick={() => setExpertise(expertise.filter((s) => s !== skill))}
                          className="ml-1 hover:text-purple-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-purple-500/50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <Link
                  href="/signin"
                  className="px-6 py-3 border border-white/20 rounded-lg font-semibold text-gray-200 hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  Sign in
                </Link>
              </div>

              <div className="text-center text-sm text-gray-300">
                <p>Already have an account? <Link href="/signin" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">Sign in here</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}