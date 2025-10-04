import { PrismaClient } from '../../generated/prisma';
import { CreateTestData } from '../../types/types';
const prisma = new PrismaClient();

class TestService {
  static async createTest(data: CreateTestData) {
    return await prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        maxAttempts: data.maxAttempts || 1,
        availableFrom: data.availableFrom,
        availableUntil: data.availableUntil,
      },
    });
  }

  static async getTestById(id: number, includeAnswers = false) {
    return await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: !includeAnswers
              ? {
                  select: {
                    id: true,
                    text: true,
                    order: true,
                  },
                }
              : true,
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { attempts: true },
        },
      },
    });
  }

  static async getAllTests(isPublished?: boolean, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = isPublished !== undefined ? { isPublished } : {};

    const [tests, total] = await Promise.all([
      prisma.test.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { questions: true, attempts: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.test.count({ where }),
    ]);

    return {
      tests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateTest(id: number, data: Partial<CreateTestData>) {
    return await prisma.test.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        maxAttempts: data.maxAttempts,
        availableFrom: data.availableFrom,
        availableUntil: data.availableUntil,
      },
    });
  }

  static async publishTest(id: number, isPublished: boolean) {
    return await prisma.test.update({
      where: { id },
      data: { isPublished: !isPublished },
    });
  }

  static async deleteTest(id: number) {
    return await prisma.test.delete({
      where: { id },
    });
  }

  static async isTestAvailable(
    testId: number
  ): Promise<{ available: boolean; reason?: string }> {
    const test = await prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test) {
      return { available: false, reason: 'Test not found' };
    }

    if (!test.isPublished) {
      return { available: false, reason: 'Test not published' };
    }

    const now = new Date();

    if (test.availableFrom && now < test.availableFrom) {
      return { available: false, reason: 'Test not yet available' };
    }

    if (test.availableUntil && now > test.availableUntil) {
      return { available: false, reason: 'Test no longer available' };
    }

    return { available: true };
  }

  static async getTestStatistics(testId: number) {
    const [test, attemptStats, questionCount] = await Promise.all([
      prisma.test.findUnique({
        where: { id: testId },
        include: { _count: { select: { attempts: true, questions: true } } },
      }),
      prisma.attempt.aggregate({
        where: { testId, status: 'COMPLETED' },
        _avg: { percentScore: true, timeSpent: true },
        _max: { percentScore: true },
        _min: { percentScore: true },
      }),
      prisma.question.aggregate({
        where: { testId },
        _sum: { points: true },
      }),
    ]);

    return {
      testId,
      title: test?.title,
      totalAttempts: test?._count.attempts || 0,
      totalQuestions: test?._count.questions || 0,
      totalPoints: questionCount._sum.points || 0,
      averageScore: attemptStats._avg.percentScore || 0,
      averageTimeSpent: attemptStats._avg.timeSpent || 0,
      highestScore: attemptStats._max.percentScore || 0,
      lowestScore: attemptStats._min.percentScore || 0,
    };
  }

  static async getPopularTests(limit: number = 10) {
    const tests = await prisma.test.findMany({
      where: { isPublished: true },
      include: {
        _count: { select: { attempts: true } },
      },
      orderBy: { attempts: { _count: 'desc' } },
      take: limit,
    });

    return tests.map((test) => ({
      id: test.id,
      title: test.title,
      attemptCount: test._count.attempts,
    }));
  }
}

export default TestService;
