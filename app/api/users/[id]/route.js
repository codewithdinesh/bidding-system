import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/lib/models/User';

// userid to username
export async function GET(req,  { params }) {
    await connectDB();
    const { id } = params;

    console.log(id);
    console.log(req.body);

    const user = await User
        .findById(id)
        .select('username');

    return NextResponse.json(user);
}