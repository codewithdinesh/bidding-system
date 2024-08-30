"use client"


import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBid() {
    const [title, setTitle] = useState('');
    const router = useRouter();
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    const handleCreateBid = async () => {
        if (!userId) return alert('Please register first.');

        const response = await fetch('/api/bids', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                bidItems: [{ description: 'Item 1' }],
                creatorId: userId,
                startTime: new Date(),
                endTime: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes later
            }),
        });
        const newBid = await response.json();
        router.push('/'); // Redirect to home page
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Bid</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bid Title"
                className="border border-gray-300 p-2 rounded-md w-full max-w-md mb-4"
            />
            <button
                onClick={handleCreateBid}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Create Bid
            </button>
        </div>
    );
}
