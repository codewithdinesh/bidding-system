import mongoose from 'mongoose';
import User from './User';

const bidItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    currentBid: { type: Number, required: true, default: 0 },
    bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { _id: false });

const bidSchema = new mongoose.Schema({
    title: { type: String, required: true },
    bidItems: [bidItemSchema],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    invitedBidders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    acceptedBidders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


bidSchema.index({ startTime: 1 });
bidSchema.index({ endTime: 1 });

export default mongoose.models.Bid || mongoose.model('Bid', bidSchema);
