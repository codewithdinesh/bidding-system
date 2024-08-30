
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/lib/models/User';

export async function GET(req) {
    await connectDB();
    const { username } = req.url?.split('?')[1] ? new URL(req.url).searchParams : {};

    // Fetch users by username or all users
    const users = username
        ? await User.find({ username })
        : await User.find();

    return NextResponse.json(users.map((user) => ({ username: user.username, role: user.role })));
}
