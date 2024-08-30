"use client"
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import CreateBid from '@/components/BidCreate';

export default function Home() {
  const [bids, setBids] = useState([]);
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [userrole, setUserrole] = useState(null);

  useEffect(() => {
    // Retrieve userId and userrole from localStorage
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const storedUserrole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    setUserId(storedUserId);
    setUserrole(storedUserrole);
  }, []);

  useEffect(() => {
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

    fetchBids();
  }, []);

  // useEffect(() => {
  //   fetch('/api/socket'); // Initialize socket server
  //   const newSocket = io();
  //   setSocket(newSocket);

  //   newSocket.on('bid:update', (updatedBid) => {
  //     setBids((prevBids) =>
  //       prevBids.map((bid) => (bid._id === updatedBid._id ? updatedBid : bid))
  //     );
  //   });

  //   return () => newSocket.disconnect();
  // }, []);

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
    <div className='rounded-md'>
      {/* Show CreateBid component only if user role is 'creator' */}



      {userrole === 'creator' && <CreateBid />}

      {/* list of bids */}
      <ul className="space-y-4 mt-4">
        {bids.map((bid) => (
          <li key={bid._id} className="border border-gray-300 p-4 rounded-md">
            <h2 className="text-2xl font-semibold">{bid.title}</h2>
            <p className="text-gray-600">End Time: {new Date(bid.endTime).toLocaleString()}</p>
            {bid.bidItems.map((item, index) => (
              <div key={index} className="border-t border-gray-200 pt-2 mt-2">
                <p>{item.description}</p>
                <button
                  onClick={() => placeBid(bid._id, index, item.currentBid + 10)}
                  className="mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                  Place Bid of ${item.currentBid + 10}
                </button>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
