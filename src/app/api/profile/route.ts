import { NextRequest, NextResponse } from 'next/server';
import { mockUser } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    // In production, get user from session/auth
    // For now, return mock user
    return NextResponse.json({ success: true, profile: mockUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Validate required fields
    if (updates.username && updates.username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }
    
    if (updates.age && (updates.age < 13 || updates.age > 100)) {
      return NextResponse.json(
        { success: false, error: 'Age must be between 13 and 100' },
        { status: 400 }
      );
    }

    // In production, update database
    const updatedProfile = { ...mockUser, ...updates, updatedAt: new Date().toISOString() };
    
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
