"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateBid from '@/components/BidCreate';
import Bid from '@/components/Bid';

export default function Home() {
  const [ongoingBids, setOngoingBids] = useState([]);
  const [expiredBids, setExpiredBids] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve userId and userRole from localStorage 
    const storedUserRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    setUserRole(storedUserRole);

    if (!storedUserId) {
      router.push('/auth/login');
    } else if (storedUserRole === 'creator') {
      fetchCreatorBids(storedUserId);
    } else {
      fetchBids();
      // Set up interval to refresh ongoing bids every second
      const intervalId = setInterval(() => {
        fetchBids();
      }, 100);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [router]);

  const fetchBids = async () => {
    try {
      const response = await fetch('/api/bids');
      if (response.ok) {
        const data = await response.json();
        const currentTime = new Date();
        const ongoing = data.filter(bid => new Date(bid.endTime) > currentTime);
        const expired = data.filter(bid => new Date(bid.endTime) <= currentTime);
        setOngoingBids(ongoing);
        setExpiredBids(expired);
      } else {
        console.error('Failed to fetch bids');
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const fetchCreatorBids = async (userID) => {
    try {
      const response = await fetch(`/api/bids/user/${userID}`);
      if (response.ok) {
        const data = await response.json();
        const currentTime = new Date();
        const ongoing = data.filter(bid => new Date(bid.endTime) > currentTime);
        const expired = data.filter(bid => new Date(bid.endTime) <= currentTime);
        setOngoingBids(ongoing);
        setExpiredBids(expired);
      } else {
        console.error('Failed to fetch bids');
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  return (
    <div className='rounded-md block md:flex'>
      {/* Show CreateBid component only if user role is 'creator' */}
      {userRole === 'creator' && <CreateBid />}

      <div className="flex-1 ml-4">
        <div className='flex justify-between'>
          <h1 className="text-2xl font-semibold my-2">All Bids Listed</h1>
        </div>
        <h2 className="text-xl font-semibold mb-4">Ongoing Bids</h2>
        {ongoingBids.length > 0 ? (
          ongoingBids.map((bid) => (
            <Bid key={bid._id} bid={bid} />
          ))
        ) : (
          <p>No ongoing bids available.</p>
        )}
        <h2 className="text-xl font-semibold mt-8 mb-4">Expired Bids</h2>
        {expiredBids.length > 0 ? (
          expiredBids.map((bid) => (
            <Bid key={bid._id} bid={bid} />
          ))
        ) : (
          <p>No expired bids available.</p>
        )}
      </div>
    </div>
  );
}
