import { Request, Response, NextFunction } from 'express';
export declare class ValidationError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare class AuthenticationError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare class AuthorizationError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare class NotFoundError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const rateLimitHandler: (req: Request, res: Response) => void;
export declare const sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
export declare const securityHeadersMiddleware: (req: Request, res: Response, next: NextFunction) => void;
