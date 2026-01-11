import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, name } = body
    if (!data || !name) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

    const matches = String(data).match(/^data:(.+);base64,(.+)$/)
    if (!matches) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

    const buffer = Buffer.from(matches[2], 'base64')
    const uploads = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true })

    const filename = `${Date.now()}-${name}`.replace(/[^a-zA-Z0-9\.\-_]/g, '')
    const filepath = path.join(uploads, filename)
    fs.writeFileSync(filepath, buffer)
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}