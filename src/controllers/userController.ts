import { AuthRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma';

export const registerUser = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
  
    try {
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            res.status(400).json({ message: 'Notandi er nú þegar til' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword },
        });
    
        res.status(201).json({ id: user.id, email: user.email, name: user.name });
        } catch (error) {
            res.status(500).json({ message: 'Villa við nýskráningu notanda' });
        }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Rangt netfang eða lykilorð' });
            return;
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Rangt netfang eða lykilorð' });
            return;
        }
    
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    
        res.json({ id: user.id, email: user.email, name: user.name, token });
        } catch (error) {
            res.status(500).json({ message: 'Villa við innskráningu' });
        }
    };

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: { id: true, email: true, name: true },
      });
  
      if (!user) {
        res.status(404).json({ message: 'Notandi ekki fundinn' });
        return;
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Villa við að sækja prófíl notanda' });
    }
};