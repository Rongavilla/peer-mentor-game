import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// In-memory storage for room validation
// In production, this should be in a database
const rooms = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomName, playerName } = body

    if (!roomName || !playerName) {
      return NextResponse.json(
        { error: 'Room name and player name are required' },
        { status: 400 }
      )
    }

    const roomId = `room-${uuidv4()}`
    
    rooms.set(roomId, {
      id: roomId,
      name: roomName,
      createdAt: Date.now(),
      createdBy: playerName,
    })

    return NextResponse.json({
      roomId,
      roomName,
      message: 'Room created successfully',
    })
  } catch (error) {
    console.error('Room creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const roomList = Array.from(rooms.values())
  return NextResponse.json({ rooms: roomList })
}
