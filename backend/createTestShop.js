require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
const Shop = require("./model/shop");
const bcrypt = require("bcryptjs");

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

const createTestShop = async () => {
  try {
    console.log("🗑️ Cleaning old shop accounts...");
    
    // Xóa shop cũ
    await Shop.deleteMany({
      email: { $in: ["shop@example.com", "testshop@example.com"] }
    });

    console.log("🏪 Creating test shop...");
    
    // Tạo Shop test
    const testShop = await Shop.create({
      name: "Test Shop",
      email: "testshop@example.com", 
      password: "123456", // Model sẽ tự động hash
      address: "123 Test Street, Test City",
      phoneNumber: 1234567890,
      zipCode: 12345,
      avatar: "shop-avatar.png",
    });
    console.log("✅ Test shop created:", testShop.email);

    // Tạo thêm shop khác
    const shop2 = await Shop.create({
      name: "Demo Shop",
      email: "shop@example.com", 
      password: "123456",
      address: "456 Demo Avenue, Demo City",
      phoneNumber: 9876543210,
      zipCode: 67890,
      avatar: "demo-shop-avatar.png",
    });
    console.log("✅ Demo shop created:", shop2.email);

    // Test password comparison
    console.log("\n🔐 Testing password validation...");
    
    const shopForTest = await Shop.findOne({ email: "testshop@example.com" }).select("+password");
    if (shopForTest) {
      const isValid = await shopForTest.comparePassword("123456");
      console.log("Password comparison result:", isValid);
      
      if (!isValid) {
        console.log("❌ Password comparison failed! Manual fix needed...");
        // Manual password reset
        const hashedPassword = await bcrypt.hash("123456", 10);
        await Shop.updateOne(
          { email: "testshop@example.com" },
          { password: hashedPassword }
        );
        console.log("✅ Password manually reset");
      }
    }

    console.log("\n🎉 SHOP ACCOUNTS CREATED SUCCESSFULLY!");
    console.log("\n🔑 SHOP LOGIN CREDENTIALS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🏪 SHOP LOGIN #1:");
    console.log("   Email: testshop@example.com");
    console.log("   Password: 123456");
    console.log("\n🏪 SHOP LOGIN #2:");
    console.log("   Email: shop@example.com");
    console.log("   Password: 123456");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n💡 Use these credentials in the SHOP LOGIN page!");
    console.log("   Frontend URL: http://localhost:3000/shop-login");

  } catch (error) {
    console.error("❌ Error creating shop accounts:", error.message);
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

console.log("🚀 Starting shop account creation...");
connectDB().then(() => {
  createTestShop();
});