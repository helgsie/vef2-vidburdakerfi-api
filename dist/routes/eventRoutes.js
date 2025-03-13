"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', eventController_1.getEvents);
router.post('/', authMiddleware_1.protect, eventController_1.createEventController);
router.get('/:id', eventController_1.getEventById);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, eventController_1.deleteEvent);
exports.default = router;
