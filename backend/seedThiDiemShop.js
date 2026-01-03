require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
const Shop = require("./model/shop");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB:", process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

const seedShops = async () => {
  try {
    await connectDB();

    // Hash password: password123
    const hashedPassword = await bcrypt.hash("Thidiem@123", 10);

    const shops = [
      {
        name: "Vựa trái cây Thi Diễm",
        email: "thidiem.fruit@gmail.com",
        password: hashedPassword,
        description: "Vựa trái cây Thi Diễm chuyên cung cấp trái cây tươi, trái cây theo mùa, nguồn gốc rõ ràng, giá sỉ và lẻ.",
        address: "1/ Cơ sở 1: Cao Lãnh - Đồng Tháp\n2/ Cơ sở 2: Long Xuyên - An Giang\n3/ Cơ sở 3: Châu Đốc - An Giang",
        phoneNumber: [
          {
            name: "Anh Thi",
            phone: "0966664887"
          },
          {
            name: "Anh Quí",
            phone: "0375321185"
          }
        ],
        role: "Seller",
        avatar: "https://picsum.photos/seed/thidiemfruit/200",
        zipCode: 70000,
        availableBalance: 0,
        transections: [],
        createdAt: new Date(),
      },
    ];

    // Cập nhật hoặc tạo mới shop
    for (const shopData of shops) {
      const result = await Shop.findOneAndUpdate(
        { email: shopData.email },
        shopData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log("✅ Shop updated/created successfully:");
      console.log(`   📦 ${result.name} (${result.email})`);
      console.log(`      Address: ${result.address}`);
      console.log(`      Phone: ${JSON.stringify(result.phoneNumber, null, 2)}`);
      console.log(`      ID: ${result._id}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding shops:", error);
    process.exit(1);
  }
};

seedShops();
