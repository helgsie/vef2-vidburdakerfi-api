import express from 'express';
import * as authController from '../controllers/authController.js';
const router = express.Router();
/**
 * @route POST á /api/auth/signup
 * @desc Nýskrá notanda
 * @access Allir
 */
router.post('/signup', authController.signup);
/**
 * @route POST á /api/auth/login
 * @desc Auðkenna notanda og fá token
 * @access Allir
 */
router.post('/login', authController.login);
export default router;
//# sourceMappingURL=authRoutes.js.map