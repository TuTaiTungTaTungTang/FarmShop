const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Vendor E-Commerce API',
      version: '1.0.0',
      description: 'A comprehensive multi-vendor e-commerce platform API with user management, shop management, products, orders, events, and real-time messaging.',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000/api/v2',
        description: 'Development server',
      },
      {
        url: 'https://backend-26sf.onrender.com/api/v2',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User unique identifier',
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 50,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password (hashed)',
              minLength: 6,
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number',
            },
            addresses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  country: { type: 'string' },
                  city: { type: 'string' },
                  address1: { type: 'string' },
                  address2: { type: 'string' },
                  zipCode: { type: 'string' },
                  addressType: { 
                    type: 'string',
                    enum: ['Home', 'Office', 'Other'],
                  },
                },
              },
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
            },
            avatar: {
              type: 'object',
              properties: {
                public_id: { type: 'string' },
                url: { type: 'string' },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Shop: {
          type: 'object',
          required: ['name', 'email', 'password', 'address', 'phoneNumber', 'zipCode'],
          properties: {
            _id: { type: 'string' },
            name: { 
              type: 'string',
              minLength: 2,
              maxLength: 100,
            },
            email: { 
              type: 'string',
              format: 'email',
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
            },
            address: { type: 'string' },
            phoneNumber: { type: 'string' },
            zipCode: { type: 'string' },
            avatar: {
              type: 'object',
              properties: {
                public_id: { type: 'string' },
                url: { type: 'string' },
              },
            },
            role: {
              type: 'string',
              default: 'seller',
            },
            availableBalance: {
              type: 'number',
              default: 0,
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          required: ['name', 'description', 'category', 'originalPrice', 'stock', 'shopId'],
          properties: {
            _id: { type: 'string' },
            name: { 
              type: 'string',
              minLength: 2,
              maxLength: 200,
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 2000,
            },
            category: { type: 'string' },
            tags: { type: 'string' },
            originalPrice: { 
              type: 'number',
              minimum: 0,
            },
            discountPrice: { 
              type: 'number',
              minimum: 0,
            },
            stock: { 
              type: 'number',
              minimum: 0,
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  public_id: { type: 'string' },
                  url: { type: 'string' },
                },
              },
            },
            shopId: { type: 'string' },
            shop: { $ref: '#/components/schemas/Shop' },
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'object' },
                  rating: { type: 'number', minimum: 1, maximum: 5 },
                  comment: { type: 'string' },
                  productId: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            ratings: { type: 'number' },
            sold_out: { type: 'number', default: 0 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          required: ['cart', 'shippingAddress', 'user', 'totalPrice', 'paymentInfo'],
          properties: {
            _id: { type: 'string' },
            cart: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  qty: { type: 'number' },
                  image: { type: 'string' },
                },
              },
            },
            shippingAddress: {
              type: 'object',
              properties: {
                country: { type: 'string' },
                city: { type: 'string' },
                address1: { type: 'string' },
                address2: { type: 'string' },
                zipCode: { type: 'string' },
                addressType: { type: 'string' },
              },
            },
            user: { $ref: '#/components/schemas/User' },
            totalPrice: { type: 'number' },
            status: {
              type: 'string',
              enum: ['Processing', 'Transferred to delivery partner', 'Shipping', 'On the way', 'Delivered'],
              default: 'Processing',
            },
            paymentInfo: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                status: { type: 'string' },
                type: { type: 'string' },
              },
            },
            paidAt: { type: 'string', format: 'date-time' },
            deliveredAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Event: {
          type: 'object',
          required: ['name', 'description', 'category', 'start_Date', 'Finish_Date', 'originalPrice', 'discountPrice', 'stock'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            start_Date: { type: 'string', format: 'date-time' },
            Finish_Date: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['Running', 'Ended', 'Coming soon'],
            },
            originalPrice: { type: 'number' },
            discountPrice: { type: 'number' },
            stock: { type: 'number' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  public_id: { type: 'string' },
                  url: { type: 'string' },
                },
              },
            },
            shopId: { type: 'string' },
            shop: { $ref: '#/components/schemas/Shop' },
            sold_out: { type: 'number', default: 0 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false,
            },
            message: {
              type: 'string',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: true,
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./controller/*.js'], // Path to the API files
};

const specs = swaggerJsDoc(options);

module.exports = {
  specs,
  swaggerUi,
};