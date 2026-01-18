import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    // Verify admin token
    if (!token || !token.includes('admin:')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    // Fetch users from users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch users',
      }, { status: 500 })
    }

    // Fetch activity logs - get recent logins
    const { data: activities, error: activitiesError } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200)

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError)
    }

    // Get user expertise and hobbies
    const userIds = (users || []).map((u: any) => u.id)
    let expertiseMap: { [key: string]: string[] } = {}
    let hobbiesMap: { [key: string]: string[] } = {}

    if (userIds.length > 0) {
      const { data: expertise } = await supabase
        .from('user_expertise')
        .select('user_id, expertise')
        .in('user_id', userIds)

      const { data: hobbies } = await supabase
        .from('user_hobbies')
        .select('user_id, hobby')
        .in('user_id', userIds)

      expertise?.forEach((item: any) => {
        if (!expertiseMap[item.user_id]) {
          expertiseMap[item.user_id] = []
        }
        expertiseMap[item.user_id].push(item.expertise)
      })

      hobbies?.forEach((item: any) => {
        if (!hobbiesMap[item.user_id]) {
          hobbiesMap[item.user_id] = []
        }
        hobbiesMap[item.user_id].push(item.hobby)
      })
    }

    // Map the database columns to our interface
    const mappedUsers = (users || []).map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email || '',
      grade: user.grade || 'N/A',
      course: user.course || '',
      age: user.age || 0,
      hobbies: hobbiesMap[user.id] || [],
      expertise: expertiseMap[user.id] || [],
      status: user.status || 'mentee',
      profilePicture: user.profile_picture || '/default-avatar.png',
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login,
      passwordHash: user.password_hash,
      plainPassword: user.plain_password || 'N/A', // Add plain password if available
    }))

    const mappedActivities = (activities || []).map((activity: any) => ({
      id: activity.id,
      userId: activity.user_id,
      username: activity.username,
      action: activity.action,
      timestamp: activity.timestamp,
      ipAddress: activity.ip_address,
    }))

    return NextResponse.json({
      success: true,
      users: mappedUsers,
      activities: mappedActivities,
      totalUsers: mappedUsers.length,
      totalMentors: mappedUsers.filter((u: any) => u.status === 'mentor').length,
      totalMentees: mappedUsers.filter((u: any) => u.status === 'mentee').length,
      recentLogins: mappedActivities.slice(0, 10),
    })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
