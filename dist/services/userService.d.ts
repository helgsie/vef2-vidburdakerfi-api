import { User, Event, EventAttendee } from '@prisma/client';
export declare const getUserById: (userId: number) => Promise<User | null>;
export declare const getUserAttendingEvents: (userId: number) => Promise<Event[]>;
export declare const attendEvent: (userId: number, eventId: number) => Promise<EventAttendee>;
export declare const cancelAttendance: (userId: number, eventId: number) => Promise<void>;
export interface UpdateProfileData {
    name?: string;
    email?: string;
}
export declare const updateUserProfile: (userId: number, data: UpdateProfileData) => Promise<User>;
