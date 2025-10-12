import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class QuestionService {
  static async createQuestion(testId: number, data: any) {
    return await prisma.question.create({
      data: {
        text: data.text,
        questionType: data.questionType,
        points: data.points || 1.0,
        order: data.order,
        testId,
        options: data.options
          ? {
              create: data.options.map((o: any) => ({
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

  static async getQuestionsByTest(testId: number) {
    return await prisma.question.findMany({
      where: { testId },
      include: { options: true },
      orderBy: { order: 'asc' },
    });
  }

  static async updateQuestion(id: number, data: any) {
    const { options, ...questionData } = data;

    const updatePayload: any = { ...questionData };

    if (options && Array.isArray(options)) {
      const existingOptionIds = options.map((o: any) => o.id).filter(Boolean);

      updatePayload.options = {
        // Delete options that exist in the database but are NOT present in the incoming list
        deleteMany: {
          questionId: id,
          id: {
            notIn: existingOptionIds,
          },
        },

        upsert: options.map((o: any) => ({
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

  static async deleteQuestion(id: number) {
    return await prisma.question.delete({ where: { id } });
  }
}

export default QuestionService;
