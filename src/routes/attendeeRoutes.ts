import express from 'express';
import { attendEvent, getEventAttendees } from '../controllers/attendeeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:eventId', protect, attendEvent);
router.get('/:eventId', protect, getEventAttendees);

export default router;