import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';

export const signup = async (email: string, name: string, password: string) => {
    // Athuga hvort notandi sé þegar til
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Salta lykilorð og búa til notanda
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            isAdmin: false // Sjálfvelja venjulegan notanda
        },
        select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            createdAt: true
        }
    });

    return user;
};

export const login = async (email: string, password: string) => {
    // Finna notanda út frá netfangi
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Sannreyna lykilorð
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Búa til JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT secret not configured');
    }

    const token = jwt.sign(
        { userId: user.id },
        jwtSecret,
        { expiresIn: '24h' }
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
        },
        token
    };
};