import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

class WebSocketService {
  private io!: SocketIOServer;

  init(server: Server) {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        socket.data.user = decoded;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User ${socket.data.user.id} connected`);

      // Admin room for live monitoring
      if (socket.data.user.role === 'ADMIN') {
        socket.join('admin-room');
        console.log(`Admin ${socket.data.user.id} joined monitoring room`);
      }

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

  emitToAttempt(attemptId: number, event: string, data: any) {
    this.io.to(`attempt-${attemptId}`).emit(event, data);
  }

  emitToAdmins(event: string, data: any) {
    this.io.to('admin-room').emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.io.emit(event, data);
  }

  getIO() {
    return this.io;
  }
}

export default new WebSocketService();
