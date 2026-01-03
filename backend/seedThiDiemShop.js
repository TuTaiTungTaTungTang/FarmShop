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
        address: "1/ Cơ sở 1: Cao Lãnh - Đồng Tháp\n2/ Cơ sở 2: Long Xuyên - An Giang\n3/ Cơ sở 3: Châu Đốc - An Giang\n4/ Cơ sở 4: Vĩnh Long - Vĩnh Long\n5/ Cơ sở 5: Sa Đéc - Đồng Tháp\n6/ Cơ sở 6: Cần Thơ - Cần Thơ\n7/ Cơ sở 7: Rạch Giá - Kiên Giang",
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

    // Xóa các shop cũ nếu cần (tùy chọn)
    // await Shop.deleteMany({ email: { $in: shops.map(s => s.email) } });

    const result = await Shop.insertMany(shops);
    console.log("✅ Shops created successfully:");
    result.forEach((shop) => {
      console.log(`   📦 ${shop.name} (${shop.email})`);
      console.log(`      Phone: ${shop.phoneNumber}`);
      console.log(`      ID: ${shop._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding shops:", error);
    process.exit(1);
  }
};

seedShops();
