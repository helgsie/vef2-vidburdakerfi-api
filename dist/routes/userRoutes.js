import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validateAttendEvent, validateUpdateProfile } from '../middleware/validation.js';
const router = express.Router();
// Allir routes fyrir notanda krefjast auðkenningu
router.use(authenticate);
// Sækja prófíl notanda
router.get('/profile', userController.getUserProfile);
// Sækja viðburði sem notandi er skráður á
router.get('/events', userController.getUserAttendingEvents);
// Skrá notanda á viðburð
router.post('/events/:eventId/attend', validateAttendEvent, userController.attendEvent);
// Skrá notanda af viðburði
router.delete('/events/:eventId/attend', userController.cancelAttendance);
// Uppfæra prófíl notanda
router.patch('/profile', validateUpdateProfile, userController.updateUserProfile);
export default router;
//# sourceMappingURL=userRoutes.js.map