import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate';
import { CreateTestData } from '../../types/types';
import TestService from '../services/testService';

class TestController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const testData: CreateTestData = req.body;

      if (!testData.title || !testData.duration) {
        return res
          .status(400)
          .json({ error: 'Title and duration are required' });
      }

      const test = await TestService.createTest(testData);
      res.status(201).json(test);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const includeAnswers = req.query.includeAnswers === 'true';
      const test = await TestService.getTestById(parseInt(id), includeAnswers);

      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }

      res.json(test);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const isPublished = req.query.published
        ? req.query.published === 'true'
        : undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await TestService.getAllTests(isPublished, page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const test = await TestService.updateTest(parseInt(id), updateData);
      res.json(test);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Test not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async publish(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      const test = await TestService.publishTest(parseInt(id), isPublished);
      res.json(test);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Test not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async checkAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const availability = await TestService.isTestAvailable(parseInt(id));
      if (!availability.available) {
        return res.status(400).json({ error: availability.reason });
      }
      res.json({ available: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await TestService.deleteTest(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Test not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getStatistics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stats = await TestService.getTestStatistics(parseInt(id));
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPopular(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const popular = await TestService.getPopularTests(limit);
      res.json(popular);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default TestController;
