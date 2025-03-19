import express from 'express';
import * as eventController from '../controllers/eventController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import imageUpload from '../middleware/imageUpload.js';

const router = express.Router();

/**
 * @route GET á /api/events
 * @desc Sækir alla viðburði
 * @access Allir
 */
router.get('/', eventController.getAllEvents);

/**
 * @route GET á /api/events/:eventId
 * @desc Sækir viðburð eftir id
 * @access Allir
 */
router.get('/:eventId', eventController.getEventById);

/** 
 * @route POST á /api/events
 * @desc Býr til nýjan viðburð
 * @access Einungis Admin
 */ 
router.post(
    '/', 
    authenticate, 
    requireAdmin, 
    imageUpload, 
    eventController.createEvent
);

/**
 * @route PUT á /api/events/:eventId
 * @desc Breytir viðburði
 * @access Einungis Admin
 */
router.put(
    '/:eventId', 
    authenticate, 
    requireAdmin, 
    imageUpload, 
    eventController.updateEvent
);

/**
 * @route DELETE á /api/events/:eventId
 * @desc Eyðir viðburði
 * @access Einungis Admin
 */
router.delete(
    '/:eventId',
    authenticate, 
    requireAdmin, 
    eventController.deleteEvent
);

/**
 * @route POST á /api/events/:eventId/attend
 * @desc Skrá notanda á gestalista viðburðs
 * @access Notandi/Admin
 */
router.post(
    '/:eventId/attend', 
    authenticate, 
    eventController.addAttendee
);
  
/**
 * @route DELETE á /api/events/:eventId/attend
 * @desc Eyðir gesti af gestalista viðburðs
 * @access Notandi/Admin
 */
router.delete(
    '/:eventId/attend',
    authenticate, 
    eventController.removeAttendee
);

/**
 * @route GET á /api/events/:eventId/attendees
 * @desc Sækir gestalista viðburðs
 * @access Einungis Admin
 */
router.get(
    '/:eventId/attendees',
    authenticate,
    requireAdmin,
    eventController.getEventAttendees
);

export default router;