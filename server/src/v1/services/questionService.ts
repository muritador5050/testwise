import { PrismaClient } from '../../generated/prisma';

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
    return await prisma.question.update({
      where: { id },
      data,
      include: { options: true },
    });
  }

  static async deleteQuestion(id: number) {
    return await prisma.question.delete({ where: { id } });
  }
}

export default QuestionService;
