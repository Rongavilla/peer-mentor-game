import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const skillFilter = searchParams.get('skill');
    const courseFilter = searchParams.get('course');
    const status = searchParams.get('status') || 'mentee';

    // Get all users with opposite role
    let query = supabase.from('users').select('*').eq('status', status);

    if (courseFilter) {
      query = query.ilike('course', `%${courseFilter}%`);
    }

    const { data: candidates, error: dbError } = await query;

    if (dbError) throw dbError;

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        success: true,
        matches: [],
        message: 'No matches found',
      });
    }

    // Enrich candidates with expertise and hobbies
    const enrichedMatches = await Promise.all(
      candidates.map(async (candidate) => {
        const { data: expertise } = await supabase
          .from('user_expertise')
          .select('expertise')
          .eq('user_id', candidate.id);

        const { data: hobbies } = await supabase
          .from('user_hobbies')
          .select('hobby')
          .eq('user_id', candidate.id);

        const expertiseList = expertise?.map((e) => e.expertise) || [];

        // Apply skill filter if provided
        if (
          skillFilter &&
          !expertiseList.some((skill) =>
            skill.toLowerCase().includes(skillFilter.toLowerCase())
          )
        ) {
          return null;
        }

        return {
          ...candidate,
          expertise: expertiseList,
          hobbies: hobbies?.map((h) => h.hobby) || [],
        };
      })
    );

    // Remove filtered out items
    const validMatches = enrichedMatches.filter((m) => m !== null);

    const matches = validMatches.slice(0, limit).map((candidate) => ({
      userId: candidate.id,
      profile: {
        id: candidate.id,
        name: candidate.name,
        username: candidate.username,
        profilePicture: candidate.profile_picture,
        grade: candidate.grade,
        course: candidate.course,
        age: candidate.age,
        expertise: candidate.expertise,
        hobbies: candidate.hobbies,
        status: candidate.status,
        createdAt: candidate.created_at,
        updatedAt: candidate.updated_at,
      },
      compatibilityScore: 75,
      matchReasons: ['Available for mentoring'],
    }));

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to find matches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userProfile, role } = await request.json();

    if (!userProfile || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing user profile or role' },
        { status: 400 }
      );
    }

    // Get all users with opposite role
    const targetRole = role === 'mentor' ? 'mentee' : 'mentor';
    const { data: potentialMatches, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('status', targetRole)
      .neq('id', userProfile.id);

    if (dbError) throw dbError;

    if (!potentialMatches || potentialMatches.length === 0) {
      return NextResponse.json({
        success: true,
        matches: [],
        message: 'No matches found',
      });
    }

    // Get expertise and hobbies for each match
    const enrichedMatches = await Promise.all(
      potentialMatches.map(async (match) => {
        const { data: expertise } = await supabase
          .from('user_expertise')
          .select('expertise')
          .eq('user_id', match.id);

        const { data: hobbies } = await supabase
          .from('user_hobbies')
          .select('hobby')
          .eq('user_id', match.id);

        return {
          ...match,
          expertise: expertise?.map((e) => e.expertise) || [],
          hobbies: hobbies?.map((h) => h.hobby) || [],
        };
      })
    );

    // Calculate compatibility scores
    const scoredMatches = enrichedMatches.map((match) => {
      let compatibilityScore = 50;
      let skillsMatch = 0;
      let hobbiesMatch = 0;

      const matchingSkills = userProfile.expertise.filter((skill: string) =>
        match.expertise.includes(skill)
      );
      skillsMatch = matchingSkills.length > 0 ? 30 : 0;

      const matchingHobbies = userProfile.hobbies.filter((hobby: string) =>
        match.hobbies.includes(hobby)
      );
      hobbiesMatch = matchingHobbies.length > 0 ? 20 : 0;

      compatibilityScore =
        Math.min(100, compatibilityScore + skillsMatch + hobbiesMatch);

      return {
        userId: match.id,
        profile: {
          id: match.id,
          name: match.name,
          username: match.username,
          profilePicture: match.profile_picture,
          grade: match.grade,
          course: match.course,
          age: match.age,
          expertise: match.expertise,
          hobbies: match.hobbies,
          status: match.status,
          createdAt: match.created_at,
          updatedAt: match.updated_at,
        },
        compatibilityScore,
        skillsMatch,
        hobbiesMatch,
        matchReasons: [
          ...matchingSkills.map((s: string) => `Shares skill: ${s}`),
          ...matchingHobbies.map((h: string) => `Shares hobby: ${h}`),
        ],
      };
    });

    scoredMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return NextResponse.json({
      success: true,
      matches: scoredMatches.slice(0, 10),
    });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to find matches' },
      { status: 500 }
    );
  }
}
