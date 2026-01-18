# 💬 Messaging System Documentation

## Overview
A complete real-time messaging system that allows mentors and mentees to connect and communicate directly.

## Features

### 1. **Messages Page** (`/messages`)
- Full-featured messaging interface
- View all conversations in a list
- Start new conversations with other users
- Search for users by name or username
- See unread message counts
- Display user role (Mentor/Mentee) and expertise
- Real-time message updates every 2 seconds

### 2. **Floating Messaging Component**
- Floating chat button on the dashboard (bottom-right corner)
- Shows unread message count badge
- Quick access to existing conversations
- Send and receive messages without navigating away

### 3. **Navigation Integration**
- Messages button in header navigation
- Quick link to `/messages` page from dashboard
- Floating message button on dashboard for quick access

## User Flow

### Starting a New Conversation
1. Click "New Message" button or messages icon
2. Search for a mentee/mentor by name or username
3. See their role, expertise, and hobbies
4. Click on the user to open conversation
5. Type and send your first message

### Sending/Receiving Messages
1. Select a conversation from the list
2. Messages appear in chronological order
3. Your messages appear on the right (blue)
4. Other user's messages appear on the left (gray)
5. Message timestamps show when sent
6. New messages auto-refresh every 2 seconds
7. Messages automatically marked as read when conversation is opened

### Unread Messages
- Red badge shows count of unread messages
- Unread count updates in real-time
- Messages marked as read automatically when conversation is opened

## Technical Details

### API Endpoints

#### GET `/api/messages`
**Fetch conversations or messages**
```typescript
// Get all conversations for a user
GET /api/messages?userId=user123
Response: {
  success: true,
  conversations: [
    {
      conversationId: "user1_user2",
      otherUserId: "user2",
      otherUserName: "John",
      otherUserAvatar: "avatar_url",
      lastMessage: "Hey, how are you?",
      lastMessageTime: "2024-01-17T10:30:00Z",
      unreadCount: 2
    }
  ]
}

// Get messages for a specific conversation
GET /api/messages?conversationId=user1_user2
Response: {
  success: true,
  messages: [
    {
      id: "msg_123",
      conversationId: "user1_user2",
      senderId: "user1",
      senderName: "Alice",
      senderAvatar: "avatar_url",
      recipientId: "user2",
      recipientName: "Bob",
      recipientAvatar: "avatar_url",
      text: "Hey Bob!",
      timestamp: "2024-01-17T10:30:00Z",
      read: false
    }
  ]
}
```

#### POST `/api/messages`
**Send a new message**
```typescript
POST /api/messages
Body: {
  senderId: "user1",
  senderName: "Alice",
  senderAvatar: "avatar_url",
  recipientId: "user2",
  recipientName: "Bob",
  recipientAvatar: "avatar_url",
  text: "Hello! Want to learn together?"
}

Response: {
  success: true,
  message: {
    id: "msg_123",
    conversationId: "user1_user2",
    senderId: "user1",
    senderName: "Alice",
    text: "Hello! Want to learn together?",
    timestamp: "2024-01-17T10:30:00Z",
    read: false
  }
}
```

#### PATCH `/api/messages`
**Mark messages as read**
```typescript
PATCH /api/messages
Body: {
  conversationId: "user1_user2",
  userId: "user1"
}

Response: {
  success: true
}
```

## Data Storage

### In-Memory Storage (Current)
Messages are stored in memory on the API route. This means:
- Messages persist during the session
- Messages are lost when the server restarts
- Good for development/testing

### Future: Database Integration
To make messages persistent, implement:
1. Create `messages` table in Supabase
2. Create `conversations` table to group messages
3. Update API routes to use database queries
4. Add message archival for old messages

### Schema Example
```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id TEXT NOT NULL,
  user2_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Components

### Messaging Component (`/components/Messaging.tsx`)
- Floating button with unread badge
- Conversation list panel
- Chat area with message history
- Message input with send button
- Auto-scroll to latest message
- Real-time message refresh

**Props:**
```typescript
interface MessagingProps {
  currentUserId: string       // User's unique ID
  currentUserName: string     // User's display name
  currentUserAvatar: string   // User's avatar URL
}
```

### Messages Page (`/app/messages/page.tsx`)
- Full-screen messaging interface
- Three-panel layout (conversations, chat, user search)
- "New Message" modal with user search
- Filter users by name/username
- Show user role and expertise
- Message search capability
- Auto-logout redirect if not authenticated

## Integration Points

### Dashboard (`/app/dashboard/page.tsx`)
1. Import Messaging component
2. Add Messages button to header
3. Render `<Messaging>` component with user props
4. Floating button appears on dashboard

### Header (`/components/Header.tsx`)
1. Added Messages link in navigation
2. Links to `/messages` page
3. Shows for authenticated users only

### Sign In/Sign Up
- Users must be authenticated to message
- Profile data saved in Zustand store
- User ID used as unique identifier

## User Experience Features

### Real-Time Updates
- Messages refresh every 2 seconds
- Conversations refresh every 3 seconds
- Auto-scroll to latest message
- Unread count updates instantly

### Visual Feedback
- Blue bubble for sent messages
- Gray bubble for received messages
- Timestamps on every message
- User avatars in conversation list
- Unread badge with count
- Online/offline status indication

### Search & Discovery
- Search conversations by user name
- Search all users by name/username
- Filter by mentor/mentee role
- Show expertise tags
- Display user hobbies

## Future Enhancements

1. **Typing Indicators**
   - Show "User is typing..." status
   - Real-time typing detection

2. **Message Reactions**
   - Emoji reactions to messages
   - Like, love, laugh reactions

3. **Media Support**
   - Image sharing
   - File attachments
   - Code snippet sharing

4. **Message Features**
   - Message search/filtering
   - Message archival
   - Message deletion/editing
   - Pin important messages

5. **Group Chats**
   - Create group conversations
   - Study group chats
   - Mentor circle discussions

6. **Notifications**
   - Browser notifications for new messages
   - Sound alerts option
   - Email digests

7. **Rich Text**
   - Markdown support
   - Code syntax highlighting
   - Message formatting (bold, italic)

8. **Database Integration**
   - Persistent message storage
   - Message history export
   - Analytics dashboard

## Testing

### Test Conversation Flow
1. Create two accounts (mentee and mentor)
2. Go to Messages page on first account
3. Click "New Message"
4. Search for and select second user
5. Send a message
6. Switch to second account
7. See unread message badge
8. Click Messages to see conversation
9. Reply to the message
10. Verify real-time update on first account

### Test Edge Cases
- Empty conversation list
- No messages in conversation
- Very long messages
- Rapid message sending
- Multiple simultaneous conversations
- User search with special characters

## Troubleshooting

### Messages Not Appearing
- Check browser console for errors
- Verify API endpoint is working
- Check that `userId` is being passed correctly
- Ensure messages are being fetched from correct conversation

### Unread Count Not Updating
- Manual refresh should show correct count
- Check that PATCH request to mark as read is working
- Verify conversation ID matches

### Can't Find User to Message
- User must be in the system (signed up)
- Search is case-insensitive
- Check exact username if name search doesn't work
- User must have a different ID than current user

## Code Example: Using Messaging Component

```tsx
import Messaging from '@/components/Messaging'
import { useUserStore } from '@/store/userStore'

export default function MyPage() {
  const profile = useUserStore((s) => s.profile)

  return (
    <div>
      {profile && (
        <Messaging
          currentUserId={profile.id}
          currentUserName={profile.name}
          currentUserAvatar={profile.profilePicture || ''}
        />
      )}
    </div>
  )
}
```

## Security Considerations

### Current Implementation (Development)
- In-memory storage (no persistence)
- Client-side user verification
- No authentication tokens

### Production Recommendations
1. Add authentication middleware to API routes
2. Validate user permissions on server
3. Sanitize message text to prevent XSS
4. Implement rate limiting
5. Add message encryption
6. Implement role-based access control
7. Add audit logging for all messages
8. GDPR compliance for message retention
