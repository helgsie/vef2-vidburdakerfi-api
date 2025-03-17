import request from 'supertest';
import app from '../app.js';
import { setupTestDb, teardownTestDb } from './setup.js';
import { loginAsAdmin, loginAsUser, createTestEvent } from './testUtils.js';

let adminToken: string;
let userToken: string;
let testEventId: string;

beforeAll(async () => {
    await setupTestDb();
    const adminLogin = await loginAsAdmin();
    const userLogin = await loginAsUser();
    adminToken = adminLogin.token;
    userToken = userLogin.token;
    const event = await createTestEvent(adminToken);
    testEventId = event.eventId;
});

afterAll(async () => {
    await teardownTestDb();
});

describe('Events API', () => {
    describe('GET /api/events', () => {
        it('ætti að skila viðburðum án auðkenningar', async () => {
        const response = await request(app).get('/api/events');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /api/events', () => {
        it('ætti að búa til nýjan viðburð sem admin', async () => {
            const eventData = {
                titleEn: 'Prufuviðburður',
                textEn: 'Þetta er texti um prufuviðburð',
                place: 'Prufustaðsetning',
                city: 'Prufuborg',
                start: new Date().toISOString(),
                end: new Date(Date.now() + 86400000).toISOString(), // Einum degi seinna
                active: true
            };
            const response = await request(app)
                .post('/api/events')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(eventData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('eventId');
            expect(response.body).toHaveProperty('titleEn', eventData.titleEn);
            
            // Vista ID viðburðs fyrir aðrar prófanir
            testEventId = response.body.eventId;
        });

        it('ætti að hafna stofnun viðburða fyrir non-admin notendur', async () => {
            const eventData = {
                titleEn: 'Óheimill viðburður',
                textEn: 'Þessi viðburður á ekki að verða til',
                start: new Date().toISOString()
            };
            const response = await request(app)
                .post('/api/events')
                .set('Authorization', `Bearer ${userToken}`)
                .send(eventData);
            expect(response.status).toBe(403);
        });

        it('ætti að hafna stofnun viðburðar án auðkenningar', async () => {
            const eventData = {
                titleEn: 'Óauðkenndur viðburður',
                textEn: 'Þessi viðburður á ekki að verða til',
                start: new Date().toISOString()
            };
            const response = await request(app)
                .post('/api/events')
                .send(eventData);
            expect(response.status).toBe(401);
        });
        
        it('ætti að staðfesta upplýsingar um viðburð', async () => {
            const invalidEventData = {
                // Titil vantar
                textEn: 'Þetta er prufuviðburður sem skortir titil',
                start: 'rangt-snidmat-dagsetningar'
            };
            const response = await request(app)
                .post('/api/events')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidEventData);
            expect(response.status).toBe(400);
        });
    });
    
    describe('GET /api/events/:eventId', () => {
        it('ætti að sækja ákveðinn viðburð út frá ID', async () => {
            const response = await request(app)
                .get(`/api/events/${testEventId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('eventId', testEventId);
        });
        
        it('ætti að skila 404 fyrir viðburð sem er ekki til', async () => {
            const response = await request(app)
                .get('/api/events/id-sem-er-ekki-til')
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(404);
        });
    });
    
    describe('PUT /api/events/:eventId', () => {
        it('ætti að uppfæra viðburð sem admin', async () => {
            const updateData = {
                titleEn: 'Uppfærður prufuviðburður',
                textEn: 'Þetta er uppfærður texti'
            };
            const response = await request(app)
                .put(`/api/events/${testEventId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('titleEn', updateData.titleEn);
        });
        
        it('ætti að hafna uppfærslum frá non-admin notendum', async () => {
            const updateData = {
                titleEn: 'Óheimiluð uppfærsla',
            };
            const response = await request(app)
                .put(`/api/events/${testEventId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);
            expect(response.status).toBe(403);
        });
        
        it('ætti að hafna uppfærslu án auðkenningar', async () => {
            const updateData = {
                titleEn: 'Óauðkennd uppfærsla',
            };
            const response = await request(app)
                .put(`/api/events/${testEventId}`)
                .send(updateData);
            expect(response.status).toBe(401);
        });
    });
    
    describe('DELETE /api/events/:eventId', () => {
        it('ætti að hafna eyðslu viðburðs fyrir non-admin notendur', async () => {
            const response = await request(app)
                .delete(`/api/events/${testEventId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(403);
        });
        
        it('ætti að eyða viðburði sem admin', async () => {
            const response = await request(app)
                .delete(`/api/events/${testEventId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.status).toBe(200);
            
            // Staðfesta að viðburði hafi verið eytt
            const getResponse = await request(app)
                .get(`/api/events/${testEventId}`);
            expect(getResponse.status).toBe(404);
        });
    });
    
    describe('POST /api/events/:eventId/attend', () => {
        let newEventId: string;
        
        beforeAll(async () => {
            // Búa til nýjan prufuviðburð fyrir prufur á gestalista
            const event = await createTestEvent(adminToken);
            newEventId = event.eventId;
        });
        
        it('ætti að leyfa auðkenndum notendum að skrá sig á viðburð', async () => {
            const response = await request(app)
                .post(`/api/events/${newEventId}/attend`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(201);
        });
        
        it('ætti að hafna skráningu á viðburð án auðkenningu', async () => {
            const response = await request(app)
                .post(`/api/events/${newEventId}/attend`);
            expect(response.status).toBe(401);
        });
        
        it('ætti að koma í veg fyrir skráningu sama notanda oftar en einu sinni', async () => {
            const response = await request(app)
                .post(`/api/events/${newEventId}/attend`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(409);
        });
        
        it('ætti að leyfa notanda að afskrá sig af viðburði', async () => {
            const response = await request(app)
                .delete(`/api/events/${newEventId}/attend`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(200);
            
            // Staðfesta afskráningu
            const attendeesResponse = await request(app)
                .get(`/api/events/${newEventId}/attendees`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(attendeesResponse.status).toBe(200);
            expect(attendeesResponse.body).toHaveLength(0);
        });
    });
    
    describe('GET /api/events/:eventId/attendees', () => {
        let eventWithAttendeesId: string;
        
        beforeAll(async () => {
        // Búa til nýjan prufuviðburð og skrá mætingu
        const event = await createTestEvent(adminToken);
        eventWithAttendeesId = event.eventId;
        
        await request(app)
            .post(`/api/events/${eventWithAttendeesId}/attend`)
            .set('Authorization', `Bearer ${userToken}`);
        });
        
        it('ætti að leyfa admins að sjá gestalista', async () => {
        const response = await request(app)
            .get(`/api/events/${eventWithAttendeesId}/attendees`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        });
        
        it('ætti að hafna aðgangi að gestalista fyrir non-admin notanda', async () => {
        const response = await request(app)
            .get(`/api/events/${eventWithAttendeesId}/attendees`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.status).toBe(403);
        });
        
        it('ætti að hafna aðgangi að gestalista án auðkenningar', async () => {
        const response = await request(app)
            .get(`/api/events/${eventWithAttendeesId}/attendees`);
        expect(response.status).toBe(401);
        });
    });
});