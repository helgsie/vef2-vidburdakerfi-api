import { Request, Response, NextFunction } from 'express';
export declare const getUserProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserAttendingEvents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const attendEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelAttendance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUserProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
