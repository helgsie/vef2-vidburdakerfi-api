import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthenticationError, AuthorizationError } from './errorHandler.js';
const prisma = new PrismaClient();
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('Auðkenningar krafist');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AuthenticationError('Vantar auðkenningar token');
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ error: 'Villa við að setja upp netþjón' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            throw new AuthenticationError('Notandi ekki fundinn');
        }
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            next(new AuthenticationError('Rangur eða útrunninn token'));
            return;
        }
        next(error);
    }
};
export const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        next(new AuthorizationError('Aðgerð krefst admin réttinda'));
        return;
    }
    next();
};
//# sourceMappingURL=auth.js.map