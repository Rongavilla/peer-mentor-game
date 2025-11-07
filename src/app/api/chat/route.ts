import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/../../server/aiService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = await aiService.getMentorResponse(message, context)

    return NextResponse.json({
      response,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
