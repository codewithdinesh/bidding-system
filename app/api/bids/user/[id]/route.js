import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Bid from '@/lib/models/Bid';

export async function GET(req, { params }) {
    await connectDB();

    const { id } = params;
    try {
        // Find all bids where the creatorId matches the provided userId
        const bids = await Bid.find({ creatorId: id });


        console.log("Working....." + id);
        console.log(bids);


        return NextResponse.json(bids);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve bids.' }, { status: 500 });
    }
}
