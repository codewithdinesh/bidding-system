"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUser, FaGavel, FaClock, FaDollarSign } from 'react-icons/fa'; // Import icons

const Bid = ({ bid }) => {
    const [socket, setSocket] = useState(null);
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [userrole, setUserrole] = useState(null);
    const [bidAmounts, setBidAmounts] = useState({}); // State to hold bid amounts for each item

    useEffect(() => {
        const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        setUserId(storedUserId);
    }, []);

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
                socket.emit('bid:update', updatedBid);
            } else {
                console.error('Failed to place bid');
            }
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    return (
        <li key={bid._id} className="border border-gray-300 p-6 rounded-md shadow-lg bg-white">
            <div className="flex items-center mb-4">
                <FaGavel className="text-blue-500 mr-2" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">{bid.title}</h2>
            </div>
            <p className="text-gray-700 mb-4">{bid.description}</p>
            <div className="flex items-center text-gray-600 mb-4">
                <FaUser className="mr-2" />
                <span>Posted by: {bid.creatorId?.username || 'Unknown'}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
                <FaClock className="mr-2" />
                <span>End Time: {new Date(bid.endTime).toLocaleString()}</span>
            </div>
            {bid.bidItems.map((item, index) => (

                <Link href={`/bids/${bid._id}`} key={bid._id}>
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
                </Link>
            ))}
        </li>
    );
};

export default Bid;
