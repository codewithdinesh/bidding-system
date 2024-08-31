"use client"

import Bid from '@/components/Bid';
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
        <Bid bid={bid} />
    );
}

