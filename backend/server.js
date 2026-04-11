const express = require("express");
const ErrorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");
// const logger = require("./utils/logger"); // Tạm comment để test QR system
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const allowedOrigins = [
  "https://agritechsolution.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests and tools that do not send Origin
    if (!origin) return callback(null, true);

    const isExplicitAllowed = allowedOrigins.includes(origin);
    const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

    if (isExplicitAllowed || isVercelPreview) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
// connect db (skip when running tests so Jest can control lifecycle)
if (process.env.NODE_ENV !== "test") {
  connectDatabase();
}

// Enable CORS early so preflight and limited endpoints always include CORS headers
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "PRODUCTION",
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting - chống DDoS và brute force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Quá nhiều request, vui lòng thử lại sau." },
});

// Strict limit cho auth routes - chống brute force đăng nhập
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Quá nhiều lần đăng nhập, vui lòng thử lại sau 15 phút." },
});

// Registration/reset routes are less sensitive than login, avoid blocking normal users too aggressively
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Bạn đang gửi quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau." },
});

app.use("/api/", apiLimiter);
app.use("/api/v2/user/login-user", authLimiter);
app.use("/api/v2/user/create-user", signupLimiter);
app.use("/api/v2/user/forgot-password", signupLimiter);
app.use("/api/v2/shop/login-shop", authLimiter);
app.use("/api/v2/shop/create-shop", signupLimiter);

let server;

// create server (avoid opening a real port in test mode)
if (process.env.NODE_ENV !== "test") {
  server = app.listen(process.env.PORT, () => {
    console.log(`✅ Server is running on http://localhost:${process.env.PORT}`);
  });
}

// DEV: print mounted routes for debugging only when explicitly enabled
if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'test' &&
  process.env.ENABLE_DEBUG_ROUTES === 'true'
) {
  const listRoutes = () => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
        routes.push(`${methods} ${middleware.route.path}`);
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        // router middleware
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          if (route) {
            const methods = Object.keys(route.methods).join(',').toUpperCase();
            routes.push(`${methods} ${route.path}`);
          }
        });
      }
    });
    console.log('DEV mounted routes:');
    routes.forEach(r => console.log('  ', r));
  };

  // print once after a short delay to allow routes to be registered
  setTimeout(listRoutes, 500);

  app.get('/__routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
        routes.push({ methods, path: middleware.route.path });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          if (route) {
            const methods = Object.keys(route.methods).join(',').toUpperCase();
            routes.push({ methods, path: route.path });
          }
        });
      }
    });
    res.json({ routes });
  });
}

// middlewares
app.use(express.json());
app.use(cookieParser());

// Logging middleware (after body parser) - Tạm comment
// if (process.env.NODE_ENV !== 'production') {
//   const morgan = require('morgan');
//   app.use(morgan('combined', { stream: logger.stream }));
// }

app.use("/", express.static("uploads"));

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// why bodyparser?
// bodyparser is used to parse the data from the body of the request to the server (POST, PUT, DELETE, etc.)

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Swagger Documentation
const { specs, swaggerUi } = require('./config/swagger');
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "farm",
  }));
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (process.env.NODE_ENV !== 'production') {
  app.get("/api-docs.json", (req, res) => {
    res.json(specs);
  });
}

// routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const message = require("./controller/message");
const conversation = require("./controller/conversation");
const withdraw = require("./controller/withdraw");
app.use("/api/v2/withdraw", withdraw);

// end points
app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);

// it'for errhendel
app.use(ErrorHandler);

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling UNCAUGHT EXCEPTION! 💥`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

module.exports = app;
