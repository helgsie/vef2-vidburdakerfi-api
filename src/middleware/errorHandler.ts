import { Request, Response, NextFunction } from 'express';

// Flokkum villumeldingar í flokka 400-404
export class ValidationError extends Error {
    statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

export class AuthenticationError extends Error {
    statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

export class AuthorizationError extends Error {
    statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = 'AuthorizationError';
        this.statusCode = 403;
    }
}

export class NotFoundError extends Error {
    statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

// Víðvær villumelding
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    
    // Meðhöndlum á skilgreindum villum 400-404
    if (err instanceof ValidationError || 
        err instanceof AuthenticationError || 
        err instanceof AuthorizationError ||
        err instanceof NotFoundError) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message
        });
    }
    
    // Meðhöndlun á Prisma villum
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err as any;
        
        // P2002: "Unique constraint violation"
        if (prismaError.code === 'P2002') {
            return res.status(409).json({
                error: 'Conflict',
                message: `Gögn með þetta ${prismaError.meta?.target || 'field'} eru þegar til.`
            });
        }
        
        // P2025: "Record not found"
        if (prismaError.code === 'P2025') {
            return res.status(404).json({
                error: 'NotFound',
                message: 'Umbeðin gögn fundust ekki.'
            });
        }
    }
    
    // Senda frekari upplýsingar fyrir ómeðhöndlaðar villur í development
    if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
        error: err.name,
        message: err.message,
        stack: err.stack
        });
    }
    
    // Senda almenna villumeldingu fyrir production
    return res.status(500).json({
        error: 'InternalServerError',
        message: 'Eitthvað fór úrskeiðis. Vinsamlegast reyndu aftur síðar.'
    });
};

// 404 villumelding fyrir óskilgreind routes
export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({
    error: 'NotFound',
    message: 'Umbeðin gögn fundust ekki'
  });
};

// Villumelding fyrir of margar fyrirspurnir á stuttum tíma
export const rateLimitHandler = (req: Request, res: Response) => {
  return res.status(429).json({
    error: 'TooManyRequests',
    message: 'Of margar fyrirspurnir, vinsamlegast reyndu aftur síðar'
  });
};

// Hreinsun á innslegnum gögnum af öryggisástæðum
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body) {
            Object.keys(req.body).forEach(key => {
                if (typeof req.body[key] === 'string') {
                    // Hreinsun á strengjainntökum
                    req.body[key] = req.body[key]
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/javascript:/gi, '')
                        .replace(/onerror=/gi, '')
                        .replace(/onload=/gi, '');
                }
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

// Verndun gegn XSS árásum
export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
};