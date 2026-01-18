'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SimpleDatabaseTable() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error: err } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) {
        setError(err.message)
        console.error('Error:', err)
      } else {
        setUsers(data || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Users Table</h2>
        <button
          onClick={fetchUsers}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Username</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-3 text-gray-300">{user.id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 text-gray-300 font-medium">{user.username}</td>
                  <td className="px-4 py-3 text-gray-300">{user.name}</td>
                  <td className="px-4 py-3 text-gray-300">{user.email || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'mentor'
                        ? 'bg-purple-500/30 text-purple-300'
                        : 'bg-blue-500/30 text-blue-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-400">No users found</div>
          )}

          <div className="mt-4 text-sm text-gray-400">
            Total users: <span className="font-semibold text-white">{users.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}
