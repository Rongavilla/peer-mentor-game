import { NextRequest, NextResponse } from 'next/server';

// Predefined expertise suggestions based on common courses
const expertiseDatabase: Record<string, string[]> = {
  'computer science': [
    'JavaScript', 'Python', 'Java', 'C++', 'Data Structures',
    'Algorithms', 'Database Management', 'Web Development',
    'Machine Learning', 'Software Engineering', 'React', 'Node.js'
  ],
  'information technology': [
    'Network Administration', 'Cybersecurity', 'Cloud Computing',
    'System Administration', 'IT Support', 'Database Management',
    'JavaScript', 'Python', 'Linux', 'AWS', 'Azure'
  ],
  'computer engineering': [
    'Embedded Systems', 'Digital Logic', 'Microcontrollers',
    'IoT', 'Arduino', 'C++', 'Python', 'VHDL', 'Circuit Design',
    'Robotics', 'Computer Architecture'
  ],
  'data science': [
    'Python', 'R', 'Machine Learning', 'Deep Learning',
    'Data Analysis', 'Statistics', 'SQL', 'Pandas', 'NumPy',
    'TensorFlow', 'Data Visualization', 'Big Data'
  ],
  'software engineering': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React',
    'Angular', 'Vue.js', 'Node.js', 'Git', 'Agile', 'CI/CD',
    'Testing', 'Software Architecture'
  ],
};

const hobbyToExpertise: Record<string, string[]> = {
  'gaming': ['Game Development', 'Unity', 'Unreal Engine', 'C#', '3D Modeling'],
  'programming': ['Coding', 'Software Development', 'Problem Solving'],
  'music': ['Audio Programming', 'Digital Audio Workstations', 'Music Production'],
  'art': ['UI/UX Design', 'Graphic Design', 'Adobe Creative Suite', 'Figma'],
  'reading': ['Technical Writing', 'Documentation', 'Research'],
  'photography': ['Image Processing', 'Computer Vision', 'OpenCV'],
};

export async function POST(request: NextRequest) {
  try {
    const { course, hobbies, grade } = await request.json();

    const suggestions = new Set<string>();

    // Add suggestions based on course
    if (course) {
      const courseKey = Object.keys(expertiseDatabase).find((key) =>
        course.toLowerCase().includes(key)
      );
      if (courseKey) {
        expertiseDatabase[courseKey].forEach((skill) => suggestions.add(skill));
      }
    }

    // Add suggestions based on hobbies
    if (hobbies && Array.isArray(hobbies)) {
      hobbies.forEach((hobby: string) => {
        const hobbyKey = Object.keys(hobbyToExpertise).find((key) =>
          hobby.toLowerCase().includes(key)
        );
        if (hobbyKey) {
          hobbyToExpertise[hobbyKey].forEach((skill) => suggestions.add(skill));
        }
      });
    }

    // If using OpenAI API (when OPENAI_API_KEY is set)
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-placeholder') {
      try {
        // Import OpenAI dynamically
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `Given a student with the following profile:
- Course: ${course || 'Not specified'}
- Hobbies: ${hobbies?.join(', ') || 'Not specified'}
- Grade: ${grade || 'Not specified'}

Suggest 10 relevant technical skills or expertise areas they might be interested in or should learn. Return only a comma-separated list of skills.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.7,
        });

        const aiSuggestions = completion.choices[0]?.message?.content
          ?.split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        if (aiSuggestions) {
          aiSuggestions.forEach((skill) => suggestions.add(skill));
        }
      } catch (aiError) {
        console.error('AI suggestion error:', aiError);
        // Continue with non-AI suggestions
      }
    }

    return NextResponse.json({
      success: true,
      suggestions: Array.from(suggestions).slice(0, 15),
    });
  } catch (error) {
    console.error('Expertise suggestion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
