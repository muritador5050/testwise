declare class UserService {
    static createUser(data: {
        email: string;
        name?: string;
        role?: 'STUDENT' | 'ADMIN';
        avatar?: string;
    }): Promise<{
        id: number;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static loginUser(email: string): Promise<{
        id: number;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    static getUserById(id: number): Promise<({
        attempts: ({
            test: {
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
        })[];
    } & {
        id: number;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    static getAllUsers(page?: number, limit?: number): Promise<{
        users: ({
            _count: {
                attempts: number;
            };
        } & {
            id: number;
            email: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static updateUser(id: number, data: Partial<{
        name: string;
        avatar: string;
        role: 'STUDENT' | 'ADMIN';
    }>): Promise<{
        id: number;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static deleteUser(id: number): Promise<{
        id: number;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getUserCounts(): Promise<{
        total: number;
        students: number;
        admins: number;
    }>;
    static getUserActivityStats(userId: number): Promise<{
        totalAttempts: number;
        completedAttempts: number;
        averageScore: number;
        inProgressAttempts: number;
        recentActivity: {
            testTitle: any;
            status: any;
            score: any;
            startedAt: any;
        }[];
    }>;
}
export default UserService;
