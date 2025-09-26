// Test setup file
require('dotenv').config({ path: './config/.env' });

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET_KEY = 'test-jwt-secret';
process.env.DB_URL = process.env.TEST_DB_URL || 'mongodb://localhost:27017/ecommerce_test';