require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
const User = require("./model/user");
const Shop = require("./model/shop");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

const createTestAccounts = async () => {
  try {
    console.log("🗑️ Cleaning old test accounts...");
    
    // Xóa tài khoản cũ
    await User.deleteMany({
      email: { $in: ["test@example.com", "admin@example.com"] }
    });
    await Shop.deleteMany({
      email: { $in: ["shop@example.com"] }
    });

    console.log("👤 Creating test user...");
    
    // Tạo User test (Model sẽ tự động hash password)
    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456", // Model sẽ tự động hash
      avatar: "test-avatar.png",
    });
    console.log("✅ Test user created:", testUser.email);

    // Tạo Admin user
    const adminUser = await User.create({
      name: "Admin User", 
      email: "admin@example.com",
      password: "admin123",
      role: "Admin",
      avatar: "admin-avatar.png",
    });
    console.log("✅ Admin user created:", adminUser.email);

    // Tạo Shop test
    const testShop = await Shop.create({
      name: "Test Shop",
      email: "shop@example.com", 
      password: "123456", // Model sẽ tự động hash
      address: "123 Test Street, Test City",
      phoneNumber: 1234567890,
      zipCode: 12345,
      avatar: "shop-avatar.png",
    });
    console.log("✅ Test shop created:", testShop.email);

    console.log("\n🎉 ALL TEST ACCOUNTS CREATED SUCCESSFULLY!");
    console.log("\n🔑 LOGIN CREDENTIALS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 USER LOGIN:");
    console.log("   Email: test@example.com");
    console.log("   Password: 123456");
    console.log("\n🔧 ADMIN LOGIN:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");
    console.log("\n🏪 SHOP LOGIN:");
    console.log("   Email: shop@example.com");
    console.log("   Password: 123456");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (error) {
    console.error("❌ Error creating accounts:", error.message);
    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach(key => {
        console.error(`   ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    console.log("\n🔌 Closing database connection...");
    mongoose.connection.close();
    process.exit(0);
  }
};

console.log("🚀 Starting test account creation...");
connectDB().then(() => {
  createTestAccounts();
});