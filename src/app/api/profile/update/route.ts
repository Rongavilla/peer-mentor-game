import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, grade, course, age, expertise, hobbies } =
      await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name,
        grade,
        course,
        age,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Clear and update expertise
    if (expertise) {
      await supabase.from('user_expertise').delete().eq('user_id', userId);

      if (expertise.length > 0) {
        const expertiseData = expertise.map((exp: string) => ({
          user_id: userId,
          expertise: exp,
        }));
        await supabase.from('user_expertise').insert(expertiseData);
      }
    }

    // Clear and update hobbies
    if (hobbies) {
      await supabase.from('user_hobbies').delete().eq('user_id', userId);

      if (hobbies.length > 0) {
        const hobbiesData = hobbies.map((hobby: string) => ({
          user_id: userId,
          hobby,
        }));
        await supabase.from('user_hobbies').insert(hobbiesData);
      }
    }

    // Fetch updated user
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Get expertise and hobbies
    const { data: userExpertise } = await supabase
      .from('user_expertise')
      .select('expertise')
      .eq('user_id', userId);

    const { data: userHobbies } = await supabase
      .from('user_hobbies')
      .select('hobby')
      .eq('user_id', userId);

    const profile = {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      profilePicture: updatedUser.profile_picture,
      grade: updatedUser.grade,
      course: updatedUser.course,
      age: updatedUser.age,
      expertise: userExpertise?.map((e) => e.expertise) || [],
      hobbies: userHobbies?.map((h) => h.hobby) || [],
      status: updatedUser.status,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
