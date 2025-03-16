import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as userService from '../services/userService.js';
import { ValidationError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();

// Sækja prófíl notanda
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
        return res.status(404).json({ message: "Notandi ekki fundinn" });
    }

    // Skila gögnum notanda án lykilorðs
    const { password, ...userData } = user;
    return res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// Sækja viðburði sem notandi er skráður á
export const getUserAttendingEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const events = await userService.getUserAttendingEvents(userId);
        return res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};

// Skrá notanda á viðburð
export const attendEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        
        // Staðfesta að eventId sé tala
        const eventIdNum = parseInt(eventId);
        if (isNaN(eventIdNum)) {
            throw new ValidationError("Vitlaust ID viðburðar");
        }
        
        const result = await userService.attendEvent(userId, eventIdNum);
        return res.status(201).json({ message: "Það tókst að skrá notanda á viðburð", data: result });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Notandi er þegar skráður á þennan viðburð" });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Viðburður fannst ekki" });
        }
        next(error);
    }
};

// Úrskráning af viðburði
export const cancelAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        
        // Staðfesta að eventId sé tala
        const eventIdNum = parseInt(eventId);
        if (isNaN(eventIdNum)) {
            throw new ValidationError("Vitlaust ID viðburðar");
        }
        
        await userService.cancelAttendance(userId, eventIdNum);
        return res.status(200).json({ message: "Notandi hefur verið skráður á viðburð" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Gögn um skráningu finnast ekki" });
        }
        next(error);
    }
};

// Uppfæra prófíl notanda
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;
        
        // Staðfesta skyldureiti
        if (!name && !email) {
            throw new ValidationError("Krafa er gerð um annað hvort nafn eða netfang");
        }
        
        const updatedUser = await userService.updateUserProfile(userId, { name, email });
        
        // Skila gögn um notanda fyrir utan lykilorð
        const { password, ...userData } = updatedUser;
        return res.status(200).json({ message: "Prófíll hefur verið uppfærður", data: userData });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Aðgangur með þetta netfang er þegar til" });
        }
        next(error);
    }
};