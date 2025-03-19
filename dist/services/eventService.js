import prisma from "../config/database.js";
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
// Sækja alla viðburði
export const getAllEvents = async (active, limit, offset) => {
    const where = active !== undefined ? { active } : {};
    const events = await prisma.event.findMany({
        where,
        include: {
            location: true,
            tags: true,
            image: true,
            dates: true,
            attendees: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        take: limit,
        skip: offset,
        orderBy: { start: 'asc' }
    });
    return events;
};
// Sækja viðburð eftir id
export const getEventById = async (eventId) => {
    const event = await prisma.event.findUnique({
        where: { eventId },
        include: {
            location: true,
            tags: true,
            image: true,
            dates: true,
            attendees: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    if (!event) {
        throw new Error('Viðburður finnst ekki');
    }
    return event;
};
// Búa til viðburð
export const createEvent = async (eventData, userId, imageFile) => {
    let counter = 0;
    const eventId = `${counter++}`;
    let uploadResult = null;
    let imageId = null;
    try {
        // Búum til viðburðinn
        const event = await prisma.event.create({
            data: {
                eventId,
                titleIs: eventData.titleIs,
                titleEn: eventData.titleEn,
                textIs: eventData.textIs,
                textEn: eventData.textEn,
                place: eventData.place,
                formattedAddress: eventData.formattedAddress,
                city: eventData.city,
                postal: eventData.postal,
                street: eventData.street,
                start: eventData.start,
                end: eventData.end,
                occurrence: eventData.occurrence,
                active: eventData.active || false,
                accepted: true, // Viðburðir gerðir af admin eru sjálfkrafa accepted
                website: eventData.website,
                facebook: eventData.facebook,
                tickets: eventData.tickets,
                creator: {
                    connect: { id: userId }
                }
            }
        });
        // Höndla upphleðslu á mynd ef við á
        if (imageFile) {
            uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                folder: 'events',
                resource_type: 'image',
                transformation: [
                    { width: 1200, crop: 'limit', quality: 'auto' },
                ]
            });
            imageId = uploadResult.public_id;
            // Búa til útgáfur af ólíkum stærðum
            const smallUrl = cloudinary.url(imageId, { width: 200, crop: 'fill' });
            const mediumUrl = cloudinary.url(imageId, { width: 400, crop: 'fill' });
            const largeUrl = cloudinary.url(imageId, { width: 800, crop: 'fill' });
            const xlargeUrl = cloudinary.url(imageId, { width: 1200, crop: 'fill' });
            // Stilla URL á mynd viðburðs
            await prisma.event.update({
                where: { id: event.id },
                data: {
                    eventImage: uploadResult.secure_url,
                    thumbnailImage: smallUrl,
                    image: {
                        create: {
                            path: uploadResult.secure_url,
                            small: smallUrl,
                            medium: mediumUrl,
                            large: largeUrl,
                            xlarge: xlargeUrl,
                            original: uploadResult.secure_url,
                            imageId: imageId
                        }
                    }
                }
            });
            // Eyða local skjali eftir upphleðslu
            if (fs.existsSync(imageFile.path)) {
                fs.unlinkSync(imageFile.path);
            }
        }
        // Bæta við staðsetningu ef á við
        if (eventData.location) {
            await prisma.eventLocation.create({
                data: {
                    eventId: event.id,
                    latitude: eventData.location.latitude,
                    longitude: eventData.location.longitude
                }
            });
        }
        // Bæta við tögum ef á við
        if (eventData.tags && eventData.tags.length > 0) {
            const tagPromises = eventData.tags.map(tag => prisma.eventTag.create({
                data: {
                    eventId: event.id,
                    tag
                }
            }));
            await Promise.all(tagPromises);
        }
        // Bæta við dagsetningum ef á við
        if (eventData.dates && eventData.dates.length > 0) {
            const datePromises = eventData.dates.map(date => prisma.eventDate.create({
                data: {
                    eventId: event.id,
                    date
                }
            }));
            await Promise.all(datePromises);
        }
        // Sækja viðburð með öllum tengingum
        const completeEvent = await prisma.event.findUnique({
            where: { id: event.id },
            include: {
                location: true,
                tags: true,
                image: true,
                dates: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return completeEvent;
    }
    catch (error) {
        // Mynd er eytt ef upphleðsla hennar tekst en stofnun viðburðar mistekt
        if (imageId) {
            await cloudinary.uploader.destroy(imageId);
        }
        // Hreinsa local skjal ef það er til
        if (imageFile && fs.existsSync(imageFile.path)) {
            fs.unlinkSync(imageFile.path);
        }
        throw error;
    }
};
export const updateEvent = async (eventId, eventData, imageFile) => {
    const event = await prisma.event.findUnique({
        where: { eventId },
        include: { image: true }
    });
    if (!event) {
        throw new Error('Viðburður ekki fundinn');
    }
    let imageId = event.image?.imageId;
    let uploadResult = null;
    try {
        // Höndla uppfærslu á mynd ef við á
        if (imageFile) {
            // Eyða gamalli mynd ef við á
            if (imageId) {
                await cloudinary.uploader.destroy(imageId);
            }
            // Hlaða upp nýrri mynd
            uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                folder: 'events',
                resource_type: 'image',
                transformation: [
                    { width: 1200, crop: 'limit', quality: 'auto' },
                ]
            });
            imageId = uploadResult.public_id;
            // Búa til útgáfur af ólíkum stærðum
            const smallUrl = cloudinary.url(imageId, { width: 200, crop: 'fill' });
            const mediumUrl = cloudinary.url(imageId, { width: 400, crop: 'fill' });
            const largeUrl = cloudinary.url(imageId, { width: 800, crop: 'fill' });
            const xlargeUrl = cloudinary.url(imageId, { width: 1200, crop: 'fill' });
            // Breyta myndagögnum viðburðs
            await prisma.event.update({
                where: { id: event.id },
                data: {
                    eventImage: uploadResult.secure_url,
                    thumbnailImage: smallUrl,
                    image: event.image
                        ? {
                            update: {
                                path: uploadResult.secure_url,
                                small: smallUrl,
                                medium: mediumUrl,
                                large: largeUrl,
                                xlarge: xlargeUrl,
                                original: uploadResult.secure_url,
                                imageId: imageId
                            }
                        }
                        : {
                            create: {
                                path: uploadResult.secure_url,
                                small: smallUrl,
                                medium: mediumUrl,
                                large: largeUrl,
                                xlarge: xlargeUrl,
                                original: uploadResult.secure_url,
                                imageId: imageId
                            }
                        }
                }
            });
            // Eyða local skjali eftir upphleðslu
            if (fs.existsSync(imageFile.path)) {
                fs.unlinkSync(imageFile.path);
            }
        }
        // Breyta almennum upplýsingum um viðburð
        const updatedEvent = await prisma.event.update({
            where: { id: event.id },
            data: {
                titleIs: eventData.titleIs !== undefined ? eventData.titleIs : undefined,
                titleEn: eventData.titleEn !== undefined ? eventData.titleEn : undefined,
                textIs: eventData.textIs !== undefined ? eventData.textIs : undefined,
                textEn: eventData.textEn !== undefined ? eventData.textEn : undefined,
                place: eventData.place !== undefined ? eventData.place : undefined,
                formattedAddress: eventData.formattedAddress !== undefined ? eventData.formattedAddress : undefined,
                city: eventData.city !== undefined ? eventData.city : undefined,
                postal: eventData.postal !== undefined ? eventData.postal : undefined,
                street: eventData.street !== undefined ? eventData.street : undefined,
                start: eventData.start !== undefined ? eventData.start : undefined,
                end: eventData.end !== undefined ? eventData.end : undefined,
                occurrence: eventData.occurrence !== undefined ? eventData.occurrence : undefined,
                active: eventData.active !== undefined ? eventData.active : undefined,
                website: eventData.website !== undefined ? eventData.website : undefined,
                facebook: eventData.facebook !== undefined ? eventData.facebook : undefined,
                tickets: eventData.tickets !== undefined ? eventData.tickets : undefined,
            },
            include: {
                location: true,
                tags: true,
                image: true,
                dates: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        // Uppfæra staðsetningu ef við á
        if (eventData.location) {
            if (updatedEvent.location) {
                await prisma.eventLocation.update({
                    where: { eventId: event.id },
                    data: {
                        latitude: eventData.location.latitude,
                        longitude: eventData.location.longitude
                    }
                });
            }
            else {
                await prisma.eventLocation.create({
                    data: {
                        eventId: event.id,
                        latitude: eventData.location.latitude,
                        longitude: eventData.location.longitude
                    }
                });
            }
        }
        // Uppfæra tög ef við á
        if (eventData.tags) {
            // Eyða núverandi tögum
            await prisma.eventTag.deleteMany({
                where: { eventId: event.id }
            });
            // Búa til ný tög
            if (eventData.tags.length > 0) {
                const tagPromises = eventData.tags.map(tag => prisma.eventTag.create({
                    data: {
                        eventId: event.id,
                        tag
                    }
                }));
                await Promise.all(tagPromises);
            }
        }
        // Uppfæra dagsetningar ef við á
        if (eventData.dates) {
            // Eyða núverandi dagsetningum
            await prisma.eventDate.deleteMany({
                where: { eventId: event.id }
            });
            // Búa til nýjar dagsetningar
            if (eventData.dates.length > 0) {
                const datePromises = eventData.dates.map(date => prisma.eventDate.create({
                    data: {
                        eventId: event.id,
                        date
                    }
                }));
                await Promise.all(datePromises);
            }
        }
        // Sækja uppfærðan viðburð með tengingum
        const completeEvent = await prisma.event.findUnique({
            where: { id: event.id },
            include: {
                location: true,
                tags: true,
                image: true,
                dates: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return completeEvent;
    }
    catch (error) {
        // Eyða nýju myndinni ef upphleðsla hennar tekst en uppfærsla viðburðar mistekst.
        if (uploadResult && imageId !== event.image?.imageId) {
            await cloudinary.uploader.destroy(imageId);
        }
        // Hreinsa local skjal ef það er til
        if (imageFile && fs.existsSync(imageFile.path)) {
            fs.unlinkSync(imageFile.path);
        }
        throw error;
    }
};
// Eyða viðburði
export const deleteEvent = async (eventId) => {
    const event = await prisma.event.findUnique({
        where: { eventId },
        include: { image: true }
    });
    if (!event) {
        throw new Error('Event not found');
    }
    try {
        // Eyða mynd af Cloudinary ef hún er til
        if (event.image?.imageId) {
            await cloudinary.uploader.destroy(event.image.imageId);
        }
        // Eyða öllum tengdum gögnum fyrst (foreign key)
        await prisma.$transaction([
            // Eyða gestum á gestalista
            prisma.eventAttendee.deleteMany({
                where: { eventId: event.id }
            }),
            // Eyða staðsetningu
            prisma.eventLocation.deleteMany({
                where: { eventId: event.id }
            }),
            // Eyða tögum
            prisma.eventTag.deleteMany({
                where: { eventId: event.id }
            }),
            // Eyða mynd
            prisma.eventImage.deleteMany({
                where: { eventId: event.id }
            }),
            // Eyða dagsetningum
            prisma.eventDate.deleteMany({
                where: { eventId: event.id }
            }),
            // Eyða loks viðburðinum sjálfum
            prisma.event.delete({
                where: { id: event.id }
            })
        ]);
        return { success: true, message: 'Viðburði var eytt' };
    }
    catch (error) {
        throw new Error(`Villa við að eyða viðburði: ${error instanceof Error ? error.message : 'Ekki tókst að eyða viðburði'}`);
    }
};
// Bæta notanda við sem gest
export const addAttendee = async (userId, eventId) => {
    // Sækja viðburð til að passa að viðburður sé til
    const event = await prisma.event.findUnique({
        where: { eventId }
    });
    if (!event) {
        throw new Error('Viðburður ekki fundinn');
    }
    // Athuga hvort notandi sé þegar skráður á viðburð
    const existingAttendee = await prisma.eventAttendee.findUnique({
        where: {
            userId_eventId: {
                userId: userId,
                eventId: event.id
            }
        }
    });
    if (existingAttendee) {
        throw new Error('Notandi er þegar skráður á viðburð');
    }
    // Bæta notanda við á gestalista
    const attendee = await prisma.eventAttendee.create({
        data: {
            userId,
            eventId: event.id
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            event: {
                select: {
                    id: true,
                    eventId: true,
                    titleEn: true,
                    titleIs: true
                }
            }
        }
    });
    return attendee;
};
// Eyða notanda af gestalista
export const removeAttendee = async (userId, eventId) => {
    // Sækja viðburð til að passa að hann sé til
    const event = await prisma.event.findUnique({
        where: { eventId }
    });
    if (!event) {
        throw new Error('Viðburður ekki fundinn');
    }
    // Athuga hvort notandi sé skráður á viðburð
    const existingAttendee = await prisma.eventAttendee.findUnique({
        where: {
            userId_eventId: {
                userId: userId,
                eventId: event.id
            }
        }
    });
    if (!existingAttendee) {
        throw new Error('Notandi er ekki skráður á viðburð');
    }
    // Eyða af gestalista
    await prisma.eventAttendee.delete({
        where: {
            id: existingAttendee.id
        }
    });
    return { success: true, message: 'Notanda var eytt af gestalista' };
};
// Sækja gestalista fyrir viðburð
export const getEventAttendees = async (eventId) => {
    // Sækja viðburð til að passa að hann sé til
    const event = await prisma.event.findUnique({
        where: { eventId }
    });
    if (!event) {
        throw new Error('Viðburður ekki fundinn');
    }
    // Sækja alla gesti
    const attendees = await prisma.eventAttendee.findMany({
        where: {
            eventId: event.id
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    return attendees;
};
// Sækja alla viðburði sem notandi er skráður á
export const getUserEvents = async (userId) => {
    const attendances = await prisma.eventAttendee.findMany({
        where: {
            userId
        },
        include: {
            event: {
                include: {
                    location: true,
                    tags: true,
                    image: true,
                    dates: true,
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return attendances.map(attendance => attendance.event);
};
//# sourceMappingURL=eventService.js.map