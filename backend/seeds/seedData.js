// Load environment variables first
require("dotenv").config({ path: "../config/.env" });

const mongoose = require("mongoose");
const User = require("../model/user");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB:", process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Event.deleteMany({});

    console.log("Cleared existing data");

    // Tạo admin user (KHÔNG hash trước - để model tự hash)
    const admin = await User.create({
      name: "Admin User",
      email: "admin@eshop.com",
      password: "admin123", // Không hash ở đây
      role: "Admin",
      avatar: "admin-avatar.png",
    });

    // Tạo test users (KHÔNG hash trước)
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "123456", // Không hash ở đây
        avatar: "user1-avatar.png",
        addresses: [{
          country: "US",
          city: "New York",
          address1: "123 Main St",
          zipCode: 10001,
          addressType: "Home"
        }]
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "123456", // Không hash ở đây
        avatar: "user2-avatar.png",
      }
    ]);

    // Tạo test shops (KHÔNG hash trước)
    const shops = await Shop.create([
      {
        name: "TechStore",
        email: "techstore@example.com",
        password: "shop123", // Không hash ở đây
        description: "Leading technology retailer",
        address: "456 Tech Avenue, Silicon Valley, CA",
        phoneNumber: 1234567890,
        zipCode: 94043,
        avatar: "techstore-avatar.png",
        availableBalance: 5000,
      },
      {
        name: "FashionHub",
        email: "fashion@example.com",
        password: "shop123", // Không hash ở đây
        description: "Latest fashion trends",
        address: "789 Fashion St, New York, NY",
        phoneNumber: 9876543210,
        zipCode: 10002,
        avatar: "fashion-avatar.png",
        availableBalance: 3000,
      }
    ]);

    // Tạo test products
    const products = await Product.create([
      {
        name: "MacBook Pro M2 256GB",
        description: "Latest MacBook Pro with M2 chip, 256GB SSD, 8GB RAM",
        category: "Computers and Laptops",
        tags: "laptop,apple,macbook",
        originalPrice: 1299,
        discountPrice: 1199,
        stock: 50,
        images: ["macbook1.png", "macbook2.png"],
        shopId: shops[0]._id,
        shop: {
          name: shops[0].name,
          shop_avatar: {
            public_id: "test",
            url: shops[0].avatar
          },
          ratings: 4.5
        },
        sold_out: 25,
        ratings: 4.5
      },
      {
        name: "iPhone 14 Pro Max 256GB",
        description: "Latest iPhone with advanced camera system",
        category: "Mobile and Tablets",
        tags: "phone,apple,iphone",
        originalPrice: 1099,
        discountPrice: 999,
        stock: 30,
        images: ["iphone1.png", "iphone2.png"],
        shopId: shops[0]._id,
        shop: {
          name: shops[0].name,
          shop_avatar: {
            public_id: "test",
            url: shops[0].avatar
          },
          ratings: 4.5
        },
        sold_out: 15,
        ratings: 4.8
      },
      {
        name: "Designer Summer Dress",
        description: "Elegant summer dress for special occasions",
        category: "Cloths",
        tags: "dress,summer,fashion",
        originalPrice: 199,
        discountPrice: 149,
        stock: 25,
        images: ["dress1.png", "dress2.png"],
        shopId: shops[1]._id,
        shop: {
          name: shops[1].name,
          shop_avatar: {
            public_id: "test",
            url: shops[1].avatar
          },
          ratings: 4.2
        },
        sold_out: 8,
        ratings: 4.3
      }
    ]);

    // Tạo test events
    const events = await Event.create([
      {
        name: "Black Friday Sale - MacBook Pro",
        description: "Special discount on MacBook Pro during Black Friday",
        category: "Computers and Laptops",
        start_Date: new Date(),
        Finish_Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        originalPrice: 1299,
        discountPrice: 999,
        stock: 20,
        images: ["macbook-event.png"],
        shopId: shops[0]._id,
        shop: {
          name: shops[0].name,
          shop_avatar: {
            public_id: "test",
            url: shops[0].avatar
          },
          ratings: 4.5
        },
        sold_out: 5
      },
      {
        name: "Summer Fashion Sale",
        description: "Up to 50% off on summer collection",
        category: "Cloths",
        start_Date: new Date(),
        Finish_Date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        originalPrice: 299,
        discountPrice: 149,
        stock: 50,
        images: ["summer-event.png"],
        shopId: shops[1]._id,
        shop: {
          name: shops[1].name,
          shop_avatar: {
            public_id: "test",
            url: shops[1].avatar
          },
          ratings: 4.2
        },
        sold_out: 12
      }
    ]);

    console.log("✅ Seed data created successfully!");
    console.log(`👤 Created ${users.length + 1} users (including admin)`);
    console.log(`🏪 Created ${shops.length} shops`);
    console.log(`📦 Created ${products.length} products`);
    console.log(`🎉 Created ${events.length} events`);

    console.log("\n🔑 Login Credentials:");
    console.log("Admin: admin@eshop.com / admin123");
    console.log("User: john@example.com / 123456");
    console.log("Shop1: techstore@example.com / shop123");
    console.log("Shop2: fashion@example.com / shop123");

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

// Chạy seed
if (require.main === module) {
  connectDB().then(() => {
    seedData();
  });
}

module.exports = { seedData };