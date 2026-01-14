'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { saveUserToDatabase, saveActivityLog } from '@/lib/database'
import { UserPlus, User, Lock, BookOpen, Trophy } from 'lucide-react'

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
        
        // Save user data to localStorage
        saveUserToDatabase(data.profile)
        
        // Save activity log
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/40 to-purple-50/40 p-6">
      <div className="max-w-4xl w-full">
        {/* Form card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-full">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create your account</h2>
              <p className="text-sm text-gray-500">Fill in your details to get started</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name *</label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User className="w-4 h-4" /></span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username *</label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User className="w-4 h-4" /></span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 block w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="choose a username"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock className="w-4 h-4" /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="create a password"
                  required
                />
              </div>
            </div>

            {/* Education Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Education
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade *</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="18"
                    min="10"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Course/Strand *</label>
                  <input
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., BS Computer Science"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                What's your role?
              </h3>
              <div className="flex gap-4">
                {STATUS_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option}
                      checked={status === option}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hobbies */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Hobbies</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {HOBBIES.map((hobby) => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => toggleHobby(hobby)}
                    className={`px-3 py-2 text-sm rounded-full border font-medium transition-colors ${
                      selectedHobbies.includes(hobby)
                        ? 'bg-indigo-100 border-indigo-600 text-indigo-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
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
                  className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHobby())}
                />
                <button
                  type="button"
                  onClick={addCustomHobby}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md font-medium hover:bg-indigo-100"
                >
                  Add
                </button>
              </div>
              {selectedHobbies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedHobbies.map((hobby) => (
                    <span key={hobby} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {hobby}
                      <button
                        type="button"
                        onClick={() => setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby))}
                        className="ml-1 hover:text-indigo-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Expertise */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Expertise/Skills</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={customExpertise}
                  onChange={(e) => setCustomExpertise(e.target.value)}
                  placeholder="Add expertise (e.g., Python, Mathematics)"
                  className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomExpertise())}
                />
                <button
                  type="button"
                  onClick={addCustomExpertise}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md font-medium hover:bg-indigo-100"
                >
                  Add
                </button>
              </div>
              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {expertise.map((skill) => (
                    <span key={skill} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {skill}
                      <button
                        type="button"
                        onClick={() => setExpertise(expertise.filter((s) => s !== skill))}
                        className="ml-1 hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
              <Link
                href="/signin"
                className="px-4 py-2 border border-gray-200 rounded-md font-semibold text-gray-700 hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Already have an account? <Link href="/signin" className="text-indigo-600 font-medium">Sign in here</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
