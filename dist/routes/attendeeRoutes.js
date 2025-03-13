"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendeeController_1 = require("../controllers/attendeeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/:eventId', authMiddleware_1.protect, attendeeController_1.attendEvent);
router.get('/:eventId', authMiddleware_1.protect, attendeeController_1.getEventAttendees);
exports.default = router;
