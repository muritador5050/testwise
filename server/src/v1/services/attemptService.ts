import e from 'express';
import { PrismaClient } from '../../generated/prisma';
import { SubmitAnswerData } from '../../types/types';
import TestService from './testService';
const prisma = new PrismaClient();

class AttemptService {
  static async startAttempt(
    userId: number,
    testId: number,
    ipAddress?: string
  ) {
    // Check if test is available
    const availability = await TestService.isTestAvailable(testId);
    if (!availability.available) {
      throw new Error(availability.reason);
    }

    // Get current attempt count
    const attemptCount = await prisma.attempt.count({
      where: { userId, testId },
    });

    // Get test to check max attempts
    const test = await prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test) {
      throw new Error('Test not found');
    }

    if (attemptCount >= test.maxAttempts) {
      throw new Error('Maximum attempts reached');
    }

    // Check for existing in-progress attempt
    const existingAttempt = await prisma.attempt.findFirst({
      where: {
        userId,
        testId,
        status: 'IN_PROGRESS',
      },
    });

    if (existingAttempt) {
      return existingAttempt;
    }

    // Create new attempt
    return await prisma.attempt.create({
      data: {
        userId,
        testId,
        attemptNumber: attemptCount + 1,
        ipAddress,
        status: 'IN_PROGRESS',
      },
    });
  }

  static async getAttempt(id: number) {
    return await prisma.attempt.findUnique({
      where: { id },
      include: {
        test: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
        answers: {
          include: {
            question: true,
            option: true,
          },
        },
        user: true,
      },
    });
  }

  static async submitAnswer(attemptId: number, answerData: SubmitAnswerData) {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new Error('Attempt not found');
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new Error('Attempt is not in progress');
    }

    const question = attempt.test.questions.find(
      (q) => q.id === answerData.questionId
    );
    if (!question) {
      throw new Error('Question not found');
    }

    // Calculate if answer is correct and points earned
    let isCorrect = false;
    let pointsEarned = 0;

    if (
      question.questionType === 'MULTIPLE_CHOICE' ||
      question.questionType === 'TRUE_FALSE'
    ) {
      if (answerData.optionId) {
        const option = question.options.find(
          (o) => o.id === answerData.optionId
        );
        if (option && option.isCorrect) {
          isCorrect = true;
          pointsEarned = question.points;
        }
      }
    }
    // For SHORT_ANSWER and ESSAY, manual grading would be required

    return await prisma.answer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId: answerData.questionId,
        },
      },
      update: {
        textAnswer: answerData.textAnswer,
        optionId: answerData.optionId,
        isCorrect,
        pointsEarned,
      },
      create: {
        attemptId,
        questionId: answerData.questionId,
        textAnswer: answerData.textAnswer,
        optionId: answerData.optionId,
        isCorrect,
        pointsEarned,
      },
    });
  }

  static async completeAttempt(attemptId: number) {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: true,
        test: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new Error('Attempt not found');
    }

    // Calculate total score
    const score = attempt.answers.reduce(
      (total, answer) => total + answer.pointsEarned,
      0
    );
    const maxScore = attempt.test.questions.reduce(
      (total, question) => total + question.points,
      0
    );
    const percentScore = maxScore > 0 ? (score / maxScore) * 100 : 0;

    // Calculate time spent
    const timeSpent = Math.floor(
      (new Date().getTime() - attempt.startedAt.getTime()) / 1000
    );

    return await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score,
        maxScore,
        percentScore,
        timeSpent,
      },
    });
  }

  static async getUserAttempts(userId: number, testId?: number) {
    return await prisma.attempt.findMany({
      where: {
        userId,
        testId: testId ? testId : undefined,
      },
      include: {
        test: true,
      },
      orderBy: { startedAt: 'desc' },
    });
  }
}

export default AttemptService;
