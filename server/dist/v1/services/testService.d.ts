import { CreateTestData } from '../../types/types.js';
declare class TestService {
    static createTest(data: CreateTestData): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: number;
        maxAttempts: number;
        isPublished: boolean;
        availableFrom: Date | null;
        availableUntil: Date | null;
    }>;
    static getTestById(id: number, includeAnswers?: boolean): Promise<({
        _count: {
            attempts: number;
        };
        questions: ({
            options: {
                id: number;
                text: string;
                isCorrect: boolean;
                order: number;
                questionId: number;
            }[];
        } & {
            id: number;
            testId: number;
            text: string;
            order: number;
            questionType: import(".prisma/client").$Enums.QuestionType;
            points: number;
        })[];
    } & {
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: number;
        maxAttempts: number;
        isPublished: boolean;
        availableFrom: Date | null;
        availableUntil: Date | null;
    }) | null>;
    static getAllTests(isPublished?: boolean, page?: number, limit?: number): Promise<{
        tests: ({
            _count: {
                attempts: number;
                questions: number;
            };
        } & {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            duration: number;
            maxAttempts: number;
            isPublished: boolean;
            availableFrom: Date | null;
            availableUntil: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static updateTest(id: number, data: Partial<CreateTestData>): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: number;
        maxAttempts: number;
        isPublished: boolean;
        availableFrom: Date | null;
        availableUntil: Date | null;
    }>;
    static publishTest(id: number): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: number;
        maxAttempts: number;
        isPublished: boolean;
        availableFrom: Date | null;
        availableUntil: Date | null;
    }>;
    static deleteTest(id: number): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        duration: number;
        maxAttempts: number;
        isPublished: boolean;
        availableFrom: Date | null;
        availableUntil: Date | null;
    }>;
    static isTestAvailable(testId: number): Promise<{
        available: boolean;
        reason?: string;
    }>;
    static getAllTestsStatistics(): Promise<{
        testId: number;
        title: string;
        totalAttempts: number;
        totalQuestions: number;
        totalPoints: number;
        averageScore: number;
        averageTimeSpent: number;
        highestScore: number;
        lowestScore: number;
    }[]>;
}
export default TestService;
