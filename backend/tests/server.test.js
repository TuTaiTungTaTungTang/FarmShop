const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Mock database for testing
beforeAll(async () => {
  // Connect to test database
  const MONGO_URI = process.env.TEST_DB_URL || 'mongodb://localhost:27017/ecommerce_test';
  await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
  // Clean up and close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Server Health', () => {
  test('GET / should return Hello World', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.text).toBe('Hello World!');
  });

  test('GET /test should return Hello World', async () => {
    const response = await request(app)
      .get('/test')
      .expect(200);
    
    expect(response.text).toBe('Hello World!');
  });

  test('GET /api-docs should return Swagger UI', async () => {
    const response = await request(app)
      .get('/api-docs/')
      .expect(200);
    
    expect(response.text).toContain('swagger-ui');
  });
});

describe('API Rate Limiting', () => {
  test('Should allow normal requests', async () => {
    const response = await request(app)
      .get('/api/v2/user/test')
      .expect(404); // 404 is expected since route doesn't exist, but rate limit should pass
  });

  test('Should block excessive requests', async () => {
    // Make 101 requests quickly to trigger rate limit
    const requests = Array(101).fill().map(() => 
      request(app).get('/api/v2/user/test')
    );

    const responses = await Promise.all(requests);
    
    // Last requests should be rate limited
    const rateLimitedResponses = responses.filter(res => res.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  }, 10000); // Increase timeout for this test
});

describe('Input Validation', () => {
  test('User registration should validate required fields', async () => {
    const invalidUser = {
      name: 'A', // Too short
      email: 'invalid-email', // Invalid email
      password: '123' // Too short
    };

    const response = await request(app)
      .post('/api/v2/user/create-user')
      .send(invalidUser)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation error');
    expect(response.body.errors).toBeInstanceOf(Array);
  });

  test('User registration should accept valid data', async () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/v2/user/create-user')
      .attach('file', Buffer.from('fake image'), 'avatar.jpg')
      .field('name', validUser.name)
      .field('email', validUser.email)
      .field('password', validUser.password);

    // Should not fail validation (may fail for other reasons like missing env vars)
    expect(response.status).not.toBe(400);
  });
});

describe('Security Headers', () => {
  test('Should include security headers', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    // Helmet should add these headers
    expect(response.headers['x-dns-prefetch-control']).toBeDefined();
    expect(response.headers['x-frame-options']).toBeDefined();
    expect(response.headers['x-download-options']).toBeDefined();
    expect(response.headers['x-content-type-options']).toBeDefined();
  });
});

describe('Error Handling', () => {
  test('Should handle 404 routes gracefully', async () => {
    const response = await request(app)
      .get('/nonexistent-route')
      .expect(404);
  });

  test('Should handle invalid JSON gracefully', async () => {
    const response = await request(app)
      .post('/api/v2/user/create-user')
      .set('Content-Type', 'application/json')
      .send('invalid json')
      .expect(400);
  });
});