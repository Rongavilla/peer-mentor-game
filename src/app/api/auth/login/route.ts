import { NextResponse } from 'next/server';

const users = {
    mentor: 'mentor123',
    student: 'student123',
    admin: 'admin123',
};

export async function POST(req: Request) {
    const { username, password } = await req.json();
    if (users[username] === password) {
        return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}