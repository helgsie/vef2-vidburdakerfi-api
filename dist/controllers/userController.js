import { PrismaClient } from '@prisma/client';
import * as userService from '../services/userService.js';
import { ValidationError } from '../middleware/errorHandler.js';
const prisma = new PrismaClient();
// Sækja prófíl notanda
export const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userService.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: "Notandi ekki fundinn" });
            return;
        }
        // Skila gögnum notanda án lykilorðs
        const { password, ...userData } = user;
        res.status(200).json(userData);
        return;
    }
    catch (error) {
        next(error);
    }
};
// Sækja viðburði sem notandi er skráður á
export const getUserAttendingEvents = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const events = await userService.getUserAttendingEvents(userId);
        res.status(200).json(events);
        return;
    }
    catch (error) {
        next(error);
    }
};
// Skrá notanda á viðburð
export const attendEvent = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        // Staðfesta að eventId sé tala
        const eventIdNum = parseInt(eventId);
        if (isNaN(eventIdNum)) {
            throw new ValidationError("Vitlaust ID viðburðar");
        }
        const result = await userService.attendEvent(userId, eventIdNum);
        res.status(201).json({ message: "Það tókst að skrá notanda á viðburð", data: result });
        return;
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({ message: "Notandi er þegar skráður á þennan viðburð" });
            return;
        }
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Viðburður fannst ekki" });
            return;
        }
        next(error);
    }
};
// Úrskráning af viðburði
export const cancelAttendance = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        // Staðfesta að eventId sé tala
        const eventIdNum = parseInt(eventId);
        if (isNaN(eventIdNum)) {
            throw new ValidationError("Vitlaust ID viðburðar");
        }
        await userService.cancelAttendance(userId, eventIdNum);
        res.status(200).json({ message: "Notandi hefur verið skráður á viðburð" });
        return;
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Gögn um skráningu finnast ekki" });
            return;
        }
        next(error);
    }
};
// Uppfæra prófíl notanda
export const updateUserProfile = async (req, res, next) => {
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
        res.status(200).json({ message: "Prófíll hefur verið uppfærður", data: userData });
        return;
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({ message: "Aðgangur með þetta netfang er þegar til" });
            return;
        }
        next(error);
    }
};
//# sourceMappingURL=userController.js.map