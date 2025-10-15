import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
declare class WebSocketService {
    private io;
    init(server: Server): void;
    emitToAttempt(attemptId: number, event: string, data: any): void;
    emitToAdmins(event: string, data: any): void;
    emitToAll(event: string, data: any): void;
    getIO(): SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
}
declare const _default: WebSocketService;
export default _default;
