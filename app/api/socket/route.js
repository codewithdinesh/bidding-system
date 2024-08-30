import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

let io;

export async function GET(req) {

    if (!io) {
        const { server } = req.socket;

        io = new Server(server);

        io.on('connection', (socket) => {
            console.log('Client connected', socket.id);

            socket.on('bid:update', (data) => {
                socket.broadcast.emit('bid:update', data);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected', socket.id);
            });
        });


        req.socket.server.io = io;
    }


    return NextResponse.json({ message: "Socket server initialized" });
}
