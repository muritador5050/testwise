import { PrismaClient } from '../../generated/prisma';
import { SubmitAnswerData } from '../../types/types.js';
import TestService from './testService.js';
import webSocketService from './webSocketService.js';

// Initialize Prisma Client
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

    webSocketService.emitToAttempt(
      existingAttempt || attemptCount + 1,
      'attempt_started',
      {
        userId,
        testId,
        attemptNumber: attemptCount + 1,
      }
    );
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

  static async getAttemptById(id: number) {
    return await prisma.attempt.findUnique({
      where: { id },
      include: {
        user: true,
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

    const answer = await prisma.answer.upsert({
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

    webSocketService.emitToAttempt(attemptId, 'answer_submitted', {
      questionId: answerData.questionId,
      isCorrect,
      pointsEarned,
    });

    return answer;
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
    const timeSpentRaw = Math.floor(
      (new Date().getTime() - attempt.startedAt.getTime()) / 1000
    );
    const timeSpent = Math.min(timeSpentRaw, attempt.test.duration * 60);

    const totalQuestions = attempt.test.questions.length;
    const correctAnswers = attempt.answers.filter(
      (answer) => answer.isCorrect
    ).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const unansweredQuestions = totalQuestions - attempt.answers.length;

    const newAttempt = await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score,
        maxScore,
        percentScore,
        timeSpent,
      },
      include: {
        test: {
          select: { title: true, duration: true },
        },
      },
    });

    webSocketService.emitToAttempt(attemptId, 'attempt_completed', {
      score,
      percentScore,
      timeSpent,
    });

    return {
      attempt: newAttempt,
      summary: {
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions,
      },
    };
  }

  static async getUserAttempts(userId: number, testId?: number) {
    return await prisma.attempt.findMany({
      where: {
        userId,
        testId: testId ? testId : undefined,
      },
      include: {
        test: {
          select: { title: true, duration: true },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  static async getAttemptAnalytics(testId?: number) {
    const [
      totalAttempts,
      completedAttempts,
      inProgressAttempts,
      timedOutAttempts,
      averageScore,
      averageTimeSpent,
      passRate,
    ] = await Promise.all([
      prisma.attempt.count(),
      prisma.attempt.count({ where: { status: 'COMPLETED' } }),
      prisma.attempt.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.attempt.count({ where: { status: 'TIMED_OUT' } }),
      prisma.attempt.aggregate({
        where: { status: 'COMPLETED' },
        _avg: { percentScore: true },
      }),
      prisma.attempt.aggregate({
        where: { status: 'COMPLETED' },
        _avg: { timeSpent: true },
      }),
      prisma.attempt.count({
        where: { status: 'COMPLETED', percentScore: { gte: 50 } },
      }),
    ]);

    return {
      totalAttempts,
      completedAttempts,
      inProgressAttempts,
      timedOutAttempts,
      averageScore: averageScore._avg.percentScore || 0,
      averageTimeSpent: averageTimeSpent._avg.timeSpent || 0,
      passRate:
        completedAttempts > 0 ? (passRate / completedAttempts) * 100 : 0,
    };
  }

  static async getTestPerformanceByUser(testId: number) {
    const attempts = await prisma.attempt.findMany({
      where: { testId, status: 'COMPLETED' },
      include: { user: true },
      orderBy: { percentScore: 'desc' },
    });

    return attempts.map((attempt) => ({
      userId: attempt.userId,
      userName: attempt.user.name,
      email: attempt.user.email,
      attemptNumber: attempt.attemptNumber,
      score: attempt.score,
      percentScore: attempt.percentScore,
      timeSpent: attempt.timeSpent,
      completedAt: attempt.completedAt,
    }));
  }

  static async getQuestionPerformance(testId: number) {
    const questions = await prisma.question.findMany({
      where: { testId },
      include: {
        answers: {
          where: {
            attempt: { status: 'COMPLETED' },
          },
        },
      },
    });

    return questions.map((question) => {
      const totalAnswers = question.answers.length;
      const correctAnswers = question.answers.filter((a) => a.isCorrect).length;
      const avgPointsEarned =
        totalAnswers > 0
          ? question.answers.reduce((sum, a) => sum + a.pointsEarned, 0) /
            totalAnswers
          : 0;

      return {
        questionId: question.id,
        text: question.text,
        questionType: question.questionType,
        totalAttempts: totalAnswers,
        correctCount: correctAnswers,
        accuracyRate:
          totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0,
        averagePointsEarned: avgPointsEarned,
        maxPoints: question.points,
      };
    });
  }

  static async getUserPerformanceHistory(userId: number) {
    const attempts = await prisma.attempt.findMany({
      where: { userId, status: 'COMPLETED' },
      include: { test: { select: { title: true } } },
      orderBy: { completedAt: 'desc' },
    });

    const totalAttempts = attempts.length;
    const avgScore =
      totalAttempts > 0
        ? attempts.reduce((sum, a) => sum + (a.percentScore || 0), 0) /
          totalAttempts
        : 0;

    const passed = attempts.filter((a) => (a.percentScore || 0) >= 50).length;

    return {
      totalAttempts,
      averageScore: avgScore,
      passRate: totalAttempts > 0 ? (passed / totalAttempts) * 100 : 0,
      attempts: attempts.map((a) => ({
        testTitle: a.test.title,
        score: a.score,
        percentScore: a.percentScore,
        timeSpent: a.timeSpent,
        completedAt: a.completedAt,
      })),
    };
  }

  static async getScoreDistribution(testId: number) {
    const attempts = await prisma.attempt.findMany({
      where: { testId, status: 'COMPLETED' },
      select: { percentScore: true },
    });

    const ranges = [
      { label: '0-20%', min: 0, max: 20 },
      { label: '21-40%', min: 21, max: 40 },
      { label: '41-60%', min: 41, max: 60 },
      { label: '61-80%', min: 61, max: 80 },
      { label: '81-100%', min: 81, max: 100 },
    ];

    const distribution = ranges.map((range) => ({
      range: range.label,
      count: attempts.filter(
        (a) =>
          (a.percentScore || 0) >= range.min &&
          (a.percentScore || 0) <= range.max
      ).length,
    }));

    return distribution;
  }
}

export default AttemptService;
