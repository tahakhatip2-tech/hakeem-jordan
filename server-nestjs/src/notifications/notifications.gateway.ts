import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    // Store connected clients: userId -> Set<SocketId>
    private userSockets = new Map<number, Set<string>>();

    handleConnection(client: Socket) {
        try {
            // In a real app, verify token here.
            // For now, we assume the client sends userId in the query params: ?userId=1
            const userIdStr = client.handshake.query.userId;

            if (userIdStr) {
                const userId = Number(userIdStr);
                if (!isNaN(userId)) {
                    this.addUserSocket(userId, client.id);
                    console.log(`Socket connected: ${client.id} for User: ${userId}`);
                }
            }
        } catch (e) {
            console.error('Socket connection error:', e);
        }
    }

    handleDisconnect(client: Socket) {
        this.removeSocket(client.id);
        console.log(`Socket disconnected: ${client.id}`);
    }

    private addUserSocket(userId: number, socketId: string) {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        const userSocketSet = this.userSockets.get(userId);
        if (userSocketSet) {
            userSocketSet.add(socketId);
        }
    }

    private removeSocket(socketId: string) {
        for (const [userId, sockets] of this.userSockets.entries()) {
            if (sockets.has(socketId)) {
                sockets.delete(socketId);
                if (sockets.size === 0) {
                    this.userSockets.delete(userId);
                }
                break;
            }
        }
    }

    // Public method to send notification
    sendNotificationToUser(userId: number, notification: any) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            // Emit to all sockets of this user (mobile, desktop, etc.)
            sockets.forEach(socketId => {
                this.server.to(socketId).emit('notification', notification);
            });
            console.log(`Sent real-time notification to User ${userId} (${sockets.size} devices)`);
        } else {
            console.log(`User ${userId} is not connected to socket. Notification saved to DB only.`);
        }
    }
}
