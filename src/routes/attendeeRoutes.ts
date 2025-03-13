import express from 'express';
import { attendEvent, getEventAttendees } from '../controllers/attendeeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:eventId', protect, attendEvent);
router.get('/:eventId', protect, getEventAttendees);

export default router;