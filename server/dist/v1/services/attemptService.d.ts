import { SubmitAnswerData } from '../../types/types.js';
declare class AttemptService {
    static startAttempt(userId: number, testId: number, ipAddress?: string): Promise<{
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.AttemptStatus;
        percentScore: number | null;
        score: number;
        maxScore: number | null;
        startedAt: Date;
        expiresAt: Date | null;
        completedAt: Date | null;
        timeSpent: number | null;
        attemptNumber: number;
        ipAddress: string | null;
        testId: number;
    }>;
    static getRemainingTime(attemptId: number): Promise<number>;
    static getAttemptById(id: number): Promise<({
        user: {
            id: number;
            email: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        test: {
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
        };
        answers: ({
            option: {
                id: number;
                text: string;
                isCorrect: boolean;
                order: number;
                questionId: number;
            } | null;
            question: {
                id: number;
                testId: number;
                text: string;
                order: number;
                questionType: import(".prisma/client").$Enums.QuestionType;
                points: number;
            };
        } & {
            id: number;
            timeSpent: number | null;
            isCorrect: boolean;
            questionId: number;
            textAnswer: string | null;
            pointsEarned: number;
            attemptId: number;
            optionId: number | null;
        })[];
    } & {
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.AttemptStatus;
        percentScore: number | null;
        score: number;
        maxScore: number | null;
        startedAt: Date;
        expiresAt: Date | null;
        completedAt: Date | null;
        timeSpent: number | null;
        attemptNumber: number;
        ipAddress: string | null;
        testId: number;
    }) | null>;
    static submitAnswer(attemptId: number, answerData: SubmitAnswerData): Promise<{
        id: number;
        timeSpent: number | null;
        isCorrect: boolean;
        questionId: number;
        textAnswer: string | null;
        pointsEarned: number;
        attemptId: number;
        optionId: number | null;
    }>;
    static completeAttempt(attemptId: number): Promise<{
        attempt: {
            test: {
                title: string;
                duration: number;
            };
        } & {
            id: number;
            userId: number;
            status: import(".prisma/client").$Enums.AttemptStatus;
            percentScore: number | null;
            score: number;
            maxScore: number | null;
            startedAt: Date;
            expiresAt: Date | null;
            completedAt: Date | null;
            timeSpent: number | null;
            attemptNumber: number;
            ipAddress: string | null;
            testId: number;
        };
        summary: {
            totalQuestions: number;
            correctAnswers: number;
            incorrectAnswers: number;
            unansweredQuestions: number;
        };
    }>;
    static getUserAttempts(userId: number, testId?: number): Promise<({
        test: {
            title: string;
            duration: number;
        };
    } & {
        id: number;
        userId: number;
        status: import(".prisma/client").$Enums.AttemptStatus;
        percentScore: number | null;
        score: number;
        maxScore: number | null;
        startedAt: Date;
        expiresAt: Date | null;
        completedAt: Date | null;
        timeSpent: number | null;
        attemptNumber: number;
        ipAddress: string | null;
        testId: number;
    })[]>;
    static getAttemptAnalytics(testId?: number): Promise<{
        totalAttempts: number;
        completedAttempts: number;
        inProgressAttempts: number;
        timedOutAttempts: number;
        averageScore: number;
        averageTimeSpent: number;
        passRate: number;
    }>;
    static getTestPerformanceByUser(testId: number): Promise<{
        userId: any;
        userName: any;
        email: any;
        attemptNumber: any;
        score: any;
        percentScore: any;
        timeSpent: any;
        completedAt: any;
    }[]>;
    static getQuestionPerformance(testId: number): Promise<{
        questionId: any;
        text: any;
        questionType: any;
        totalAttempts: any;
        correctCount: any;
        accuracyRate: number;
        averagePointsEarned: number;
        maxPoints: any;
    }[]>;
    static getUserPerformanceHistory(userId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        passRate: number;
        attempts: {
            testTitle: any;
            score: any;
            percentScore: any;
            timeSpent: any;
            completedAt: any;
        }[];
    }>;
    static getScoreDistribution(testId: number): Promise<{
        range: string;
        count: number;
    }[]>;
}
export default AttemptService;
