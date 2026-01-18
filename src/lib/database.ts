export function saveUserToDatabase(profile: any) {
  try {
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    
    // Check if user already exists, if so update it
    const userIndex = allUsers.findIndex((u: any) => u.id === profile.id);
    if (userIndex >= 0) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...profile, updatedAt: new Date().toISOString() };
    } else {
      allUsers.push(profile);
    }
    
    localStorage.setItem('all_users', JSON.stringify(allUsers));
    return true;
  } catch (error) {
    console.error('Failed to save user:', error);
    return false;
  }
}

export function saveActivityLog(activityLog: any) {
  try {
    const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    logs.push(activityLog);
    localStorage.setItem('activity_logs', JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error('Failed to save activity log:', error);
    return false;
  }
}

export function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem('all_users') || '[]');
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
}

export function getActivityLogs() {
  try {
    return JSON.parse(localStorage.getItem('activity_logs') || '[]');
  } catch (error) {
    console.error('Failed to get activity logs:', error);
    return [];
  }
}
