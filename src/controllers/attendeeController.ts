import { AuthRequest } from '../middleware/authMiddleware.js';
import { Response } from 'express';
import prisma from '../prisma/prisma.js';

export const attendEvent = async (req: AuthRequest, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Notandi hefur ekki heimild' });
    return;
  }

  try {
    const existingAttendee = await prisma.eventAttendee.findUnique({
      where: { userId_eventId: { userId, eventId: Number(eventId) } },
    });

    if (existingAttendee) {
      res.status(400).json({ message: 'Nú þegar búið að skrá notanda á viðburð' });
      return;
    }

    await prisma.eventAttendee.create({
      data: { userId, eventId: Number(eventId) },
    });

    res.json({ message: 'Notandi hefur verið skráður á viðburð' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Villa kom upp við skráningu á viðburð' });
  }
};

export const getEventAttendees = async (req: AuthRequest, res: Response) => {
  const { eventId } = req.params;

  try {
    const attendees = await prisma.eventAttendee.findMany({
      where: { eventId: Number(eventId) },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    res.json(attendees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Villa við að sækja gestalista' });
  }
};