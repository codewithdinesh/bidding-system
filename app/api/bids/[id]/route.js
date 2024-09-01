
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Bid from '@/lib/models/Bid';


export async function GET(req, { params }) {
    await connectDB();
    const { id } = params;

    console.log(params);

    // sort by last created to old
    const bid = await Bid.findById(id).populate('invitedBidders acceptedBidders');


    console.log(bid);

    if (!bid) return NextResponse.json({ message: 'Bid not found' }, { status: 404 });

    return NextResponse.json(bid, { status: 200 });
}

export async function PUT(req, { params }) {
    await connectDB();
    const { id } = params;
    const { itemIndex, amount, bidderId } = await req.json();

    const bidToUpdate = await Bid.findById(id);
    if (!bidToUpdate) return NextResponse.json({ message: 'Bid not found' }, { status: 404 });

    bidToUpdate.bidItems[itemIndex].currentBid = amount;
    bidToUpdate.bidItems[itemIndex].bidderId = bidderId;

    await bidToUpdate.save();
    return NextResponse.json(bidToUpdate, { status: 200 });
}

export async function DELETE(req, { params }) {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
