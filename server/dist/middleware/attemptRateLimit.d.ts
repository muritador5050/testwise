import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './authenticate';
export declare const attemptRateLimit: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
