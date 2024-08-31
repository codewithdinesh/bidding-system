"use client"

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import CreateBid from '@/components/BidCreate';
import Link from 'next/link';
import Bid from '@/components/Bid';

export default function Home() {
  const [bids, setBids] = useState([]);
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [userrole, setUserrole] = useState(null);

  useEffect(() => {
    // Retrieve userId and userrole from localStorage 
    const storedUserrole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    setUserrole(storedUserrole);

    if (!storedUserId) {
      router.push('/register');
    }

    if (storedUserrole === 'creator' && storedUserId) {
      console.log('User is creator');
      console.log(storedUserId);
      fetchCreatorBids(storedUserId);
    } else {
      fetchBids();
    }
  }, []);

  const fetchBids = async () => {
    try {
      const response = await fetch('/api/bids');
      if (response.ok) {
        const data = await response.json();
        setBids(data);
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
        setBids(data);
      } else {
        console.error('Failed to fetch bids');
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
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

  const handleCreateClick = () => router.push('/create-bid');
  const handleBidClick = () => router.push('/place-bid');

  return (
    <div className='rounded-md block  md:flex'>
      {/* Show CreateBid component only if user role is 'creator' */}
      {userrole === 'creator' && <CreateBid />}

      {userrole === 'creator' ? (
        <ul className="flex-1 ml-4">
          <div className='flex justify-between '>
            <h1 className="text-2xl font-semibold m-2">
              Your Bids
            </h1>
            <button className=" m-2 p-2  bg-red-500 text-white hover:bg-red-600 rounded-full shadow-2xl">
              <Link href={"#/"}>
                Experied Bids
              </Link>
            </button>
          </div>
          {bids.map((bid) => (
            <Bid key={bid._id} bid={bid} />
          ))}
        </ul>
      ) : (
        <ul className=" flex-1 ml-4">
          <div className='flex justify-between '>
            <h1 className="text-2xl font-semibold m-2">
              All Bids Listed
            </h1>
            <button className=" m-2 p-2  bg-red-500 text-white hover:bg-red-600 rounded-full shadow-2xl">
              <Link href={"#/"}>
                Experied Bids
              </Link>
            </button>
          </div>
          {bids.map((bid) => (
            <Bid key={bid._id} bid={bid} />
          ))}
        </ul>
      )}
    </div>
  );
}
