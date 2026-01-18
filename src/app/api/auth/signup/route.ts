import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { 
      username, 
      password, 
      name, 
      email,
      grade,
      age,
      course,
      status,
      hobbies = [],
      expertise = []
    } = await request.json();

    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const userData: any = {
      username,
      email: email || null,
      name,
      password_hash: passwordHash,
      grade: grade || 'College 1st Year',
      age: age || 18,
      course: course || '',
      status: status || 'mentee',
      profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        username
      )}`,
    };

    const { data: newUser, error: signupError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (signupError) {
      if (signupError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Username already exists' },
          { status: 409 }
        );
      }
      throw signupError;
    }

    // Insert hobbies
    if (hobbies && hobbies.length > 0) {
      const hobbiesData = hobbies.map((hobby: string) => ({
        user_id: newUser.id,
        hobby,
      }));
      await supabase.from('user_hobbies').insert(hobbiesData);
    }

    // Insert expertise
    if (expertise && expertise.length > 0) {
      const expertiseData = expertise.map((exp: string) => ({
        user_id: newUser.id,
        expertise: exp,
      }));
      await supabase.from('user_expertise').insert(expertiseData);
    }

    // Log signin activity
    await supabase.from('activity_logs').insert({
      user_id: newUser.id,
      username: newUser.username,
      action: 'signin',
      user_agent: request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    });

    // Convert to UserProfile format
    const profile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      profilePicture: newUser.profile_picture,
      grade: newUser.grade || 'College 1st Year',
      course: newUser.course || '',
      age: newUser.age || 18,
      hobbies: hobbies || [],
      expertise: expertise || [],
      status: newUser.status || 'mentee',
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at,
    };

    const activityLog = {
      id: newUser.id,
      username: newUser.username,
      action: 'signin' as const,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, profile, activityLog });
  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as any).message);
    }
    
    console.error('Signup error:', errorMessage);
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage || 'Failed to sign up',
      },
      { status: 500 }
    );
  }
}
