import { Request, Response } from 'express';
import UserService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

class UserController {
  static async create(req: Request, res: Response) {
    try {
      const { email, name, role, avatar } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const user = await UserService.createUser({ email, name, role, avatar });
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const user = await UserService.loginUser(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid email address' });
      }

      // Role-based token expiration
      let tokenExpiration: string;

      switch (user.role) {
        case 'STUDENT':
          tokenExpiration = '30m';
          break;
        case 'ADMIN':
          tokenExpiration = '12h';
          break;
        default:
          tokenExpiration = '1h';
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: tokenExpiration } as jwt.SignOptions
      );

      res.json({ user, token, expiresIn: tokenExpiration });
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const prismaError = error as { code: string; message: string };
        if (prismaError.code === 'P2002') {
          return res.status(409).json({ error: 'Email already exists' });
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (req.user?.role !== 'ADMIN' && req.user?.id !== userId) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      const user = await UserService.getUserById(parseInt(id));

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await UserService.getAllUsers(page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, role, avatar } = req.body;

      const user = await UserService.updateUser(parseInt(id), {
        name,
        role,
        avatar,
      });
      res.json(user);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userIdToDelete = parseInt(id);

      const authenticatedUser = req.user;

      if (authenticatedUser && authenticatedUser.id === userIdToDelete) {
        return res
          .status(400)
          .json({ error: 'Users cannot delete themselves' });
      }

      await UserService.deleteUser(userIdToDelete);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found or Invalid ID' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getCounts(req: Request, res: Response) {
    try {
      const counts = await UserService.getUserCounts();
      res.json(counts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserActivity(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (req.user?.role === 'STUDENT' && req.user?.id !== userId) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      if (req.user?.role !== 'ADMIN' && req.user?.id !== userId) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const stats = await UserService.getUserActivityStats(userId);
      res.json(stats);
    } catch (error: any) {
      if (error.message === 'Activity stats are only available for students') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
