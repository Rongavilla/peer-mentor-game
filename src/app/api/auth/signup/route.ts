import { NextRequest, NextResponse } from 'next/server';
import type { UserProfile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { username, password, name } = await request.json();

    if (!username || !password || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ success: false, error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Create a minimal mock profile for demo purposes
    const profile: UserProfile = {
      id: String(Date.now()),
      name,
      username,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
      grade: 'College 1st Year',
      course: '',
      age: 18,
      hobbies: [],
      expertise: [],
      status: 'mentee',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production you'd persist to DB and hash the password
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to sign up' }, { status: 500 });
  }
}
