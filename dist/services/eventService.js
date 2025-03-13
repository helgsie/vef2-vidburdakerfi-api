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
exports.signOutOfEvent = exports.signUpForEvent = exports.deleteEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const getAllEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.event.findMany();
});
exports.getAllEvents = getAllEvents;
const getEventById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.event.findUnique({ where: { id } });
});
exports.getEventById = getEventById;
const createEvent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.event.create({ data });
});
exports.createEvent = createEvent;
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.event.delete({ where: { id } });
});
exports.deleteEvent = deleteEvent;
const signUpForEvent = (eventId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.event.update({
        where: { id: eventId },
        data: { attendees: { connect: { id: userId } } },
    });
});
exports.signUpForEvent = signUpForEvent;
const signOutOfEvent = (eventId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.event.update({
        where: { id: eventId },
        data: { attendees: { disconnect: { id: userId } } },
    });
});
exports.signOutOfEvent = signOutOfEvent;
