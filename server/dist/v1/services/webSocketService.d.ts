import { Server } from 'http';
declare class WebSocketService {
    private io;
    init(server: Server): void;
    emitToAttempt(attemptId: number, event: string, data: any): void;
    emitToAll(event: string, data: any): void;
}
declare const _default: WebSocketService;
export default _default;
