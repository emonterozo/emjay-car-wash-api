import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  it('GET / responds with 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
