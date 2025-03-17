interface EventLocation {
    latitude: number;
    longitude: number;
}
interface EventCreate {
    titleIs?: string;
    titleEn?: string;
    textIs?: string;
    textEn?: string;
    place?: string;
    formattedAddress?: string;
    city?: string;
    postal?: string;
    street?: string;
    start?: Date;
    end?: Date;
    occurrence?: string;
    active?: boolean;
    website?: string;
    facebook?: string;
    tickets?: string;
    tags?: string[];
    location?: EventLocation;
    dates?: Date[];
}
export declare const getAllEvents: (active?: boolean, limit?: number, offset?: number) => Promise<({
    location: {
        id: number;
        eventId: number;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
    } | null;
    tags: {
        id: number;
        eventId: number;
        tag: string;
    }[];
    image: {
        id: number;
        small: string | null;
        eventId: number;
        time: number | null;
        path: string | null;
        medium: string | null;
        large: string | null;
        xlarge: string | null;
        original: string | null;
        imageId: string | null;
    } | null;
    dates: {
        id: number;
        eventId: number;
        date: Date;
    }[];
    creator: {
        id: number;
        email: string;
        name: string;
    } | null;
    attendees: ({
        user: {
            id: number;
            email: string;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        eventId: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    end: Date | null;
    eventId: string;
    titleIs: string | null;
    titleEn: string | null;
    textIs: string | null;
    textEn: string | null;
    place: string | null;
    formattedAddress: string | null;
    city: string | null;
    postal: string | null;
    street: string | null;
    start: Date | null;
    occurrence: string | null;
    eventImage: string | null;
    thumbnailImage: string | null;
    accepted: boolean;
    active: boolean;
    legacy: boolean;
    template: boolean;
    owner: number | null;
    website: string | null;
    facebook: string | null;
    tickets: string | null;
})[]>;
export declare const getEventById: (eventId: string) => Promise<{
    location: {
        id: number;
        eventId: number;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
    } | null;
    tags: {
        id: number;
        eventId: number;
        tag: string;
    }[];
    image: {
        id: number;
        small: string | null;
        eventId: number;
        time: number | null;
        path: string | null;
        medium: string | null;
        large: string | null;
        xlarge: string | null;
        original: string | null;
        imageId: string | null;
    } | null;
    dates: {
        id: number;
        eventId: number;
        date: Date;
    }[];
    creator: {
        id: number;
        email: string;
        name: string;
    } | null;
    attendees: ({
        user: {
            id: number;
            email: string;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        eventId: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    end: Date | null;
    eventId: string;
    titleIs: string | null;
    titleEn: string | null;
    textIs: string | null;
    textEn: string | null;
    place: string | null;
    formattedAddress: string | null;
    city: string | null;
    postal: string | null;
    street: string | null;
    start: Date | null;
    occurrence: string | null;
    eventImage: string | null;
    thumbnailImage: string | null;
    accepted: boolean;
    active: boolean;
    legacy: boolean;
    template: boolean;
    owner: number | null;
    website: string | null;
    facebook: string | null;
    tickets: string | null;
}>;
export declare const createEvent: (eventData: EventCreate, userId: number, imageFile?: Express.Multer.File) => Promise<({
    location: {
        id: number;
        eventId: number;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
    } | null;
    tags: {
        id: number;
        eventId: number;
        tag: string;
    }[];
    image: {
        id: number;
        small: string | null;
        eventId: number;
        time: number | null;
        path: string | null;
        medium: string | null;
        large: string | null;
        xlarge: string | null;
        original: string | null;
        imageId: string | null;
    } | null;
    dates: {
        id: number;
        eventId: number;
        date: Date;
    }[];
    creator: {
        id: number;
        email: string;
        name: string;
    } | null;
} & {
    id: number;
    createdAt: Date;
    end: Date | null;
    eventId: string;
    titleIs: string | null;
    titleEn: string | null;
    textIs: string | null;
    textEn: string | null;
    place: string | null;
    formattedAddress: string | null;
    city: string | null;
    postal: string | null;
    street: string | null;
    start: Date | null;
    occurrence: string | null;
    eventImage: string | null;
    thumbnailImage: string | null;
    accepted: boolean;
    active: boolean;
    legacy: boolean;
    template: boolean;
    owner: number | null;
    website: string | null;
    facebook: string | null;
    tickets: string | null;
}) | null>;
export declare const updateEvent: (eventId: string, eventData: Partial<EventCreate>, imageFile?: Express.Multer.File) => Promise<({
    location: {
        id: number;
        eventId: number;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
    } | null;
    tags: {
        id: number;
        eventId: number;
        tag: string;
    }[];
    image: {
        id: number;
        small: string | null;
        eventId: number;
        time: number | null;
        path: string | null;
        medium: string | null;
        large: string | null;
        xlarge: string | null;
        original: string | null;
        imageId: string | null;
    } | null;
    dates: {
        id: number;
        eventId: number;
        date: Date;
    }[];
    creator: {
        id: number;
        email: string;
        name: string;
    } | null;
} & {
    id: number;
    createdAt: Date;
    end: Date | null;
    eventId: string;
    titleIs: string | null;
    titleEn: string | null;
    textIs: string | null;
    textEn: string | null;
    place: string | null;
    formattedAddress: string | null;
    city: string | null;
    postal: string | null;
    street: string | null;
    start: Date | null;
    occurrence: string | null;
    eventImage: string | null;
    thumbnailImage: string | null;
    accepted: boolean;
    active: boolean;
    legacy: boolean;
    template: boolean;
    owner: number | null;
    website: string | null;
    facebook: string | null;
    tickets: string | null;
}) | null>;
export declare const deleteEvent: (eventId: string) => Promise<{
    success: boolean;
    message: string;
}>;
export declare const addAttendee: (userId: number, eventId: string) => Promise<{
    user: {
        id: number;
        email: string;
        name: string;
    };
    event: {
        id: number;
        eventId: string;
        titleIs: string | null;
        titleEn: string | null;
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    eventId: number;
}>;
export declare const removeAttendee: (userId: number, eventId: string) => Promise<{
    success: boolean;
    message: string;
}>;
export declare const getEventAttendees: (eventId: string) => Promise<({
    user: {
        id: number;
        email: string;
        name: string;
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    eventId: number;
})[]>;
export declare const getUserEvents: (userId: number) => Promise<({
    location: {
        id: number;
        eventId: number;
        latitude: import("@prisma/client/runtime/library").Decimal;
        longitude: import("@prisma/client/runtime/library").Decimal;
    } | null;
    tags: {
        id: number;
        eventId: number;
        tag: string;
    }[];
    image: {
        id: number;
        small: string | null;
        eventId: number;
        time: number | null;
        path: string | null;
        medium: string | null;
        large: string | null;
        xlarge: string | null;
        original: string | null;
        imageId: string | null;
    } | null;
    dates: {
        id: number;
        eventId: number;
        date: Date;
    }[];
    creator: {
        id: number;
        email: string;
        name: string;
    } | null;
} & {
    id: number;
    createdAt: Date;
    end: Date | null;
    eventId: string;
    titleIs: string | null;
    titleEn: string | null;
    textIs: string | null;
    textEn: string | null;
    place: string | null;
    formattedAddress: string | null;
    city: string | null;
    postal: string | null;
    street: string | null;
    start: Date | null;
    occurrence: string | null;
    eventImage: string | null;
    thumbnailImage: string | null;
    accepted: boolean;
    active: boolean;
    legacy: boolean;
    template: boolean;
    owner: number | null;
    website: string | null;
    facebook: string | null;
    tickets: string | null;
})[]>;
export {};
