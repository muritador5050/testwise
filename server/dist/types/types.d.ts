export interface CreateTestData {
    title: string;
    description?: string;
    duration: number;
    maxAttempts?: number;
    availableFrom?: Date;
    availableUntil?: Date;
    questions: CreateQuestionData[];
}
export interface CreateQuestionData {
    text: string;
    questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
    points?: number;
    order: number;
    options?: CreateOptionData[];
}
export interface CreateOptionData {
    text: string;
    isCorrect?: boolean;
    order: number;
}
export interface SubmitAnswerData {
    questionId: number;
    textAnswer?: string;
    optionId?: number;
}
