import prisma from '../config/database.js';
import { hashPassword } from './passwordUtils.js';
import dotenv from 'dotenv';

dotenv.config();

export const seedAdmin = async (): Promise<void> => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME;

        if (!adminEmail || !adminPassword || !adminName) {
            console.error('Admin upplýsingar hafa ekki verið rétt upp settar í env breytum');
            return;
        }

        // Athuga hvort admin sé nú þegar til
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('Admin notandi er nú þegar til');
            return;
        }

        const hashedPassword = await hashPassword(adminPassword);

        // Búa til admin notanda
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: adminName,
                password: hashedPassword,
                isAdmin: true
            }
        });

        console.log('Tókst að búa til admin notanda');
    } catch (error) {
        console.error('Villa við að seeda admin notanda:', error);
    }
};