import express from 'express';
import { getEvents, createEventController, getEventById, deleteEvent } from '../controllers/eventController';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/', getEvents);
router.post('/', protect, upload.single('image'), createEventController);
router.get('/:id', getEventById);
router.delete('/:id', protect, admin, deleteEvent);

export default router;