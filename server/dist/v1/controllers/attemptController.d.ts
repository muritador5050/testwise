import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
declare class AttemptController {
    static start(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getRemainingTime(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getLiveAttempts(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static submitAnswer(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static complete(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserAttempts(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getAnalytics(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getTestPerformance(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getQuestionAnalytics(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getUserPerformance(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getScoreDistribution(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export default AttemptController;
