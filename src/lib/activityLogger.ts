import { supabase } from '@/lib/supabase';

/**
 * Comprehensive activity logging system
 * Tracks all important events in the application
 */

export interface ActivityEvent {
  username: string;
  action: 'signin' | 'signout' | 'signup' | 'profile_update' | 'expertise_add' | 'message_sent' | 'game_played' | 'badge_earned';
  ip_address?: string;
  user_agent?: string;
  details?: string;
}

/**
 * Get client IP address
 */
export function getClientIp(): string {
  // In a real app, you might use a service to get the actual IP
  // For now, we'll get it from the browser
  return 'Unknown';
}

/**
 * Get user agent
 */
export function getUserAgent(): string {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent;
  }
  return 'Unknown';
}

/**
 * Log an activity event to the database
 */
export async function logActivity(event: ActivityEvent): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([
        {
          username: event.username,
          action: event.action,
          ip_address: event.ip_address || getClientIp(),
          user_agent: event.user_agent || getUserAgent(),
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Failed to log activity:', error);
      return false;
    }

    console.log('Activity logged:', event.action);
    return true;
  } catch (err) {
    console.error('Error logging activity:', err);
    return false;
  }
}

/**
 * Log user sign-in
 */
export async function logSignIn(username: string): Promise<void> {
  await logActivity({
    username,
    action: 'signin',
    details: 'User signed in'
  });
}

/**
 * Log user sign-out
 */
export async function logSignOut(username: string): Promise<void> {
  await logActivity({
    username,
    action: 'signout',
    details: 'User signed out'
  });
}

/**
 * Log user sign-up
 */
export async function logSignUp(username: string): Promise<void> {
  await logActivity({
    username,
    action: 'signup',
    details: 'New user account created'
  });
}

/**
 * Log profile update
 */
export async function logProfileUpdate(username: string, updates: string): Promise<void> {
  await logActivity({
    username,
    action: 'profile_update',
    details: `Profile updated: ${updates}`
  });
}

/**
 * Log expertise added
 */
export async function logExpertiseAdded(username: string, expertise: string): Promise<void> {
  await logActivity({
    username,
    action: 'expertise_add',
    details: `Added expertise: ${expertise}`
  });
}

/**
 * Log message sent
 */
export async function logMessageSent(username: string, recipientUsername: string): Promise<void> {
  await logActivity({
    username,
    action: 'message_sent',
    details: `Sent message to ${recipientUsername}`
  });
}

/**
 * Log game played
 */
export async function logGamePlayed(username: string, gameName: string, score: number): Promise<void> {
  await logActivity({
    username,
    action: 'game_played',
    details: `Played ${gameName} - Score: ${score}`
  });
}

/**
 * Log badge earned
 */
export async function logBadgeEarned(username: string, badgeName: string): Promise<void> {
  await logActivity({
    username,
    action: 'badge_earned',
    details: `Earned badge: ${badgeName}`
  });
}

/**
 * Get recent activities
 */
export async function getRecentActivities(limit: number = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch activities:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching activities:', err);
    return [];
  }
}

/**
 * Get activities for a specific user
 */
export async function getUserActivities(username: string, limit: number = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch user activities:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching user activities:', err);
    return [];
  }
}

/**
 * Get activities by action type
 */
export async function getActivitiesByAction(action: string, limit: number = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', action)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch activities by action:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching activities:', err);
    return [];
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(): Promise<{
  totalSignIns: number;
  totalSignOuts: number;
  totalSignUps: number;
  totalMessagesLogged: number;
  totalGamesPlayed: number;
}> {
  try {
    const signIns = await getActivitiesByAction('signin');
    const signOuts = await getActivitiesByAction('signout');
    const signUps = await getActivitiesByAction('signup');
    const messages = await getActivitiesByAction('message_sent');
    const games = await getActivitiesByAction('game_played');

    return {
      totalSignIns: signIns.length,
      totalSignOuts: signOuts.length,
      totalSignUps: signUps.length,
      totalMessagesLogged: messages.length,
      totalGamesPlayed: games.length
    };
  } catch (err) {
    console.error('Error getting activity stats:', err);
    return {
      totalSignIns: 0,
      totalSignOuts: 0,
      totalSignUps: 0,
      totalMessagesLogged: 0,
      totalGamesPlayed: 0
    };
  }
}

/**
 * Clear old activities (older than X days)
 */
export async function clearOldActivities(daysOld: number = 90): Promise<boolean> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      console.error('Failed to clear old activities:', error);
      return false;
    }

    console.log(`Cleared activities older than ${daysOld} days`);
    return true;
  } catch (err) {
    console.error('Error clearing activities:', err);
    return false;
  }
}

export default {
  logActivity,
  logSignIn,
  logSignOut,
  logSignUp,
  logProfileUpdate,
  logExpertiseAdded,
  logMessageSent,
  logGamePlayed,
  logBadgeEarned,
  getRecentActivities,
  getUserActivities,
  getActivitiesByAction,
  getActivityStats,
  clearOldActivities
};
