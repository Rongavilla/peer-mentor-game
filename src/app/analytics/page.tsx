import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Clock, Zap, Users, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  userGrowth: any[];
  messageStats: any;
  activityByHour: any[];
  topMentors: any[];
  practiceStats: any;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: [],
    messageStats: {},
    activityByHour: [],
    topMentors: [],
    practiceStats: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Get users by status
      const { data: users } = await supabase
        .from('users')
        .select('status, created_at');

      // Get message counts by date
      const { data: messages } = await supabase
        .from('messages')
        .select('created_at, is_read');

      // Get practice progress data
      const { data: progress } = await supabase
        .from('user_practice_progress')
        .select('game_name, score, best_score')
        .order('best_score', { ascending: false })
        .limit(10);

      // Get top mentors (mentors with most expertise)
      const { data: topMentors } = await supabase
        .from('users')
        .select('id, name, username, status')
        .eq('status', 'mentor')
        .limit(5);

      setAnalytics({
        userGrowth: users || [],
        messageStats: {
          total: messages?.length || 0,
          unread: messages?.filter((m: any) => !m.is_read).length || 0,
          read: messages?.filter((m: any) => m.is_read).length || 0
        },
        activityByHour: [],
        topMentors: topMentors || [],
        practiceStats: {
          totalAttempts: progress?.length || 0,
          data: progress || []
        }
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-8">Analytics Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Messages</p>
                    <p className="text-3xl font-bold text-white mt-2">{analytics.messageStats.total}</p>
                  </div>
                  <MessageSquare className="text-green-400" size={40} />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Unread Messages</p>
                    <p className="text-3xl font-bold text-red-400 mt-2">{analytics.messageStats.unread}</p>
                  </div>
                  <Zap className="text-red-400" size={40} />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Top Mentors</p>
                    <p className="text-3xl font-bold text-purple-400 mt-2">{analytics.topMentors.length}</p>
                  </div>
                  <Users className="text-purple-400" size={40} />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Practice Sessions</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">{analytics.practiceStats.totalAttempts}</p>
                  </div>
                  <TrendingUp className="text-blue-400" size={40} />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Mentors */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Users size={24} className="text-purple-400" />
                  Top Mentors
                </h2>
                <div className="space-y-4">
                  {analytics.topMentors.length === 0 ? (
                    <p className="text-gray-400">No mentors yet</p>
                  ) : (
                    analytics.topMentors.map((mentor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                        <div>
                          <p className="text-white font-semibold">{mentor.name || mentor.username}</p>
                          <p className="text-gray-400 text-sm">Mentor</p>
                        </div>
                        <div className="text-right">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-purple-300 font-bold">#{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message Stats */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MessageSquare size={24} className="text-green-400" />
                  Message Statistics
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Total Messages</span>
                      <span className="text-2xl font-bold text-white">{analytics.messageStats.total}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Read Messages</span>
                      <span className="text-2xl font-bold text-green-400">{analytics.messageStats.read}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            analytics.messageStats.total === 0
                              ? 0
                              : (analytics.messageStats.read / analytics.messageStats.total) * 100
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Unread Messages</span>
                      <span className="text-2xl font-bold text-red-400">{analytics.messageStats.unread}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${
                            analytics.messageStats.total === 0
                              ? 0
                              : (analytics.messageStats.unread / analytics.messageStats.total) * 100
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Practice Data */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 size={24} className="text-blue-400" />
                Top Practice Scores
              </h2>
              {analytics.practiceStats.data.length === 0 ? (
                <p className="text-gray-400">No practice data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Game</th>
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Best Score</th>
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Recent Score</th>
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.practiceStats.data.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition">
                          <td className="py-4 px-4 text-white font-semibold">{item.game_name}</td>
                          <td className="py-4 px-4 text-yellow-400 font-bold text-lg">{item.best_score}</td>
                          <td className="py-4 px-4 text-blue-400">{item.score}</td>
                          <td className="py-4 px-4">
                            <div className="w-32 bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                style={{
                                  width: `${Math.min((item.best_score / 100) * 100, 100)}%`
                                }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
