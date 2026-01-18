import React, { useState, useEffect } from 'react';
import { Activity, Users, MessageSquare, TrendingUp, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SystemStats {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  totalMessages: number;
  activeNow: number;
  recentActivities: any[];
}

export default function SystemMonitoring() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalMentors: 0,
    totalMentees: 0,
    totalMessages: 0,
    activeNow: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    try {
      setError('');
      
      // Fetch total users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch mentors
      const { data: mentors } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'mentor');

      // Fetch mentees
      const { data: mentees } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'mentee');

      // Fetch messages
      const { data: messages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Fetch recent activity logs
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch unread messages for "active now" metric
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      setStats({
        totalUsers: users?.length || 0,
        totalMentors: mentors?.length || 0,
        totalMentees: mentees?.length || 0,
        totalMessages: messages?.length || 0,
        activeNow: unreadMessages?.length || 0,
        recentActivities: activities || []
      });

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch system stats');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchStats();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">System Monitoring</h1>
            <p className="text-gray-300">Real-time dashboard of all system activities</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                autoRefresh
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-white'
              }`}
            >
              {autoRefresh ? '🔄 Auto Refresh ON' : '⏸️ Auto Refresh OFF'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <span className="text-red-100">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading system stats...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {/* Total Users Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-semibold">Total Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</p>
                  </div>
                  <Users className="text-blue-400" size={40} />
                </div>
              </div>

              {/* Mentors Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-semibold">Mentors</p>
                    <p className="text-4xl font-bold text-purple-400 mt-2">{stats.totalMentors}</p>
                  </div>
                  <TrendingUp className="text-purple-400" size={40} />
                </div>
              </div>

              {/* Mentees Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-semibold">Mentees</p>
                    <p className="text-4xl font-bold text-blue-400 mt-2">{stats.totalMentees}</p>
                  </div>
                  <Users className="text-blue-400" size={40} />
                </div>
              </div>

              {/* Messages Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-semibold">Total Messages</p>
                    <p className="text-4xl font-bold text-green-400 mt-2">{stats.totalMessages}</p>
                  </div>
                  <MessageSquare className="text-green-400" size={40} />
                </div>
              </div>

              {/* Active Now Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-semibold">Active Now</p>
                    <p className="text-4xl font-bold text-red-400 mt-2">{stats.activeNow}</p>
                  </div>
                  <Activity className="text-red-400 animate-pulse" size={40} />
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Activity size={28} className="text-blue-400" />
                Recent System Activity
              </h2>

              {stats.recentActivities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No recent activities recorded</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">User</th>
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Action</th>
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">IP Address</th>
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Time</th>
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentActivities.map((activity, index) => (
                        <tr
                          key={index}
                          className="border-b border-white/10 hover:bg-white/5 transition"
                        >
                          <td className="py-4 px-4 text-white">{activity.username || 'Unknown'}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              activity.action === 'signin'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {activity.action.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-300 font-mono text-sm">
                            {activity.ip_address || 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-gray-300 text-sm">
                            {new Date(activity.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <CheckCircle size={20} className="text-green-400" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* System Health Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Last updated: {new Date().toLocaleTimeString()} 
                {autoRefresh && ' • Auto-refreshing every 30 seconds'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
