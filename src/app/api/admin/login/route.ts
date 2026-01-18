import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password === ADMIN_PASSWORD) {
      // Create a simple token
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64')

      // Log admin login activity to database
      try {
        await supabase.from('activity_logs').insert({
          username: 'admin',
          action: 'admin_login',
          user_agent: request.headers.get('user-agent'),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        })
      } catch (logError) {
        console.warn('Failed to log admin login:', logError)
        // Don't fail the login if logging fails
      }

      return NextResponse.json({
        success: true,
        token,
      })
    } else {
      // Log failed admin login attempt to database
      try {
        await supabase.from('activity_logs').insert({
          username: 'admin',
          action: 'admin_login_failed',
          user_agent: request.headers.get('user-agent'),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        })
      } catch (logError) {
        console.warn('Failed to log admin login attempt:', logError)
      }

      return NextResponse.json({
        success: false,
        error: 'Invalid password',
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
