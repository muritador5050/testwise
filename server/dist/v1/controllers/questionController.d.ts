import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate';
declare class QuestionController {
    static create(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getByTest(req: Request, res: Response): Promise<void>;
    static update(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAll(req: Request, res: Response): Promise<void>;
    static delete(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export default QuestionController;
