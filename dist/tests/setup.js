import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
const prisma = new PrismaClient();
// Setja upp og eyða gervi gagnagrunni
export const setupTestDb = async () => {
    try {
        // Hreinsa prufugögn
        await prisma.$transaction([
            prisma.eventAttendee.deleteMany(),
            prisma.eventDate.deleteMany(),
            prisma.eventTag.deleteMany(),
            prisma.eventImage.deleteMany(),
            prisma.eventLocation.deleteMany(),
            prisma.event.deleteMany(),
            prisma.user.deleteMany(),
        ]);
        // Búa til prufu admin
        const hashedPassword = await bcrypt.hash('Admin123', 10);
        await prisma.user.create({
            data: {
                email: 'admin@test.com',
                name: 'Prufu admin',
                password: hashedPassword,
                isAdmin: true
            }
        });
        // Búa til prufu notanda
        const userPassword = await bcrypt.hash('Notandi123', 10);
        await prisma.user.create({
            data: {
                email: 'user@test.com',
                name: 'Prufu notandi',
                password: userPassword,
                isAdmin: false
            }
        });
        console.log('Uppsetningu á prufu gagnagrunni lokið');
    }
    catch (error) {
        console.error('Villa við uppsetningu á prufu gagnagrunni:', error);
        throw error;
    }
};
export const teardownTestDb = async () => {
    await prisma.$disconnect();
};
//# sourceMappingURL=setup.js.map