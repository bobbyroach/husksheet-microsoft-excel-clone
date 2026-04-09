import request from 'supertest';
import express from 'express';
import Routes from './routes';
import * as dao from './dao';
import { getUsername } from './users/authenticate';

jest.mock('./dao');
jest.mock('./users/authenticate');

const app = express();
Routes(app);

describe('API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/v1/getPublishers - success', async () => {
        dao.getPublishers.mockResolvedValue([{ publisherName: 'Publisher1' }]);
        getUsername.mockImplementation((req, res) => {});

        const response = await request(app).get('/api/v1/getPublishers');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.value).toEqual([
            { publisher: 'Publisher1', sheet: null, id: null, payload: null }
        ]);
    });

    test('GET /api/v1/getPublishers - error', async () => {
        dao.getPublishers.mockRejectedValue(new Error('Test error'));

        const response = await request(app).get('/api/v1/getPublishers');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/Internal Server Error/);
    });

    test('POST /api/v1/getSheets - success', async () => {
        dao.getSheets.mockResolvedValue([{ sheetName: 'Sheet1' }]);

        const response = await request(app)
            .post('/api/v1/getSheets')
            .send({ publisher: 'Publisher1' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.value).toEqual([
            { publisher: 'Publisher1', sheet: 'Sheet1', id: null, payload: null }
        ]);
    });

    test('POST /api/v1/getSheets - error', async () => {
        dao.getSheets.mockRejectedValue(new Error('Test error'));

        const response = await request(app)
            .post('/api/v1/getSheets')
            .send({ publisher: 'Publisher1' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/Internal Server Error/);
    });

    test('DELETE /api/v1/deleteSheet - success', async () => {
        dao.deleteSheet.mockResolvedValue(true);

        const response = await request(app)
            .delete('/api/v1/deleteSheet')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('DELETE /api/v1/deleteSheet - error', async () => {
        dao.deleteSheet.mockRejectedValue(new Error('Test error'));

        const response = await request(app)
            .delete('/api/v1/deleteSheet')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/Internal Server Error/);
    });

    test('POST /api/v1/createSheet - success', async () => {
        dao.createSheet.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/v1/createSheet')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Sheet Created');
    });

    test('POST /api/v1/createSheet - error', async () => {
        dao.createSheet.mockRejectedValue(new Error('Test error'));

        const response = await request(app)
            .post('/api/v1/createSheet')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(500);
        expect(response.text).toMatch(/Internal Server Error/);
    });

    test('POST /api/v1/getUpdatesForSubscriptions - success', async () => {
        dao.getUpdatesForSubscriptions.mockResolvedValue([{ updateId: 1, updateContent: 'Content' }]);

        const response = await request(app)
            .post('/api/v1/getUpdatesForSubscriptions')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.value).toEqual([
            { publisher: 'Publisher1', sheet: 'Sheet1', id: 1, payload: 'Content' }
        ]);
    });

    test('POST /api/v1/getUpdatesForSubscriptions - error', async () => {
        dao.getUpdatesForSubscriptions.mockRejectedValue(new Error('Test error'));

        const response = await request(app)
            .post('/api/v1/getUpdatesForSubscriptions')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(500);
        expect(response.text).toMatch(/Internal Server Error/);
    });

    test('POST /api/v1/getUpdatesForPublished - success', async () => {
        dao.getUpdatesForPublished.mockResolvedValue([{ updateId: 1, updateContent: 'Content' }]);

        const response = await request(app)
            .post('/api/v1/getUpdatesForPublished')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.value).toEqual([
            { publisher: 'Publisher1', sheet: 'Sheet1', id: 1, payload: 'Content' }
        ]);
    });

    test('POST /api/v1/getUpdatesForPublished - error', async () => {
        dao.getUpdatesForPublished.mockRejectedValue(new Error('Test error'));

        const response = await request(app)
            .post('/api/v1/getUpdatesForPublished')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1' });

        expect(response.status).toBe(500);
        expect(response.text).toMatch(/Internal Server Error/);
    });

    test('POST /api/v1/updatePublished - success', async () => {
        dao.updatePublished.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/v1/updatePublished')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1', payload: 'Payload' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('POST /api/v1/updatePublished - error', async () => {
        dao.updatePublished.mockRejectedValue(new Error('Test error'));

        const response = await request(app)
            .post('/api/v1/updatePublished')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1', payload: 'Payload' });

        expect(response.status).toBe(500);
        expect(response.text).toMatch(/Internal Server Error/);
    });

    test('POST /api/v1/updateSubscription - success', async () => {
        dao.updateSubscription.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/v1/updateSubscription')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1', payload: 'Payload' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('POST /api/v1/updateSubscription - error', async () => {
        dao.updateSubscription.mockRejectedValue(new Error('Test error'));

        const response = await request(app)
            .post('/api/v1/updateSubscription')
            .send({ publisher: 'Publisher1', sheet: 'Sheet1', payload: 'Payload' });

        expect(response.status).toBe(500);
        expect(response.text).toMatch(/Internal Server Error/);
    });

    test('GET /api/v1/test - success', async () => {
        const response = await request(app).get('/api/v1/test');

        expect(response.status).toBe(200);
        expect(response.text).toBe('test123');
    });
});