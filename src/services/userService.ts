import { PrismaClient, User, Event, EventAttendee } from '@prisma/client';

const prisma = new PrismaClient();

// Sækja notanda eftir ID
export const getUserById = async (userId: number): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { id: userId }
    });
};

// Sækja viðburði sem notandi er skráður á
export const getUserAttendingEvents = async (userId: number): Promise<Event[]> => {
    const attendances = await prisma.eventAttendee.findMany({
        where: { userId },
        include: {
            event: {
                include: {
                    location: true,
                    tags: true,
                    image: true,
                    dates: true
                }
            }
        }
    });
    
    // Sækja einungis viðburðina úr gögnunum
    return attendances.map(attendance => attendance.event);
};

// Skrá notanda á viðburð
export const attendEvent = async (userId: number, eventId: number): Promise<EventAttendee> => {
    // Athuga hvort viðburður sé til
    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });
    
    if (!event) {
        throw new Error('Event not found');
    }
    
    // Skrá á gestalista
    return prisma.eventAttendee.create({
        data: {
            userId,
            eventId
        }
    });
};

// Hætta við skráningu á viðburð
export const cancelAttendance = async (userId: number, eventId: number): Promise<void> => {
    await prisma.eventAttendee.delete({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });
};

// Uppfæra prófíl notanda
export interface UpdateProfileData {
    name?: string;
    email?: string;
    imageUrl?: string;
}

export const updateUserProfile = async (userId: number, data: UpdateProfileData): Promise<User> => {
    return prisma.user.update({
        where: { id: userId },
        data
    });
};