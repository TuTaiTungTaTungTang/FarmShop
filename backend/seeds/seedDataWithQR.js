require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
const User = require("../model/user");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");
const Order = require("../model/order");
const Conversation = require("../model/conversation");
const Messages = require("../model/messages");
const CouponCode = require("../model/coupounCode");
const Withdraw = require("../model/withdraw");
const { generateProductQR } = require("../utils/qrGenerator");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB:", process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");

    // Force drop all indexes and recreate only the correct traceabilityId index
    const productCollection = mongoose.connection.collection("products");
    try {
      await productCollection.dropIndexes();
      console.log("🗑️ Dropped ALL indexes on products collection");
    } catch (err) {
      console.warn("⚠️ Could not drop all indexes:", err.message);
    }
    await productCollection.createIndex({ traceabilityId: 1 }, { unique: true, sparse: true });
    console.log("✅ Recreated traceabilityId index as unique & sparse");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

const seedCompleteData = async () => {
  try {
    console.log("🗑️ Clearing existing data...");
    
    // Xóa TẤT CẢ dữ liệu cũ
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Event.deleteMany({});
    await Order.deleteMany({});
    await Conversation.deleteMany({});
    await Messages.deleteMany({});
    await CouponCode.deleteMany({});
    await Withdraw.deleteMany({});

    console.log("✅ Cleared all existing data");

    // 1. 👑 Tạo ADMIN USER
    console.log("👑 Creating admin user...");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@eshop.com",
      password: "admin123",
      role: "Admin",
      avatar: "admin-avatar.png",
    });

    // 2. 👥 Tạo TEST USERS
    console.log("👥 Creating test users...");
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        avatar: "user1-avatar.png",
        addresses: [{
          country: "Vietnam",
          city: "Ho Chi Minh",
          address1: "123 Nguyen Hue Street",
          zipCode: 70000,
          addressType: "Home"
        }]
      },
      {
        name: "Jane Smith", 
        email: "jane@example.com",
        password: "123456",
        avatar: "user2-avatar.png",
        addresses: [{
          country: "Vietnam",
          city: "Hanoi",
          address1: "456 Le Loi Street",
          zipCode: 10000,
          addressType: "Office"
        }]
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com", 
        password: "123456",
        avatar: "user3-avatar.png",
      }
    ]);

    // 3. 🏪 Tạo TEST SHOPS
    console.log("🏪 Creating test shops...");
    const shops = await Shop.create([
      {
        name: "TechStore Vietnam",
        email: "techstore@example.com",
        password: "shop123",
        description: "Chuyên cung cấp thiết bị công nghệ chất lượng cao với QR truy xuất",
        address: "456 Lê Lợi, Quận 1, TP.HCM, Việt Nam",
        phoneNumber: 84901234567,
        zipCode: 70000,
        avatar: "techstore-avatar.png",
        availableBalance: 15000,
      },
      {
        name: "Nông Sản Sạch Premium",
        email: "nongsansach@example.com", 
        password: "shop123",
        description: "Nông sản hữu cơ truy xuất nguồn gốc từ trang trại",
        address: "789 Hai Bà Trưng, Quận 3, TP.HCM, Việt Nam",
        phoneNumber: 84909876543,
        zipCode: 70000,
        avatar: "organic-avatar.png",
        availableBalance: 8000,
      },
      {
        name: "Fashion Hub VN",
        email: "fashion@example.com",
        password: "shop123", 
        description: "Thời trang xu hướng với tem truy xuất chất lượng",
        address: "321 Nguyễn Trãi, Quận 5, TP.HCM, Việt Nam",
        phoneNumber: 84905555666,                                                                                                                           
        zipCode: 70000,
        avatar: "fashion-avatar.png",
        availableBalance: 5500,
      }
    ]);

    // 4. 📦 Tạo PRODUCTS (SẼ CÓ QR SAU)
    console.log("📦 Creating products...");
    const productsData = [
      {
        name: "MacBook Pro M2 256GB - Truy xuất nguồn gốc",
        description: "MacBook Pro mới nhất với chip M2, bảo hành chính hãng Apple. Có QR code truy xuất nguồn gốc nhập khẩu.",
        category: "Computers and Laptops",
        tags: "laptop,apple,macbook,traceability,authentic",
        originalPrice: 1299,
        discountPrice: 1199,
        stock: 50,
        images: ["macbook1.png", "macbook2.png"],
        shopId: shops[0]._id,
        shop: {
          name: shops[0].name,
          shop_avatar: { public_id: "test", url: shops[0].avatar },
          ratings: 4.5
        },
        sold_out: 25,
        ratings: 4.5
      },
      {
        name: "Gạo ST25 Hữu Cơ - Trại Nông Sản Sạch",
        description: "Gạo ST25 hữu cơ được trồng theo tiêu chuẩn VietGAP tại Đồng Tháp. Truy xuất được từ ruộng đến bàn ăn.",
        category: "Others",
        tags: "rice,organic,vietnam,traceable,st25",
        originalPrice: 25,
        discountPrice: 22,
        stock: 100,
        images: ["rice1.png", "rice2.png"],
        shopId: shops[1]._id,
        shop: {
          name: shops[1].name,
          shop_avatar: { public_id: "test", url: shops[1].avatar },
          ratings: 4.8
        },
        sold_out: 45,
        ratings: 4.7
      },
      {
        name: "iPhone 14 Pro Max 256GB - Chính hãng VN/A",
        description: "iPhone 14 Pro Max chính hãng với đầy đủ tem CO CQ, phiếu bảo hành. QR truy xuất nhập khẩu chính hãng.",
        category: "Mobile and Tablets", 
        tags: "phone,apple,iphone,authentic,warranty",
        originalPrice: 1099,
        discountPrice: 999,
        stock: 30,
        images: ["iphone1.png", "iphone2.png"],
        shopId: shops[0]._id,
        shop: {
          name: shops[0].name,
          shop_avatar: { public_id: "test", url: shops[0].avatar },
          ratings: 4.5
        },
        sold_out: 15,
        ratings: 4.8
      },
      {
        name: "Cà phê Arabica Đà Lạt - Nguyên chất",
        description: "Cà phê Arabica trồng tại độ cao 1500m Đà Lạt, rang xay nguyên chất. Truy xuất từ trang trại cà phê.",
        category: "Others",
        tags: "coffee,arabica,dalat,organic,traceable",
        originalPrice: 15,
        discountPrice: 12,
        stock: 200,
        images: ["coffee1.png", "coffee2.png"], 
        shopId: shops[1]._id,
        shop: {
          name: shops[1].name,
          shop_avatar: { public_id: "test", url: shops[1].avatar },
          ratings: 4.8
        },
        sold_out: 80,
        ratings: 4.6
      },
      {
        name: "Áo Thun Nam Cotton 100% - Made in Vietnam",
        description: "Áo thun nam chất liệu cotton 100% được dệt và may tại Việt Nam. QR truy xuất nguồn gốc vải và quy trình sản xuất.",
        category: "Cloths",
        tags: "tshirt,cotton,vietnam,fashion,traceable",
        originalPrice: 20,
        discountPrice: 16, 
        stock: 75,
        images: ["tshirt1.png", "tshirt2.png"],
        shopId: shops[2]._id,
        shop: {
          name: shops[2].name,
          shop_avatar: { public_id: "test", url: shops[2].avatar },
          ratings: 4.3
        },
        sold_out: 30,
        ratings: 4.4
      },
      {
        name: "Chăm sóc thú cưng - Thức ăn cho chó Premium",
        description: "Thức ăn cao cấp cho chó con và chó trưởng thành, có chứng nhận chất lượng. QR truy xuất thành phần và nguồn gốc.",
        category: "Pet Care",
        tags: "pet,dog,food,premium,safe",
        originalPrice: 35,
        discountPrice: 30,
        stock: 60,
        images: ["petfood1.png", "petfood2.png"],
        shopId: shops[1]._id,
        shop: {
          name: shops[1].name,
          shop_avatar: { public_id: "test", url: shops[1].avatar },
          ratings: 4.8
        },
        sold_out: 20,
        ratings: 4.5
      },
      {
        name: "Bộ quà tặng cao cấp - Premium Gift Set",
        description: "Bộ quà tặng cao cấp gồm nhiều sản phẩm đặc biệt, có hộp đẹp và QR truy xuất nguồn gốc từng món quà.",
        category: "Gifts", 
        tags: "gift,premium,luxury,traceable,special",
        originalPrice: 80,
        discountPrice: 65,
        stock: 40,
        images: ["giftset1.png", "giftset2.png"],
        shopId: shops[2]._id,
        shop: {
          name: shops[2].name,
          shop_avatar: { public_id: "test", url: shops[2].avatar },
          ratings: 4.3
        },
        sold_out: 12,
        ratings: 4.2
      }
    ];

    const products = await Product.create(productsData);

    // 5. 🔄 TẠO QR CODE CHO TẤT CẢ PRODUCTS
    console.log("🔄 Generating QR codes for all products...");
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`🔄 Creating QR for: ${product.name}`);
      
      const qrResult = await generateProductQR(product._id, product);
      
      if (qrResult.success) {
        await Product.findByIdAndUpdate(product._id, {
          qrCode: qrResult.qrCodePath,
          qrCodeUrl: qrResult.qrCodeUrl,
          traceabilityId: qrResult.traceabilityId
        });
        console.log(`✅ QR generated: ${product.name.slice(0, 30)}...`);
      } else {
        console.log(`❌ QR failed: ${product.name}`);
      }
    }

    // 6. 🎉 Tạo EVENTS với QR
    console.log("🎉 Creating events with QR codes...");
    const eventsData = [
      {
        name: "Black Friday - MacBook Pro Sale",
        description: "Giảm giá đặc biệt MacBook Pro trong dịp Black Friday. Sản phẩm có QR truy xuất nguồn gốc.",
        category: "Computers and Laptops",
        start_Date: new Date(),
        Finish_Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        originalPrice: 1299,
        discountPrice: 999,
        stock: 20,
        images: ["macbook-event.png"],
        shopId: shops[0]._id,
        shop: {
          name: shops[0].name,
          shop_avatar: { public_id: "test", url: shops[0].avatar },
          ratings: 4.5
        },
        sold_out: 5,
        tags: "laptop,sale,blackfriday"
      },
      {
        name: "Nông sản hữu cơ - Khuyến mãi cuối năm", 
        description: "Giảm giá đặc biệt cho tất cả nông sản hữu cơ có truy xuất nguồn gốc.",
        category: "Others",
        start_Date: new Date(),
        Finish_Date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        originalPrice: 50,
        discountPrice: 35,
        stock: 100,
        images: ["organic-event.png"],
        shopId: shops[1]._id,
        shop: {
          name: shops[1].name,
          shop_avatar: { public_id: "test", url: shops[1].avatar },
          ratings: 4.8
        },
        sold_out: 25,
        tags: "organic,sale,healthy"
      }
    ];

    const events = await Event.create(eventsData);

    // Tạo QR cho events
    for (const event of events) {
      const qrResult = await generateProductQR(event._id, event);
      if (qrResult.success) {
        await Event.findByIdAndUpdate(event._id, {
          qrCode: qrResult.qrCodePath,
          qrCodeUrl: qrResult.qrCodeUrl, 
          traceabilityId: qrResult.traceabilityId
        });
        console.log(`✅ QR generated for event: ${event.name}`);
      }
    }

    // 7. 🛍️ Tạo ORDERS
    console.log("🛍️ Creating sample orders...");
    const orders = await Order.create([
      {
        cart: [
          {
            _id: products[0]._id,
            name: products[0].name,
            price: products[0].discountPrice,
            qty: 1,
            image: products[0].images[0],
            shopId: products[0].shopId
          }
        ],
        shippingAddress: {
          address1: "123 Nguyen Hue Street",
          city: "Ho Chi Minh",
          country: "Vietnam",
          zipCode: 70000
        },
        user: {
          _id: users[0]._id,
          name: users[0].name,
          email: users[0].email
        },
        totalPrice: products[0].discountPrice,
        status: "Delivered",
        paymentInfo: {
          type: "Cash On Delivery",
          status: "Succeeded"
        },
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        cart: [
          {
            _id: products[1]._id,
            name: products[1].name, 
            price: products[1].discountPrice,
            qty: 2,
            image: products[1].images[0],
            shopId: products[1].shopId
          }
        ],
        shippingAddress: {
          address1: "456 Le Loi Street",
          city: "Hanoi", 
          country: "Vietnam",
          zipCode: 10000
        },
        user: {
          _id: users[1]._id,
          name: users[1].name,
          email: users[1].email
        },
        totalPrice: products[1].discountPrice * 2,
        status: "Processing",
        paymentInfo: {
          type: "Cash On Delivery"
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]);

    // 8. 💬 Tạo CONVERSATIONS & MESSAGES
    console.log("💬 Creating conversations and messages...");
    const conversations = await Conversation.create([
      {
        members: [users[0]._id.toString(), shops[0]._id.toString()],
        lastMessage: "Xin chào, sản phẩm có QR code truy xuất không?",
        lastMessageId: users[0]._id.toString(),
      },
      {
        members: [users[1]._id.toString(), shops[1]._id.toString()],
        lastMessage: "Nông sản của shop có chứng nhận hữu cơ không?",
        lastMessageId: users[1]._id.toString(),
      }
    ]);

    const messages = await Messages.create([
      {
        conversationId: conversations[0]._id.toString(),
        text: "Xin chào, sản phẩm có QR code truy xuất không?",
        sender: users[0]._id.toString(),
      },
      {
        conversationId: conversations[0]._id.toString(),
        text: "Chào bạn! Có ạ, tất cả sản phẩm đều có QR code để truy xuất nguồn gốc.",
        sender: shops[0]._id.toString(),
      },
      {
        conversationId: conversations[1]._id.toString(),
        text: "Nông sản của shop có chứng nhận hữu cơ không?",
        sender: users[1]._id.toString(),
      },
      {
        conversationId: conversations[1]._id.toString(),
        text: "Có ạ, chúng tôi có chứng nhận VietGAP và có thể truy xuất từ trang trại.",
        sender: shops[1]._id.toString(),
      }
    ]);

    // 9. 🎟️ Tạo COUPON CODES
    console.log("🎟️ Creating coupon codes...");
    const coupons = await CouponCode.create([
      {
        name: "NEWUSER10",
        value: 10,
        minAmount: 50,
        maxAmount: 100,
        shopId: shops[0]._id,
        selectedProduct: null,
        createdAt: new Date()
      },
      {
        name: "ORGANIC20",
        value: 20,
        minAmount: 30,
        maxAmount: 50,
        shopId: shops[1]._id,
        selectedProduct: products[1]._id,
        createdAt: new Date()
      }
    ]);

    // 10. 💰 Tạo WITHDRAW REQUESTS
    console.log("💰 Creating withdraw requests...");
    const withdraws = await Withdraw.create([
      {
        seller: {
          _id: shops[0]._id,
          name: shops[0].name,
        },
        amount: 1000,
        status: "Processing",
        bankInfo: {
          bankName: "Vietcombank",
          bankCountry: "Vietnam", 
          bankSwiftCode: "BFTVVNVX",
          bankAccountNumber: "1234567890",
          bankHolderName: "Tech Store Vietnam",
          bankAddress: "Ho Chi Minh City"
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log("\n🎉 COMPLETE SEED DATA WITH QR CODES CREATED!");
    console.log("═══════════════════════════════════════════════");
    console.log(`👑 Admin: 1`);
    console.log(`👤 Users: ${users.length}`);
    console.log(`🏪 Shops: ${shops.length}`);
    console.log(`📦 Products: ${products.length} (all with QR codes)`);
    console.log(`🎉 Events: ${events.length} (all with QR codes)`);
    console.log(`🛍️ Orders: ${orders.length}`);
    console.log(`💬 Conversations: ${conversations.length}`);
    console.log(`📨 Messages: ${messages.length}`);
    console.log(`🎟️ Coupons: ${coupons.length}`);
    console.log(`💰 Withdraws: ${withdraws.length}`);

    console.log("\n🔑 LOGIN CREDENTIALS:");
    console.log("═══════════════════════════════════════════════");
    console.log("🔧 ADMIN:");
    console.log("   Email: admin@eshop.com");
    console.log("   Password: admin123");
    console.log("\n👤 USERS:");
    console.log("   Email: john@example.com | Password: 123456");
    console.log("   Email: jane@example.com | Password: 123456");
    console.log("   Email: mike@example.com | Password: 123456");
    console.log("\n🏪 SHOPS:");
    console.log("   Email: techstore@example.com | Password: shop123");
    console.log("   Email: nongsansach@example.com | Password: shop123");
    console.log("   Email: fashion@example.com | Password: shop123");

    console.log("\n🌱 QR CODE FEATURES:");
    console.log("   ✅ All products have QR codes with traceability");
    console.log("   ✅ All events have QR codes");
    console.log("   ✅ QR codes saved in /uploads/qr-codes/");
    console.log("   ✅ Scan QR to trace product origin (FaceFarm style)");
    console.log("   ✅ Full conversation & message system");
    console.log("   ✅ Sample orders with delivery status");
    console.log("   ✅ Coupon codes and withdraw requests");

  } catch (error) {
    console.error("❌ Error seeding complete data:", error);
  } finally {
    console.log("\n🔌 Closing database connection...");
    mongoose.connection.close();
    process.exit(0);
  }
};

// Chạy seed
if (require.main === module) {
  console.log("🚀 Starting COMPLETE seed data with QR codes...");
  connectDB().then(() => {
    seedCompleteData();
  });
}

module.exports = { seedCompleteData };