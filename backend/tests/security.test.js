const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../model/user");
const Order = require("../model/order");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Order.deleteMany({})]);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Security hardening", () => {
  test("Should reject invalid ObjectId for public shop info route", async () => {
    const response = await request(app)
      .get("/api/v2/shop/get-shop-info/not-a-valid-objectid")
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid id");
  });

  test("Should reject invalid ObjectId for protected order route", async () => {
    const user = await User.create({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      avatar: "avatar.png",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    const response = await request(app)
      .get("/api/v2/order/get-all-orders/not-a-valid-objectid")
      .set("Cookie", [`token=${token}`])
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid userId");
  });

  test("Should block user from reading another user's orders (IDOR)", async () => {
    const userA = await User.create({
      name: "User A",
      email: "usera@example.com",
      password: "password123",
      avatar: "usera.png",
    });

    const userB = await User.create({
      name: "User B",
      email: "userb@example.com",
      password: "password123",
      avatar: "userb.png",
    });

    await Order.create({
      cart: [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          shopId: new mongoose.Types.ObjectId().toString(),
          qty: 1,
          name: "Test Product",
          price: 100,
        },
      ],
      shippingAddress: {
        country: "VN",
        city: "HCM",
        address1: "Street 1",
        zipCode: 700000,
        addressType: "Home",
      },
      user: {
        _id: userB._id.toString(),
        name: userB.name,
        email: userB.email,
      },
      totalPrice: 100,
      paymentInfo: {
        type: "Cash On Delivery",
      },
    });

    const tokenA = jwt.sign({ id: userA._id }, process.env.JWT_SECRET_KEY);

    const response = await request(app)
      .get(`/api/v2/order/get-all-orders/${userB._id}`)
      .set("Cookie", [`token=${tokenA}`])
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Unauthorized");
  });
});
