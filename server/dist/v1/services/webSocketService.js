import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
class WebSocketService {
    io;
    init(server) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: process.env.FRONTEND_URL || '*',
                credentials: true,
            },
        });
        // Authentication middleware
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.data.user = decoded;
                next();
            }
            catch (err) {
                next(new Error('Authentication error'));
            }
        });
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.data.user.id} connected`);
            socket.on('join-attempt', (attemptId) => {
                // Verify user owns this attempt
                socket.join(`attempt-${attemptId}`);
                socket.emit('joined-attempt', { attemptId });
            });
            socket.on('disconnect', () => {
                console.log(`User ${socket.data.user.id} disconnected`);
            });
        });
    }
    emitToAttempt(attemptId, event, data) {
        this.io.to(`attempt-${attemptId}`).emit(event, data);
    }
    emitToAll(event, data) {
        this.io.emit(event, data);
    }
}
export default new WebSocketService();
//# sourceMappingURL=webSocketService.js.map