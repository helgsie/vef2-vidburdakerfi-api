import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import attendeeRoutes from './routes/attendeeRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendees', attendeeRoutes);

const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const PORT = process.env.PORT || 5000;

app.listen({ port: PORT, host: hostname }, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});