"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventAttendees = exports.attendEvent = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const attendEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { eventId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: 'Notandi hefur ekki heimild' });
        return;
    }
    try {
        const existingAttendee = yield prisma_1.default.eventAttendee.findUnique({
            where: { userId_eventId: { userId, eventId: Number(eventId) } },
        });
        if (existingAttendee) {
            res.status(400).json({ message: 'Nú þegar búið að skrá notanda á viðburð' });
            return;
        }
        yield prisma_1.default.eventAttendee.create({
            data: { userId, eventId: Number(eventId) },
        });
        res.json({ message: 'Notandi hefur verið skráður á viðburð' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Villa kom upp við skráningu á viðburð' });
    }
});
exports.attendEvent = attendEvent;
const getEventAttendees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        const attendees = yield prisma_1.default.eventAttendee.findMany({
            where: { eventId: Number(eventId) },
            include: { user: { select: { id: true, email: true, name: true } } },
        });
        res.json(attendees);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Villa við að sækja gestalista' });
    }
});
exports.getEventAttendees = getEventAttendees;
