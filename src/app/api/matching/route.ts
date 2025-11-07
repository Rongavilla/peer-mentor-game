import { NextRequest, NextResponse } from 'next/server';
import { mockUser, mockCandidates } from '@/lib/mockData';
import { findTopMatches } from '@/lib/matching';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const skillFilter = searchParams.get('skill');
    const courseFilter = searchParams.get('course');

    // In production, get current user from session
    let user = mockUser;
    let candidates = mockCandidates;

    // Apply filters
    if (skillFilter) {
      candidates = candidates.filter((c) =>
        c.expertise.some((skill: string) => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    if (courseFilter) {
      candidates = candidates.filter((c) =>
        c.course.toLowerCase().includes(courseFilter.toLowerCase())
      );
    }

    const matches = findTopMatches(user, candidates, limit);

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to find matches' },
      { status: 500 }
    );
  }
}
