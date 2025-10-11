import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication token required' });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decode.id },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
//# sourceMappingURL=authenticate.js.map