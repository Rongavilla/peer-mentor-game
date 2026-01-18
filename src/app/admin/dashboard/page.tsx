'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Users, Clock, Award, LogIn, LogOutIcon } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  grade: string
  course: string
  age: number
  hobbies: string[]
  expertise: string[]
  status: string
  profilePicture: string
  createdAt: string
  updatedAt: string
  passwordHash?: string
  plainPassword?: string
}

interface ActivityLog {
  id: string
  userId: string
  username: string
  action: string
  timestamp: string
  ipAddress?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showPasswordView, setShowPasswordView] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalMentees: 0,
    recentLogins: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/admin/data', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await res.json()

      if (data.success) {
        setUsers(data.users || [])
        setActivities(data.activities || [])
        setStats({
          totalUsers: data.totalUsers || 0,
          totalMentors: data.totalMentors || 0,
          totalMentees: data.totalMentees || 0,
          recentLogins: (data.recentLogins || []).length,
        })
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mentors</p>
                <p className="text-3xl font-bold text-white">{stats.totalMentors}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mentees</p>
                <p className="text-3xl font-bold text-white">{stats.totalMentees}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Recent Activity</p>
                <p className="text-3xl font-bold text-white">{activities.length}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Activity Log ({activities.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Users List */}
            <div className="col-span-2">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-700 border-b border-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-300 font-semibold">Avatar</th>
                        <th className="px-6 py-3 text-left text-gray-300 font-semibold">Username</th>
                        <th className="px-6 py-3 text-left text-gray-300 font-semibold">Name</th>
                        <th className="px-6 py-3 text-left text-gray-300 font-semibold">Email</th>
                        <th className="px-6 py-3 text-left text-gray-300 font-semibold">Password</th>
                        <th className="px-6 py-3 text-left text-gray-300 font-semibold">Status</th>
                        <th className="px-6 py-3 text-left text-gray-300 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-8 h-8 rounded-full"
                            />
                          </td>
                          <td className="px-6 py-4 text-white font-medium">@{user.username}</td>
                          <td className="px-6 py-4 text-gray-300">{user.name}</td>
                          <td className="px-6 py-4 text-gray-300 text-xs">{user.email || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                            {user.plainPassword ? (
                              <span className="bg-gray-700 px-2 py-1 rounded">{user.plainPassword}</span>
                            ) : (
                              <span className="text-gray-500">Not available</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.status === 'mentor'
                                  ? 'bg-purple-900 text-purple-200'
                                  : 'bg-blue-900 text-blue-200'
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowPasswordView(true)
                              }}
                              className="text-blue-400 hover:text-blue-300 underline text-xs"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* User Details Sidebar */}
            <div className="col-span-1">
              {selectedUser ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-20">
                  <h3 className="text-lg font-bold text-white mb-4">User Details</h3>
                  
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <img
                        src={selectedUser.profilePicture}
                        alt={selectedUser.username}
                        className="w-16 h-16 rounded-full mx-auto mb-2"
                      />
                      <p className="text-white font-semibold">{selectedUser.name}</p>
                      <p className="text-gray-400 text-sm">@{selectedUser.username}</p>
                    </div>

                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-gray-400 text-xs">Email</p>
                      <p className="text-white text-sm font-mono break-all">{selectedUser.email || 'N/A'}</p>
                    </div>

                    <div className="bg-red-900/30 border border-red-700 p-3 rounded">
                      <p className="text-red-300 text-xs font-semibold">Password</p>
                      <p className="text-white text-sm font-mono break-all mt-1">
                        {selectedUser.plainPassword || 'N/A'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-700 p-2 rounded">
                        <p className="text-gray-400 text-xs">Grade</p>
                        <p className="text-white">{selectedUser.grade}</p>
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <p className="text-gray-400 text-xs">Age</p>
                        <p className="text-white">{selectedUser.age}</p>
                      </div>
                    </div>

                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-gray-400 text-xs">Course</p>
                      <p className="text-white text-sm">{selectedUser.course || 'N/A'}</p>
                    </div>

                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-gray-400 text-xs mb-2">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedUser.status === 'mentor'
                            ? 'bg-purple-900 text-purple-200'
                            : 'bg-blue-900 text-blue-200'
                        }`}
                      >
                        {selectedUser.status === 'mentor' ? '👨‍🏫 Mentor' : '👨‍🎓 Mentee'}
                      </span>
                    </div>

                    {selectedUser.expertise && selectedUser.expertise.length > 0 && (
                      <div className="bg-gray-700 p-3 rounded">
                        <p className="text-gray-400 text-xs mb-2">Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.expertise.map((exp) => (
                            <span
                              key={exp}
                              className="bg-green-900 text-green-200 px-2 py-1 rounded text-xs"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedUser.hobbies && selectedUser.hobbies.length > 0 && (
                      <div className="bg-gray-700 p-3 rounded">
                        <p className="text-gray-400 text-xs mb-2">Hobbies</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.hobbies.map((hobby) => (
                            <span
                              key={hobby}
                              className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs"
                            >
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-gray-400 text-xs">Joined</p>
                      <p className="text-white text-xs">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center text-gray-400">
                  <p>Select a user to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Username</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Action</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Timestamp</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold">Icon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">@{activity.username}</td>
                      <td className="px-6 py-4 text-gray-300 capitalize">{activity.action}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(activity.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {activity.action === 'signin' ? (
                          <LogIn className="w-5 h-5 text-green-500" />
                        ) : (
                          <LogOutIcon className="w-5 h-5 text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
