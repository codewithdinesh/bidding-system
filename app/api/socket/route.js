import { Server } from 'socket.io';
import connectDB from '@/lib/connectDB';
import Bid from '@/lib/models/Bid';

let io;

export const config = {
    api: {
        bodyParser: false,
    },
};

const declareWinner = async (bid) => {
    if (bid.bidItems.length > 0) {
        const winningItem = bid.bidItems.reduce((max, item) => (item.currentBid > max.currentBid ? item : max), bid.bidItems[0]);
        const winner = winningItem.bidderId;

        bid.winnerDeclared = true; // Mark the bid as completed
        await bid.save();

        io.emit('bid:winnerDeclared', { bidId: bid._id, winner });

        console.log(`Winner declared for bid ${bid._id}: User ${winner}`);
    } else {
        console.log(`No items in bid ${bid._id}`);
    }
};

const scheduleBidTimers = async () => {
    await connectDB();
    const currentTime = new Date();
    const bids = await Bid.find({ endTime: { $gt: currentTime }, winnerDeclared: { $ne: true } });

    if (bids.length === 0) {
        console.log('No active bids to schedule.');
        return;
    }

    bids.forEach(bid => {
        const timeUntilEnd = new Date(bid.endTime) - currentTime;

        if (timeUntilEnd > 0) {
            setTimeout(async () => {
                try {
                    await declareWinner(bid);
                } catch (error) {
                    console.error(`Error declaring winner for bid ${bid._id}:`, error);
                }
            }, timeUntilEnd);
        } else {
            console.log(`Bid ${bid._id} has already ended.`);
        }
    });
};

export default async function handler(req, res) {
    if (!io) {
        if (res.socket && res.socket.server) {
            io = new Server(res.socket.server, {
                path: '/api/socket',
                cors: {
                    origin: "*", // Update this to your production domain
                },
            });

            console.log('Socket.io server initialized');

            io.on('connection', (socket) => {
                console.log('A user connected');

                socket.on('disconnect', () => {
                    console.log('A user disconnected');
                });
            });

            // Schedule the timers for bids
            await scheduleBidTimers();
        } else {
            console.error('Socket server could not be initialized. Missing res.socket.server.');
        }
    }
    res.status(200).json({ message: 'Socket server running' });
}
