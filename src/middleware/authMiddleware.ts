import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma';

export interface AuthRequest extends Request {
  user?: { id: number; isAdmin: boolean };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            res.status(401).json({ message: 'Notandi ekki fundinn' });
            return;
        }

        req.user = { id: user.id, isAdmin: user.isAdmin };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Rangur token' });
        return;
    }
  } else {
    res.status(401).json({ message: 'Ekki heimilað, vantar token' });
    return;
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Ekki með admin heimild' });
  }
};