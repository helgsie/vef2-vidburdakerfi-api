import { Request, Response } from 'express';
import * as eventService from '../services/eventService.js';
import prisma from '../config/database.js';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const active = req.query.active === 'true' ? true : 
                  req.query.active === 'false' ? false : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const events = await eventService.getAllEvents(active, limit, offset);

    res.status(200).json(events);
  } catch (error) {
    console.error('Villa við að sækja viðburði:', error);
    res.status(500).json({ error: 'Tókst ekki að sækja viðburði' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await eventService.getEventById(eventId);

    res.status(200).json(event);
    
  } catch (error) {
    if (error instanceof Error && error.message === 'Viðburður ekki fundinn') {
        return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ message: 'Villa við að sækja viðburð' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Auðkenningu krafist' });
        }
        
        // Hreinsa og staðfesta innslegin gögn
        const eventData = {
            titleIs: req.body.titleIs,
            titleEn: req.body.titleEn,
            textIs: req.body.textIs,
            textEn: req.body.textEn,
            place: req.body.place,
            formattedAddress: req.body.formattedAddress,
            city: req.body.city,
            postal: req.body.postal,
            street: req.body.street,
            start: req.body.start ? new Date(req.body.start) : undefined,
            end: req.body.end ? new Date(req.body.end) : undefined,
            occurrence: req.body.occurrence,
            active: req.body.active === true,
            website: req.body.website,
            facebook: req.body.facebook,
            tickets: req.body.tickets,
            tags: Array.isArray(req.body.tags) ? req.body.tags : undefined,
            location: req.body.location ? {
                latitude: parseFloat(req.body.location.latitude),
                longitude: parseFloat(req.body.location.longitude)
            } : undefined,
            dates: Array.isArray(req.body.dates) ? 
                req.body.dates.map((date: string) => new Date(date)) : undefined
        };
        
        // Staðfesta skyldureiti
        if (!eventData.titleEn && !eventData.titleIs) {
            return res.status(400).json({ error: 'Viðburður verður að hafa titil í að minnsta einu tungumáli' });
        }
        
        const event = await eventService.createEvent(
            eventData, 
            req.user.id, 
            req.file
        );
        
        res.status(201).json(event);
    } catch (error) {
        console.error('Villa við að búa til viðburð:', error);
        res.status(500).json({ error: 'Villa kom upp við að búa til viðburð' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        
        if (!req.user) {
            return res.status(401).json({ error: 'Auðkenningar krafist' });
        }
        
        // Hreinsa og staðfesta innslegin gögn
        const eventData = {
            titleIs: req.body.titleIs,
            titleEn: req.body.titleEn,
            textIs: req.body.textIs,
            textEn: req.body.textEn,
            place: req.body.place,
            formattedAddress: req.body.formattedAddress,
            city: req.body.city,
            postal: req.body.postal,
            street: req.body.street,
            start: req.body.start ? new Date(req.body.start) : undefined,
            end: req.body.end ? new Date(req.body.end) : undefined,
            occurrence: req.body.occurrence,
            active: req.body.active !== undefined ? req.body.active === true : undefined,
            website: req.body.website,
            facebook: req.body.facebook,
            tickets: req.body.tickets,
            tags: Array.isArray(req.body.tags) ? req.body.tags : undefined,
            location: req.body.location ? {
                latitude: parseFloat(req.body.location.latitude),
                longitude: parseFloat(req.body.location.longitude)
            } : undefined,
            dates: Array.isArray(req.body.dates) ? 
                req.body.dates.map((date: string) => new Date(date)) : undefined
        };
        
        const event = await eventService.updateEvent(
            eventId, 
            eventData, 
            req.file
        );
        
        res.status(200).json(event);
    } catch (error) {
        if (error instanceof Error && error.message === 'Viðburður ekki fundinn') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Villa við að uppfæra viðburð:', error);
        res.status(500).json({ error: 'Villa kom upp við að uppfæra viðburð' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        
        const result = await eventService.deleteEvent(eventId);
        
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error && error.message === 'Viðburður ekki fundinn') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Villa við að eyða viðburði:', error);
        res.status(500).json({ error: 'Villa kom upp við að eyða viðburði' });
    }
};

export const addAttendee = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        
        if (!req.user) {
            return res.status(401).json({ error: 'Auðkenningar krafist' });
        }
        
        // Athuga hvort viðburður sé til
        const event = await eventService.getEventById(eventId);
        
        // Athuga hvort notandi sé þegar skráður á viðburð
        const existingAttendee = await prisma.eventAttendee.findUnique({
            where: {
                userId_eventId: {
                    userId: req.user.id,
                    eventId: event.id
                }
            }
        });
        
        if (existingAttendee) {
            return res.status(409).json({ error: 'Notandi er þegar skráður á viðburð' });
        }
        
        // Bæta notanda við sem gest
        const attendee = await prisma.eventAttendee.create({
            data: {
                userId: req.user.id,
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
            }
        });
        
        res.status(201).json({
            message: 'Notandi hefur verið skráður á gestalista',
            attendee
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Viðburður ekki fundinn') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Villa við að bæta notanda við á gestalista:', error);
        res.status(500).json({ error: 'Ekki tókst að skrá notanda á viðburð' });
    }
};
  
// Eyða notanda af gestalista
export const removeAttendee = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        // Athuga hvort viðburðurinn sé til
        const event = await eventService.getEventById(eventId);
        
        // Eyða ummerki um að notandi sé gestur fyrir viðburð
        await prisma.eventAttendee.deleteMany({
            where: {
                userId: req.user.id,
                eventId: event.id
            }
        });
        
        res.status(200).json({
        message: 'Gestur hefur verið fjarlægður af gestalista'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Viðburður ekki fundinn') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Villa við að fjarlægja gest af gestalista:', error);
        res.status(500).json({ error: 'Ekki tókst að fjarlægja gest af gestalista' });
    }
};