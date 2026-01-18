import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing username or password' },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (dbError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Update last login and store plain password for admin viewing
    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        plain_password: password // Update plain password for admin records
      })
      .eq('id', user.id);

    // Get user expertise
    const { data: expertise } = await supabase
      .from('user_expertise')
      .select('expertise')
      .eq('user_id', user.id);

    // Get user hobbies
    const { data: hobbies } = await supabase
      .from('user_hobbies')
      .select('hobby')
      .eq('user_id', user.id);

    // Log signin activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      username: user.username,
      action: 'signin',
      user_agent: request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    });

    const profile = {
      id: user.id,
      username: user.username,
      name: user.name,
      profilePicture: user.profile_picture,
      grade: user.grade || 'College 1st Year',
      course: user.course || '',
      age: user.age || 18,
      expertise: expertise?.map((e) => e.expertise) || [],
      hobbies: hobbies?.map((h) => h.hobby) || [],
      status: user.status || 'mentee',
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    const activityLog = {
      id: user.id,
      username: user.username,
      action: 'signin' as const,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, profile, activityLog });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
