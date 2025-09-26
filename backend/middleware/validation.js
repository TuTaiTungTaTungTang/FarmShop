const Joi = require('joi');
const logger = require('../utils/logger');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    addresses: Joi.array().items(Joi.object({
      country: Joi.string().required(),
      city: Joi.string().required(),
      address1: Joi.string().required(),
      address2: Joi.string().optional(),
      zipCode: Joi.string().required(),
      addressType: Joi.string().valid('Home', 'Office', 'Other').required(),
    })).optional(),
  }),
};

// Shop validation schemas
const shopSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    description: Joi.string().min(10).max(1000).optional(),
    address: Joi.string().min(5).max(200).required(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    zipCode: Joi.string().min(3).max(10).required(),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    address: Joi.string().min(5).max(200).optional(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    zipCode: Joi.string().min(3).max(10).optional(),
  }),
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    category: Joi.string().required(),
    tags: Joi.string().optional(),
    originalPrice: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).optional(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().min(1).required(),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    category: Joi.string().optional(),
    tags: Joi.string().optional(),
    originalPrice: Joi.number().min(0).optional(),
    discountPrice: Joi.number().min(0).optional(),
    stock: Joi.number().integer().min(0).optional(),
  }),
};

// Event validation schemas
const eventSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    category: Joi.string().required(),
    start_Date: Joi.date().iso().required(),
    Finish_Date: Joi.date().iso().min(Joi.ref('start_Date')).required(),
    status: Joi.string().valid('Running', 'Ended', 'Coming soon').optional(),
    originalPrice: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().min(1).required(),
  }),
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    cart: Joi.array().items(Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().min(0).required(),
      qty: Joi.number().integer().min(1).required(),
    })).min(1).required(),
    shippingAddress: Joi.object({
      country: Joi.string().required(),
      city: Joi.string().required(),
      address1: Joi.string().required(),
      address2: Joi.string().optional(),
      zipCode: Joi.string().required(),
      addressType: Joi.string().required(),
    }).required(),
    user: Joi.string().required(),
    totalPrice: Joi.number().min(0).required(),
    paymentInfo: Joi.object({
      id: Joi.string().optional(),
      status: Joi.string().optional(),
      type: Joi.string().required(),
    }).required(),
  }),
};

// Coupon validation schemas
const couponSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    value: Joi.number().min(1).max(100).required(),
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().min(0).optional(),
    selectedProduct: Joi.string().optional(),
  }),
};

// Withdraw validation schemas
const withdrawSchemas = {
  create: Joi.object({
    amount: Joi.number().min(1).required(),
  }),

  update: Joi.object({
    status: Joi.string().valid('Processing', 'succeed', 'rejected').required(),
  }),
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn(`Validation error: ${JSON.stringify(errorMessages)}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
      });

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages,
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Export schemas and middleware
module.exports = {
  validate,
  schemas: {
    user: userSchemas,
    shop: shopSchemas,
    product: productSchemas,
    event: eventSchemas,
    order: orderSchemas,
    coupon: couponSchemas,
    withdraw: withdrawSchemas,
  },
};