import app from '../app.js';
import request from 'supertest';
export const loginAsAdmin = async () => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
        email: 'admin@test.com',
        password: 'Admin123'
    });
    return response.body;
};
export const loginAsUser = async () => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
        email: 'user@test.com',
        password: 'Notandi123'
    });
    return response.body;
};
// Búa til gervi viðburð (sem admin)
export const createTestEvent = async (adminToken) => {
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
//# sourceMappingURL=testUtils.js.map