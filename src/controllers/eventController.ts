import { AuthRequest } from '../middleware/authMiddleware.js';
import { Request, Response } from 'express';
import prisma from '../prisma/prisma.js';
import { createEvent } from '../services/eventService.js';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '../cloudinaryConfig.js';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Villa við að sækja viðburði' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({ where: { id: Number(id) } });

    if (!event) {
      res.status(404).json({ message: 'Viðburður ekki fundinn' });
      return;
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Villa við að sækja viðburð' });
  }
};

export const createEventController = async (req: AuthRequest, res: Response) => {
  const { titleEn, textEn, place, start, end } = req.body;

  try {
    if (!req.user) {
        res.status(401).json({ message: 'Notandi er ekki með heimild til að búa til viðburði' });
        return;
    }

    let imageUrl = null;

    if (req.file) {
        const uploadedImage = await cloudinary.uploader.upload(
            req.file.path, {
                folder: 'event_images',
                transformation: [{ width: 800, height: 600, crop: 'limit' }],
            }
        );
        imageUrl = uploadedImage.secure_url;
    }

    const eventId = uuidv4();

    const eventData = {
        eventId,
        titleEn,
        textEn,
        place,
        start: new Date(start),
        end: new Date(end),
        owner: req.user.id,
        image: imageUrl,
    };

    const event = await createEvent(eventData);

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Villa við að búa til viðburð' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({ where: { id: Number(id) } });

    if (!event) {
      res.status(404).json({ message: 'Viðburður ekki fundinn' });
      return;
    }

    if (!req.user || (event.owner !== req.user.id && !req.user.isAdmin)) {
      res.status(403).json({ message: 'Notandi hefur ekki heimild til að eyða viðburði' });
      return;
    }

    await prisma.event.delete({ where: { id: Number(id) } });

    res.json({ message: 'Viðburði hefur verið eytt' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Villa við að eyða viðburði' });
  }
};