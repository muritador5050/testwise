declare class QuestionService {
    static createQuestion(testId: number, data: any): Promise<{
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
    }>;
    static getQuestionsByTest(testId: number): Promise<({
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
    })[]>;
    static updateQuestion(id: number, data: any): Promise<{
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
    }>;
    static getAllQuestions(): Promise<number>;
    static deleteQuestion(id: number): Promise<{
        id: number;
        testId: number;
        text: string;
        order: number;
        questionType: import(".prisma/client").$Enums.QuestionType;
        points: number;
    }>;
}
export default QuestionService;
