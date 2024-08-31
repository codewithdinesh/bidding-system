"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaGavel, FaClock, FaDollarSign } from 'react-icons/fa';

const Bid = ({ bid }) => {
    const [userId, setUserId] = useState(null);
    const [bidAmounts, setBidAmounts] = useState({});
    const [bidCreator, setBidCreator] = useState(null);
    const [isBidEnded, setIsBidEnded] = useState(false);
    const [winner, setWinner] = useState(null);
    const [winnerUsername, setWinnerUsername] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        setUserId(storedUserId);

        const currentTime = new Date();
        const bidEndTime = new Date(bid.endTime);

        // Check if the bid has ended
        if (currentTime > bidEndTime) {
            setIsBidEnded(true);

            // Display winner if available
            if (bid.winnerDeclared) {
                const winningItem = bid.bidItems.reduce((max, item) => (item.currentBid > max.currentBid ? item : max), bid.bidItems[0]);
                setWinner(winningItem.bidderId);
                fetchWinnerUsername(winningItem.bidderId);
            }
        }

        fetchUsername(bid?.creatorId);
    }, [bid]);

    const handleInputChange = (index, value) => {
        setBidAmounts(prev => ({ ...prev, [index]: value }));
    };

    const placeBid = async (bidId, itemIndex, amount) => {
        if (!userId) return alert('Please register first.');

        try {
            const response = await fetch(`/api/bids/${bidId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemIndex, amount, bidderId: userId }),
            });

            if (response.ok) {
                const updatedBid = await response.json();
                console.log('Bid placed:', updatedBid);
                alert('Bid placed successfully');
                setBidAmounts(prev => ({ ...prev, [itemIndex]: '' }));
                router.reload();
            } else {
                console.error('Failed to place bid');
                alert('Failed to place bid');
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Error placing bid');
        }
    };

    const fetchUsername = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const user = await response.json();
                setBidCreator(user.username);
            } else {
                console.error('Failed to fetch username');
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    const fetchWinnerUsername = async (winnerId) => {
        try {
            const response = await fetch(`/api/users/${winnerId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const user = await response.json();
                setWinnerUsername(user.username);
            } else {
                console.error('Failed to fetch winner username');
            }
        } catch (error) {
            console.error('Error fetching winner username:', error);
        }
    };

    return (
        <li key={bid._id} className="border border-gray-300 p-6 rounded-md shadow-lg bg-white">
            <div className="flex items-center mb-4">
                <FaGavel className="text-blue-500 mr-2" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">{bid.title}</h2>
            </div>
            <p className="text-gray-700 mb-4">{bid.description}</p>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                    <FaUser className="mr-2" />
                    <span>Posted by: {bidCreator || 'Unknown'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    <span>End Time: {new Date(bid.endTime).toLocaleString()}</span>
                </div>
            </div>

            {isBidEnded ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-xl font-semibold">Bid Ended</h3>
                    {winner ? (
                        <p className="text-green-600">Winner: {winnerUsername ? `User ${winnerUsername}` : 'Fetching winner...'}</p>
                    ) : (
                        <p className="text-red-600">No winner declared</p>
                    )}
                </div>
            ) : (
                bid.bidItems.map((item, index) => (
                    <div key={index} className="border-t border-gray-200 pt-4 mt-4">
                        <p className="mb-2">{item.description}</p>
                        <p className="mb-2 flex items-center">
                            <FaDollarSign className="mr-2" />
                            Current Bid: ${item.currentBid}
                        </p>
                        <div className="flex items-center">
                            <input
                                type="number"
                                min={item.currentBid + 1}
                                value={bidAmounts[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                className="p-2 border rounded-md mr-2"
                                placeholder={`Your bid (min: ${item.currentBid + 1})`}
                            />
                            <button
                                onClick={() => placeBid(bid._id, index, parseFloat(bidAmounts[index] || 0))}
                                className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 flex items-center"
                                disabled={!bidAmounts[index] || bidAmounts[index] <= item.currentBid}
                            >
                                <FaGavel className="mr-2" />
                                Place Bid
                            </button>
                        </div>
                    </div>
                ))
            )}
        </li>
    );
};

export default Bid;
