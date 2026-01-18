import React from 'react';
import Link from 'next/link';
import { BarChart3, Database, Users, Settings, Activity, TrendingUp, Shield, Eye } from 'lucide-react';

export default function AdminPanel() {
  const adminOptions = [
    {
      title: 'System Monitoring',
      description: 'Real-time system activities and user statistics',
      icon: Activity,
      href: '/system-monitoring',
      color: 'from-blue-500 to-blue-600',
      badge: 'Live'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'from-green-500 to-green-600',
      badge: 'Analytics'
    },
    {
      title: 'Database Explorer',
      description: 'Browse and manage all database tables',
      icon: Database,
      href: '/database-explorer',
      color: 'from-purple-500 to-purple-600',
      badge: 'Database'
    },
    {
      title: 'User Management',
      description: 'View and manage all users',
      icon: Users,
      href: '/admin/users',
      color: 'from-orange-500 to-orange-600',
      badge: 'Users'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-red-500 to-red-600',
      badge: 'Settings'
    },
    {
      title: 'Performance Monitor',
      description: 'Monitor system performance and health',
      icon: TrendingUp,
      href: '/system-monitoring',
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Performance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-yellow-400" size={40} />
            <h1 className="text-5xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-gray-300 text-lg">Manage your peer-mentor game platform</p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Link key={index} href={option.href}>
                <div className={`bg-gradient-to-br ${option.color} rounded-xl p-6 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer h-full`}>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="text-white" size={36} />
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {option.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-white text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{option.description}</p>

                  {/* Link Arrow */}
                  <div className="flex items-center gap-2 text-white font-semibold group">
                    <span>Access</span>
                    <Eye size={16} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/20 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Total Users</p>
              <p className="text-white text-2xl font-bold mt-2">--</p>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Messages</p>
              <p className="text-white text-2xl font-bold mt-2">--</p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Database Tables</p>
              <p className="text-white text-2xl font-bold mt-2">7</p>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-4">
              <p className="text-gray-300 text-sm">System Status</p>
              <p className="text-green-400 text-2xl font-bold mt-2">✓ Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
