
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Bid from '@/lib/models/Bid';

export async function GET() {
  await connectDB();

  const bids = await Bid.find().populate('creatorId invitedBidders acceptedBidders');
  return NextResponse.json(bids, { status: 200 });
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const newBid = await Bid.create(body);

  // show erorr if newBid is not created
  if (!newBid) {
    return NextResponse.error(new Error('Failed to create new bid'), { status: 400 });
  }
  return NextResponse.json(newBid, { status: 201 });
}
