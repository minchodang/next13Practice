import { Server, Socket } from 'socket.io';
import { Request, Response } from 'express';

const SocketHandler = (req: Request, res: Response) => {
    if ((res.socket as any).server.io) {
        console.log('Socket is already attached');
        return res.end();
    }

    const io = new Server((res.socket as any).server);
    (res.socket as any).server.io = io;

    io.on('connection', (socket: Socket) => {
        console.log(`User Connected :${socket.id}`);

        socket.on('join', (roomName: string) => {
            const rooms = (io.sockets.adapter as any).rooms;
            const room = (rooms as any).get(roomName);

            if (room === undefined) {
                socket.join(roomName);
                socket.emit('created');
            } else if (room.size === 1) {
                socket.join(roomName);
                socket.emit('joined');
            } else {
                socket.emit('full');
            }
            console.log(rooms);
        });

        socket.on('ready', (roomName: string) => {
            socket.broadcast.to(roomName).emit('ready');
        });

        socket.on('ice-candidate', (candidate: any, roomName: string) => {
            console.log(candidate);
            socket.broadcast.to(roomName).emit('ice-candidate', candidate);
        });

        socket.on('offer', (offer: any, roomName: string) => {
            socket.broadcast.to(roomName).emit('offer', offer);
        });

        socket.on('answer', (answer: any, roomName: string) => {
            socket.broadcast.to(roomName).emit('answer', answer);
        });

        socket.on('leave', (roomName: string) => {
            socket.leave(roomName);
            socket.broadcast.to(roomName).emit('leave');
        });
    });
    return res.end();
};

export default SocketHandler;
