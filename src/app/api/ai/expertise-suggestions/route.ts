import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { hobbies, course } = await request.json()

    if (!hobbies || hobbies.length === 0) {
      return NextResponse.json({
        success: true,
        suggestions: getDefaultExpertiseSuggestions(course)
      })
    }

    // Generate suggestions based on hobbies and course
    const suggestions = generateExpertiseSuggestions(hobbies, course)

    return NextResponse.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}

function generateExpertiseSuggestions(hobbies: string[], course: string): string[] {
  const suggestions: Set<string> = new Set()

  // Hobby-based suggestions
  const hobbyExpertiseMap: { [key: string]: string[] } = {
    'Gaming': ['Game Development', 'C#', 'Unity', 'Unreal Engine', '3D Graphics'],
    'Programming': ['Python', 'JavaScript', 'Java', 'Web Development', 'Software Engineering'],
    'Reading': ['Literature', 'Writing', 'Research', 'Critical Thinking', 'English'],
    'Music': ['Music Theory', 'Audio Production', 'Composition', 'Sound Design'],
    'Art': ['Digital Art', 'Design', 'UI/UX', 'Animation', 'Creative Direction'],
    'Photography': ['Photo Editing', 'Composition', 'Lighting', 'Adobe Photoshop', 'Visual Design'],
    'Sports': ['Physical Education', 'Fitness Training', 'Sports Science', 'Coaching'],
    'Writing': ['Creative Writing', 'Content Writing', 'Copywriting', 'Technical Writing'],
    'Cooking': ['Culinary Arts', 'Nutrition', 'Food Science', 'Baking'],
    'Travel': ['Geography', 'Cultural Studies', 'Tourism', 'International Relations'],
    'Movies': ['Film Analysis', 'Cinematography', 'Screenwriting', 'Video Production'],
    'Dancing': ['Choreography', 'Dance Theory', 'Physical Education', 'Rhythm & Beat']
  }

  // Course-based suggestions
  const courseExpertiseMap: { [key: string]: string[] } = {
    'CS': ['Python', 'JavaScript', 'Data Structures', 'Algorithms', 'Web Development', 'Databases'],
    'Computer Science': ['C++', 'Java', 'Operating Systems', 'Networking', 'Cybersecurity'],
    'IT': ['IT Support', 'System Administration', 'Networking', 'Server Management'],
    'Engineering': ['Mathematics', 'Physics', 'CAD', 'Project Management', 'Problem Solving'],
    'Business': ['Business Management', 'Economics', 'Marketing', 'Finance', 'Leadership'],
    'Medicine': ['Anatomy', 'Biology', 'Chemistry', 'Healthcare', 'Medical Terminology'],
    'Law': ['Legal Research', 'Constitution', 'Contract Law', 'Writing'],
    'Arts': ['Literature', 'History', 'Philosophy', 'Cultural Studies'],
    'Mathematics': ['Calculus', 'Linear Algebra', 'Statistics', 'Problem Solving'],
    'Science': ['Physics', 'Chemistry', 'Biology', 'Laboratory Techniques']
  }

  // Add hobby-based suggestions
  hobbies.forEach((hobby) => {
    const expertises = hobbyExpertiseMap[hobby] || []
    expertises.forEach((exp) => suggestions.add(exp))
  })

  // Add course-based suggestions
  if (course) {
    const courseMatch = Object.keys(courseExpertiseMap).find((key) =>
      course.toLowerCase().includes(key.toLowerCase())
    )
    if (courseMatch) {
      const expertises = courseExpertiseMap[courseMatch] || []
      expertises.forEach((exp) => suggestions.add(exp))
    }
  }

  // Convert to array and limit to 8 suggestions
  return Array.from(suggestions).slice(0, 8)
}

function getDefaultExpertiseSuggestions(course: string): string[] {
  const defaults = [
    'Communication',
    'Problem Solving',
    'Critical Thinking',
    'Time Management',
    'Teamwork',
    'Leadership',
    'Research',
    'Analysis'
  ]

  if (course.toLowerCase().includes('cs') || course.toLowerCase().includes('computer')) {
    return ['Python', 'JavaScript', 'Data Structures', 'Algorithms', 'Web Development', 'Databases', 'Problem Solving', 'Code Review']
  }

  return defaults
}
