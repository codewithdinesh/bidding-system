"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BidPage({ params }) {
    const [bid, setBid] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = params; // Get the bid ID from the URL
    const router = useRouter();

    useEffect(() => {
        const fetchBid = async () => {
            try {
                const response = await fetch(`/api/bids/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBid(data);
                } else {
                    console.error('Failed to fetch bid');
                    router.push('/'); // Redirect to home if bid not found
                }
            } catch (error) {
                console.error('Error fetching bid:', error);
                router.push('/'); // Redirect to home in case of an error
            } finally {
                setLoading(false);
            }
        };

        fetchBid();
    }, [id, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!bid) {
        return <div>Bid not found</div>;
    }

    return (
        <div className="p-4 border border-gray-300 rounded-md">
            <h1 className="text-3xl font-bold mb-4">{bid.title}</h1>
            <p className="text-gray-700 mb-4">End Time: {new Date(bid.endTime).toLocaleString()}</p>
            <ul className="space-y-4">
                {bid.bidItems.map((item, index) => (
                    <li key={index} className="border border-gray-200 p-4 rounded-md">
                        <p className="font-semibold">{item.description}</p>
                        <p>Current Bid: ${item.currentBid}</p>
                        <p>End Time: {new Date(item.endTime).toLocaleString()}</p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Place Bid</button>

                    </li>
                ))}
            </ul>
        </div>
    );
}

