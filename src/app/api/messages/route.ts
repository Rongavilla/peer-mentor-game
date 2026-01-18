import { NextRequest, NextResponse } from 'next/server'

// Store messages in memory (in production, use a database)
let allMessages: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = allMessages.filter((m) => m.conversationId === conversationId)
      return NextResponse.json({ success: true, messages })
    }

    if (userId) {
      // Get all conversations for a user
      const conversations = new Map<string, any>()
      
      allMessages.forEach((msg) => {
        if (msg.senderId === userId || msg.recipientId === userId) {
          if (!conversations.has(msg.conversationId)) {
            conversations.set(msg.conversationId, {
              conversationId: msg.conversationId,
              otherUserId: msg.senderId === userId ? msg.recipientId : msg.senderId,
              otherUserName: msg.senderId === userId ? msg.recipientName : msg.senderName,
              otherUserAvatar: msg.senderId === userId ? msg.recipientAvatar : msg.senderAvatar,
              lastMessage: msg.text,
              lastMessageTime: msg.timestamp,
              unreadCount: 0,
            })
          }
          
          // Count unread messages
          if (msg.recipientId === userId && !msg.read) {
            const conv = conversations.get(msg.conversationId)!
            conv.unreadCount += 1
          }
        }
      })

      return NextResponse.json({ 
        success: true, 
        conversations: Array.from(conversations.values()).sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        )
      })
    }

    return NextResponse.json({ success: true, messages: allMessages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderId, senderName, senderAvatar, recipientId, recipientName, recipientAvatar, text } = body

    if (!senderId || !recipientId || !text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create conversation ID (sorted user IDs to ensure same ID regardless of direction)
    const conversationId = [senderId, recipientId].sort().join('_')

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      recipientId,
      recipientName,
      recipientAvatar,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    }

    allMessages.push(message)

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}

// Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, userId } = body

    if (!conversationId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mark all messages in conversation as read for this user
    allMessages.forEach((msg) => {
      if (msg.conversationId === conversationId && msg.recipientId === userId) {
        msg.read = true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json({ success: false, error: 'Failed to mark messages as read' }, { status: 500 })
  }
}
