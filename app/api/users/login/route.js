import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/lib/models/User';

export async function POST(req) {
    await connectDB();
    const { username, password, role } = await req.json();

    // Find the user with matching username and password
    const user = await User.findOne({ username, password, role });

    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json(user);
}
