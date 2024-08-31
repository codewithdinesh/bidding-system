import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Bid from '@/lib/models/Bid';

export async function POST(req, { params }) {
    await connectDB();
    const { id } = params;
    const { itemIndex, amount, bidderId } = await req.json();

    try {
        // Find the bid by ID
        const bid = await Bid.findById(id).populate('bidItems.bidderId');
        if (!bid) return NextResponse.json({ message: 'Bid not found' }, { status: 404 });

        // Check if the bid end time has passed
        const currentTime = new Date();
        if (currentTime > bid.endTime) {
            // Bid has ended, declare the winner (highest bidder)
            return NextResponse.json({ message: 'Bid has ended. No more bids can be placed.' }, { status: 400 });
        }

        // Update the bid item with new amount and bidderId
        if (itemIndex >= 0 && itemIndex < bid.bidItems.length) {
            bid.bidItems[itemIndex].currentBid = amount;
            bid.bidItems[itemIndex].bidderId = bidderId;
            await bid.save();

            // Return the updated bid
            return NextResponse.json(bid, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Invalid item index' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating bid:', error);
        return NextResponse.json({ message: 'Error updating bid' }, { status: 500 });
    }
}
