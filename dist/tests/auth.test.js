import request from 'supertest';
import app from '../app.js';
import { setupTestDb, teardownTestDb } from './setup.js';
beforeAll(async () => {
    await setupTestDb();
});
afterAll(async () => {
    await teardownTestDb();
});
describe('Authentication API', () => {
    describe('POST /api/auth/signup', () => {
        it('ætti að nýskrá notanda', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                email: 'newuser@test.com',
                name: 'Nýr notandi',
                password: 'Lykilord123'
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', 'newuser@test.com');
            expect(response.body.user).toHaveProperty('name', 'New User');
            expect(response.body.user).not.toHaveProperty('password'); // Lykilorði á ekki að vera skilað
        });
        it('ætti að hafna nýskráningu fyrir ógilt netfang', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                email: 'ekkinetfang',
                name: 'Ógildur notandi',
                password: 'Lykilord123'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
        it('ætti að hafna nýskráningu fyrir of stutt lykilorð', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                email: 'shortpass@test.com',
                name: 'Stuttur notandi',
                password: 'short'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
    describe('POST /api/auth/login', () => {
        it('ætti að innskrá notanda sem er þegar til', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'user@test.com',
                password: 'Notandi123'
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', 'user@test.com');
        });
        it('ætti að innskrá admin', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'admin@test.com',
                password: 'Admin123'
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('isAdmin', true);
        });
        it('ætti að hafna innskráningu fyrir rangt lykilorð', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'user@test.com',
                password: 'rangtlykilord'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });
        it('ætti að hafna innskráningu fyrir netfang sem er ekki til', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@test.com',
                password: 'Notandi123'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });
    });
});
//# sourceMappingURL=auth.test.js.map