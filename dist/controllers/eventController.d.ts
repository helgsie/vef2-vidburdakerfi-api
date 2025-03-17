import { Request, Response } from 'express';
export declare const getAllEvents: (req: Request, res: Response) => Promise<void>;
export declare const getEventById: (req: Request, res: Response) => Promise<void>;
export declare const createEvent: (req: Request, res: Response) => Promise<void>;
export declare const updateEvent: (req: Request, res: Response) => Promise<void>;
export declare const deleteEvent: (req: Request, res: Response) => Promise<void>;
export declare const addAttendee: (req: Request, res: Response) => Promise<void>;
export declare const removeAttendee: (req: Request, res: Response) => Promise<void>;
