import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class QuestionService {
    static async createQuestion(testId, data) {
        return await prisma.question.create({
            data: {
                text: data.text,
                questionType: data.questionType,
                points: data.points || 1.0,
                order: data.order,
                testId,
                options: data.options
                    ? {
                        create: data.options.map((o) => ({
                            text: o.text,
                            isCorrect: o.isCorrect || false,
                            order: o.order,
                        })),
                    }
                    : undefined,
            },
            include: { options: true },
        });
    }
    static async getQuestionsByTest(testId) {
        return await prisma.question.findMany({
            where: { testId },
            include: { options: true },
            orderBy: { order: 'asc' },
        });
    }
    static async updateQuestion(id, data) {
        const { options, ...questionData } = data;
        const updatePayload = { ...questionData };
        if (options && Array.isArray(options)) {
            const existingOptionIds = options.map((o) => o.id).filter(Boolean);
            updatePayload.options = {
                // Delete options that exist in the database but are NOT present in the incoming list
                deleteMany: {
                    questionId: id,
                    id: {
                        notIn: existingOptionIds,
                    },
                },
                upsert: options.map((o) => ({
                    where: { id: o.id || -1 },
                    create: {
                        text: o.text,
                        isCorrect: o.isCorrect || false,
                        order: o.order,
                    },
                    update: {
                        text: o.text,
                        isCorrect: o.isCorrect || false,
                        order: o.order,
                    },
                })),
            };
        }
        return await prisma.question.update({
            where: { id },
            data: updatePayload,
            include: { options: true },
        });
    }
    static async getAllQuestions() {
        return await prisma.question.count();
    }
    static async deleteQuestion(id) {
        return await prisma.question.delete({ where: { id } });
    }
}
export default QuestionService;
//# sourceMappingURL=questionService.js.map