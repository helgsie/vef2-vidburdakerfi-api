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
exports.deleteEvent = exports.createEventController = exports.getEventById = exports.getEvents = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const eventService_1 = require("../services/eventService");
const uuid_1 = require("uuid");
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma_1.default.event.findMany();
        res.json(events);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Villa við að sækja viðburði' });
    }
});
exports.getEvents = getEvents;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield prisma_1.default.event.findUnique({ where: { id: Number(id) } });
        if (!event) {
            res.status(404).json({ message: 'Viðburður ekki fundinn' });
            return;
        }
        res.json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Villa við að sækja viðburð' });
    }
});
exports.getEventById = getEventById;
const createEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titleEn, textEn, place, start, end } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Notandi er ekki með heimild til að búa til viðburði' });
            return;
        }
        const eventId = (0, uuid_1.v4)();
        const eventData = {
            eventId,
            titleEn,
            textEn,
            place,
            start: new Date(start),
            end: new Date(end),
            owner: req.user.id,
        };
        const event = yield (0, eventService_1.createEvent)(eventData);
        res.status(201).json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Villa við að búa til viðburð' });
    }
});
exports.createEventController = createEventController;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield prisma_1.default.event.findUnique({ where: { id: Number(id) } });
        if (!event) {
            res.status(404).json({ message: 'Viðburður ekki fundinn' });
            return;
        }
        if (!req.user || (event.owner !== req.user.id && !req.user.isAdmin)) {
            res.status(403).json({ message: 'Notandi hefur ekki heimild til að eyða viðburði' });
            return;
        }
        yield prisma_1.default.event.delete({ where: { id: Number(id) } });
        res.json({ message: 'Viðburði hefur verið eytt' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Villa við að eyða viðburði' });
    }
});
exports.deleteEvent = deleteEvent;
