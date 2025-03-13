"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const attendeeRoutes_1 = __importDefault(require("./routes/attendeeRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/users', userRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/attendees', attendeeRoutes_1.default);
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const PORT = process.env.PORT || 5000;
app.listen({ port: PORT, host: hostname }, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
});
