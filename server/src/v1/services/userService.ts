import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

class UserService {
  static async createUser(data: {
    email: string;
    name?: string;
    role?: 'STUDENT' | 'ADMIN';
    avatar?: string;
  }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || 'STUDENT',
        avatar: data.avatar || null,
      },
    });
  }

  static async loginUser(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        attempts: {
          include: {
            test: true,
          },
        },
      },
    });
  }

  static async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { attempts: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUser(
    id: number,
    data: Partial<{
      name: string;
      avatar: string;
      role: 'STUDENT' | 'ADMIN';
    }>
  ) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  static async getUserCounts() {
    const [total, students, admins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    return {
      total,
      students,
      admins,
    };
  }

  static async getUserActivityStats(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'STUDENT') {
      throw new Error('Activity stats are only available for students');
    }

    const [totalAttempts, completedAttempts, avgScore, recentActivity] =
      await Promise.all([
        prisma.attempt.count({ where: { userId } }),
        prisma.attempt.count({ where: { userId, status: 'COMPLETED' } }),
        prisma.attempt.aggregate({
          where: { userId, status: 'COMPLETED' },
          _avg: { percentScore: true },
        }),
        prisma.attempt.findMany({
          where: { userId },
          take: 10,
          orderBy: { startedAt: 'desc' },
          include: { test: { select: { title: true } } },
        }),
      ]);

    return {
      totalAttempts,
      completedAttempts,
      averageScore: avgScore._avg.percentScore || 0,
      inProgressAttempts: totalAttempts - completedAttempts,
      recentActivity: recentActivity.map((a) => ({
        testTitle: a.test.title,
        status: a.status,
        score: a.percentScore,
        startedAt: a.startedAt,
      })),
    };
  }
}

export default UserService;
