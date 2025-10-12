import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
declare class TestController {
    static create(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAll(req: Request, res: Response): Promise<void>;
    static update(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static publish(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static checkAvailability(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getStatistics(req: Request, res: Response): Promise<void>;
}
export default TestController;
