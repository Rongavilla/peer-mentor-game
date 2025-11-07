export type UserStatus = 'mentee' | 'mentor';

export type GradeLevel = 
  | 'Grade 7' 
  | 'Grade 8' 
  | 'Grade 9' 
  | 'Grade 10' 
  | 'Grade 11' 
  | 'Grade 12'
  | 'College 1st Year'
  | 'College 2nd Year'
  | 'College 3rd Year'
  | 'College 4th Year';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  grade: GradeLevel;
  course: string;
  age: number;
  hobbies: string[];
  expertise: string[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'profile' | 'mentorship' | 'skills' | 'activity' | 'reviews';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface MatchScore {
  userId: string;
  profile: UserProfile;
  compatibilityScore: number;
  skillsMatch: number;
  courseMatch: number;
  hobbiesMatch: number;
  gradeLevelMatch: number;
  matchReasons: string[];
}

export interface MentorshipConnection {
  id: string;
  mentorId: string;
  menteeId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  activeMentorships: number;
  upcomingSessions: number;
  recentAchievements: Badge[];
  skillProgress: {
    skill: string;
    progress: number;
  }[];
}
