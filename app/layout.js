"use client"

import { useEffect } from 'react';
import './globals.css';
import Header from '@/components/Header';

export default function RootLayout({ children }) {


  // const socket = io();
  // socket.on('connect', () => {
  //   console.log('Connected to socket server');
  // });

  // socket.on('bid:winnerDeclared', ({ bidId, winner }) => {
  //   alert(`Bid ${bidId} has ended! Winner: User ${winner}`);
  // });

  // return () => socket.disconnect();


  return (
    <html lang="en">
      <body>


        <div className=' container mx-auto px-4 py-4 flex-col'>

          <Header />

          {children}
        </div>

      </body>
    </html>
  );
}
