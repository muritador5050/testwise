import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class TestService {
    static async createTest(data) {
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
    static async getTestById(id, includeAnswers = false) {
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
    static async getAllTests(isPublished, page = 1, limit = 10) {
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
    static async updateTest(id, data) {
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
    static async publishTest(id) {
        const currentTest = await prisma.test.findUnique({
            where: { id },
        });
        if (!currentTest) {
            throw new Error('Test not found');
        }
        return await prisma.test.update({
            where: { id },
            data: { isPublished: !currentTest.isPublished },
        });
    }
    static async deleteTest(id) {
        return await prisma.test.delete({
            where: { id },
        });
    }
    static async isTestAvailable(testId) {
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
    static async getAllTestsStatistics() {
        const tests = await prisma.test.findMany({
            where: { isPublished: true },
            include: {
                _count: { select: { attempts: true, questions: true } },
            },
        });
        // Get attempt stats grouped by testId
        const attemptStats = await prisma.attempt.groupBy({
            by: ['testId'],
            where: { status: 'COMPLETED' },
            _avg: { percentScore: true, timeSpent: true },
            _max: { percentScore: true },
            _min: { percentScore: true },
        });
        // Get question points grouped by testId
        const questionStats = await prisma.question.groupBy({
            by: ['testId'],
            _sum: { points: true },
        });
        // Create lookup maps for faster access
        const attemptStatsMap = new Map(attemptStats.map((stat) => [stat.testId, stat]));
        const questionStatsMap = new Map(questionStats.map((stat) => [stat.testId, stat]));
        // Combine all data
        return tests.map((test) => {
            const attempts = attemptStatsMap.get(test.id);
            const questions = questionStatsMap.get(test.id);
            return {
                testId: test.id,
                title: test.title,
                totalAttempts: test._count.attempts || 0,
                totalQuestions: test._count.questions || 0,
                totalPoints: questions && questions._sum ? questions._sum.points || 0 : 0,
                averageScore: attempts?._avg.percentScore || 0,
                averageTimeSpent: attempts?._avg.timeSpent || 0,
                highestScore: attempts?._max.percentScore || 0,
                lowestScore: attempts?._min.percentScore || 0,
            };
        });
    }
}
export default TestService;
//# sourceMappingURL=testService.js.map