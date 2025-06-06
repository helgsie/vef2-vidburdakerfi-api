import app from '../app.js';
import request from 'supertest';

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        isAdmin: boolean;
    };
}

export const loginAsAdmin = async (): Promise<LoginResponse> => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@test.com',
            password: 'Admin123'
        });

    return response.body as LoginResponse;
};

export const loginAsUser = async (): Promise<LoginResponse> => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'user@test.com',
            password: 'Notandi123'
        });

    return response.body as LoginResponse;
};

// Búa til gervi viðburð (sem admin)
export const createTestEvent = async (adminToken: string) => {
    const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            titleEn: 'Prufuviðburður',
            textEn: 'Þetta er prufuviðburður',
            place: 'Prufustaðsetning',
            start: new Date().toISOString(),
            end: new Date(Date.now() + 86400000).toISOString(), // Einum degi seinna
            active: true
        });

    return response.body;
};