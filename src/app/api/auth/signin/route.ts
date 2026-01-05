import { NextRequest, NextResponse } from 'next/server';
import { mockUser } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Missing username or password' }, { status: 400 });
    }

    // Demo: accept any username/password and return a mock profile
    const profile = {
      ...mockUser,
      id: String(Date.now()),
      username,
      name: username,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to sign in' }, { status: 500 });
  }
}
