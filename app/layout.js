"use client"

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import './globals.css';
import Header from '@/components/Header';

export default function RootLayout({ children }) {
  // useEffect(() => {
  //   const socket = io();

  //   socket.on('connect', () => {
  //     console.log('Connected to WebSocket server');
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from WebSocket server');
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

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
