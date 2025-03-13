import express from 'express';
import { getEvents, createEvent, getEventById, deleteEvent } from '../controllers/eventController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getEvents);
router.post('/', protect, createEvent);
router.get('/:id', getEventById);
router.delete('/:id', protect, admin, deleteEvent);

export default router;