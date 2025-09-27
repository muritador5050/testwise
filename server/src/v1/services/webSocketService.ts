import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';

class WebSocketService {
  private io!: SocketIOServer;

  init(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: { origin: '*' },
    });

    this.io.on('connection', (socket) => {
      socket.on('join-attempt', (attemptId) => {
        socket.join(`attempt-${attemptId}`);
      });
    });
  }

  emitToAttempt(attemptId: number, event: string, data: any) {
    this.io.to(`attempt-${attemptId}`).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.io.emit(event, data);
  }
}

export default new WebSocketService();
