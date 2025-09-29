const express = require("express");
const ErrorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");
// const logger = require("./utils/logger"); // Tạm comment để test QR system
// const helmet = require("helmet"); // Tạm comment
// const rateLimit = require("express-rate-limit"); // Tạm comment
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
// connect db
connectDatabase();

// Security middleware - Tạm comment để test QR system
// app.use(helmet({
//   contentSecurityPolicy: false, // Disable CSP for development
//   crossOriginEmbedderPolicy: false
// }));

// Rate limiting - Tạm comment
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     error: "Too many requests from this IP, please try again later."
//   }
// });
// app.use('/api/', limiter);

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running on http://localhost:${process.env.PORT}`);
});

// middlewares
app.use(express.json());
app.use(cookieParser());

// Logging middleware (after body parser) - Tạm comment
// if (process.env.NODE_ENV !== 'production') {
//   const morgan = require('morgan');
//   app.use(morgan('combined', { stream: logger.stream }));
// }

// Enable CORS for all routes
app.use(
  cors({
   origin: [
      "https://farm-shop-eight.vercel.app", // domain frontend Vercel
      "http://localhost:3000"               // cho dev local
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Multi-Vendor E-Commerce API",
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api-docs.json", (req, res) => {
  res.json(specs);
});

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

  server.close(() => {
    process.exit(1);
  });
});
