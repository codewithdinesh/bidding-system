import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/lib/models/User';

export async function POST(req) {
    await connectDB();
    const { username, password, role } = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();

    return NextResponse.json(newUser);

}
