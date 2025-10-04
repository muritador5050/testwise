import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate';
import QuestionService from '../services/questionService';

class QuestionController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { testId } = req.params;
      const questionData = req.body;

      if (!questionData.text || !questionData.questionType) {
        return res
          .status(400)
          .json({ error: 'Question text and type are required' });
      }

      const question = await QuestionService.createQuestion(
        parseInt(testId),
        questionData
      );

      res.status(201).json(question);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByTest(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      const questions = await QuestionService.getQuestionsByTest(
        parseInt(testId)
      );

      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const question = await QuestionService.updateQuestion(
        parseInt(id),
        updateData
      );

      res.json(question);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await QuestionService.deleteQuestion(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

export default QuestionController;
