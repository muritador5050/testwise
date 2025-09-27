import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

class UserService {
  static async createUser(data: {
    email: string;
    name?: string;
    role?: 'STUDENT' | 'ADMIN' | 'INSTRUCTOR';
  }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || 'STUDENT',
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
    data: Partial<{ name: string; role: 'STUDENT' | 'ADMIN' | 'INSTRUCTOR' }>
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
}

export default UserService;
