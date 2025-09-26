const { validate, schemas } = require('../middleware/validation');

describe('Validation Middleware', () => {
  describe('User Validation', () => {
    test('Should validate user registration data', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '+1234567890'
      };

      const { error, value } = schemas.user.register.validate(validData);
      
      expect(error).toBeUndefined();
      expect(value.name).toBe(validData.name);
      expect(value.email).toBe(validData.email);
    });

    test('Should reject invalid user data', () => {
      const invalidData = {
        name: 'A', // Too short
        email: 'invalid-email',
        password: '123' // Too short
      };

      const { error } = schemas.user.register.validate(invalidData);
      
      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
    });

    test('Should validate user login data', () => {
      const validLoginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const { error } = schemas.user.login.validate(validLoginData);
      expect(error).toBeUndefined();
    });
  });

  describe('Product Validation', () => {
    test('Should validate product creation data', () => {
      const validProduct = {
        name: 'Test Product',
        description: 'This is a test product with enough description',
        category: 'Electronics',
        originalPrice: 99.99,
        discountPrice: 89.99,
        stock: 10,
        images: ['image1.jpg', 'image2.jpg']
      };

      const { error } = schemas.product.create.validate(validProduct);
      expect(error).toBeUndefined();
    });

    test('Should reject invalid product data', () => {
      const invalidProduct = {
        name: 'A', // Too short
        description: 'Short', // Too short
        originalPrice: -10, // Negative price
        stock: -5 // Negative stock
      };

      const { error } = schemas.product.create.validate(invalidProduct);
      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
    });
  });

  describe('Shop Validation', () => {
    test('Should validate shop creation data', () => {
      const validShop = {
        name: 'Test Shop',
        email: 'shop@example.com',
        password: 'password123',
        address: '123 Test Street, Test City',
        phoneNumber: '+1234567890',
        zipCode: '12345',
        description: 'This is a test shop description'
      };

      const { error } = schemas.shop.create.validate(validShop);
      expect(error).toBeUndefined();
    });
  });

  describe('Order Validation', () => {
    test('Should validate order creation data', () => {
      const validOrder = {
        cart: [
          {
            _id: '507f1f77bcf86cd799439011',
            name: 'Test Product',
            price: 99.99,
            qty: 2
          }
        ],
        shippingAddress: {
          country: 'USA',
          city: 'Test City',
          address1: '123 Test Street',
          zipCode: '12345',
          addressType: 'Home'
        },
        user: '507f1f77bcf86cd799439012',
        totalPrice: 199.98,
        paymentInfo: {
          type: 'Credit Card',
          status: 'Completed'
        }
      };

      const { error } = schemas.order.create.validate(validOrder);
      expect(error).toBeUndefined();
    });
  });

  describe('Middleware Function', () => {
    test('Should create validation middleware', () => {
      const middleware = validate(schemas.user.register);
      expect(typeof middleware).toBe('function');
    });
  });
});