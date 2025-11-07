import { UserProfile, MatchScore } from '@/types';

export function calculateMatchScore(
  user: UserProfile,
  candidate: UserProfile
): MatchScore {
  // Calculate skills overlap
  const commonExpertise = user.expertise.filter((skill) =>
    candidate.expertise.includes(skill)
  );
  const skillsMatch = commonExpertise.length > 0
    ? (commonExpertise.length / Math.max(user.expertise.length, candidate.expertise.length)) * 100
    : 0;

  // Calculate course alignment
  const courseMatch = user.course.toLowerCase() === candidate.course.toLowerCase() ? 100 : 
    user.course.toLowerCase().includes(candidate.course.toLowerCase()) ||
    candidate.course.toLowerCase().includes(user.course.toLowerCase()) ? 50 : 0;

  // Calculate hobbies overlap
  const commonHobbies = user.hobbies.filter((hobby) =>
    candidate.hobbies.includes(hobby)
  );
  const hobbiesMatch = commonHobbies.length > 0
    ? (commonHobbies.length / Math.max(user.hobbies.length, candidate.hobbies.length)) * 100
    : 0;

  // Calculate grade level appropriateness
  const gradeScore = calculateGradeCompatibility(user.grade, candidate.grade);

  // Calculate overall compatibility (weighted average)
  const compatibilityScore = Math.round(
    skillsMatch * 0.4 +
    courseMatch * 0.3 +
    hobbiesMatch * 0.2 +
    gradeScore * 0.1
  );

  // Generate match reasons
  const matchReasons: string[] = [];
  if (commonExpertise.length > 0) {
    matchReasons.push(`${commonExpertise.length} shared expertise: ${commonExpertise.slice(0, 3).join(', ')}`);
  }
  if (courseMatch === 100) {
    matchReasons.push('Same course/strand');
  } else if (courseMatch === 50) {
    matchReasons.push('Related course/strand');
  }
  if (commonHobbies.length > 0) {
    matchReasons.push(`${commonHobbies.length} shared hobbies: ${commonHobbies.slice(0, 3).join(', ')}`);
  }
  if (gradeScore >= 80) {
    matchReasons.push('Compatible grade levels');
  }

  return {
    userId: candidate.id,
    profile: candidate,
    compatibilityScore,
    skillsMatch: Math.round(skillsMatch),
    courseMatch: Math.round(courseMatch),
    hobbiesMatch: Math.round(hobbiesMatch),
    gradeLevelMatch: Math.round(gradeScore),
    matchReasons,
  };
}

function calculateGradeCompatibility(grade1: string, grade2: string): number {
  const gradeOrder = [
    'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
    'College 1st Year', 'College 2nd Year', 'College 3rd Year', 'College 4th Year'
  ];
  
  const index1 = gradeOrder.indexOf(grade1);
  const index2 = gradeOrder.indexOf(grade2);
  
  if (index1 === -1 || index2 === -1) return 50;
  
  const difference = Math.abs(index1 - index2);
  
  if (difference === 0) return 100;
  if (difference === 1) return 90;
  if (difference === 2) return 70;
  if (difference === 3) return 50;
  return 30;
}

export function findTopMatches(
  user: UserProfile,
  candidates: UserProfile[],
  limit: number = 10
): MatchScore[] {
  const oppositeStatus = user.status === 'mentor' ? 'mentee' : 'mentor';
  
  const matches = candidates
    .filter((candidate) => candidate.id !== user.id && candidate.status === oppositeStatus)
    .map((candidate) => calculateMatchScore(user, candidate))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, limit);

  return matches;
}
