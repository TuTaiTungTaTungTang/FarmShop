require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
const User = require("../model/user");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");
const Order = require("../model/order");
const Conversation = require("../model/conversation");
const Message = require("../model/messages");
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
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Xóa tất cả dữ liệu cũ
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Event.deleteMany({});
    await Order.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await CouponCode.deleteMany({});
    await Withdraw.deleteMany({});

    // Tạo admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@eshop.com",
      password: "admin123",
      role: "Admin",
      avatar: "https://static.vecteezy.com/system/resources/previews/023/224/454/non_2x/sticker-style-businessman-or-manager-character-on-gray-background-vector.jpg",
    });

    // Tạo test users
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        avatar: "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg",
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
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU37FnbBg50aestSWYenXfXOSAK5UjVcHCJfgbl96rpocUMXtGqXaVFBxHbou9qWNzQoU&usqp=CAU",
        addresses: [{
          country: "Vietnam",
          city: "Hanoi",
          address1: "456 Le Loi Street",
          zipCode: 10000,
          addressType: "Office"
        }]
      }
    ]);

    // Tạo test shops
    const shops = await Shop.create([
      {
        name: "TechStore",
        email: "techstore@example.com",
        password: "shop123",
        description: "Leading technology retailer",
        address: "456 Tech Avenue, Silicon Valley, CA",
        phoneNumber: 1234567890,
        zipCode: 94043,
  avatar: "https://yt3.googleusercontent.com/RDALBWs5WM--1YupjUUYLCQeptVYsBjh11evXJC4k3wcjeChTZfm3qXEjE8jP8J6rrWmPcg9i2M=s900-c-k-c0x00ffffff-no-rj",
        availableBalance: 5000,
      },
      {
        name: "FashionHub",
        email: "fashion@example.com",
        password: "shop123",
        description: "Latest fashion trends",
        address: "789 Fashion St, New York, NY",
        phoneNumber: 9876543210,
        zipCode: 10002,
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYmG2-bcEd56kThTRxGBhr1E23gNJHWPaSg&s",
        availableBalance: 3000,
      }
    ]);

    // Tạo products với QR code
    const productsData = [
      {
        name: "MacBook Pro M2 256GB - Truy xuất nguồn gốc",
        description: "Latest MacBook Pro with M2 chip, 256GB SSD, 8GB RAM. Có QR code truy xuất nguồn gốc.",
        category: "Computers and Laptops",
        tags: "laptop,apple,macbook,traceability",
        originalPrice: 1299,
        discountPrice: 1199,
        stock: 50,
        images: [
      "https://cdn.shopify.com/s/files/1/1706/9177/products/NEWAppleMacbookProwithM1ProChip14InchLaptop2021ModelMKGQ3LL_A_16GB_1TBSSD_custommacbd.jpg?v=1659592838",
      "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png"
    ],
        shopId: shops[0]._id,
        shop: {
          _id: shops[0]._id,
          name: shops[0].name,
          avatar: shops[0].avatar,
          ratings: 4.5
        },
        sold_out: 25,
        ratings: 4.5
      },
      {
        name: "iPhone 14 Pro Max 256GB - Chính hãng VN/A",
        description: "Latest iPhone with advanced camera system. QR truy xuất nhập khẩu chính hãng.",
        category: "Mobile and Tablets",
        tags: "phone,apple,iphone,authentic",
        originalPrice: 1099,
        discountPrice: 999,
        stock: 30,
        images: [
  "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/_/t_m_18_1_3_2.png",
      "https://st-troy.mncdn.com/mnresize/1500/1500/Content/media/ProductImg/original/mpwp3tua-apple-iphone-14-256gb-mavi-mpwp3tua-637986832343472449.jpg"
    ],
        shopId: shops[0]._id,
        shop: {
          _id: shops[0]._id,
          name: shops[0].name,
          avatar: shops[0].avatar,
          ratings: 4.5
        },
        sold_out: 15,
        ratings: 4.8
      },
      {
        name: "Designer Summer Dress - Made in Vietnam",
        description: "Elegant summer dress for special occasions. Truy xuất được nguồn gốc vải và quy trình may.",
        category: "Cloths",
        tags: "dress,summer,fashion,traceable",
        originalPrice: 199,
        discountPrice: 149,
        stock: 25,
       images: [
  "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=800&q=80",
      "https://cdn.shopify.com/s/files/1/0425/2225/files/Stunning_Evening_mxi_dress_to_wear_to_a_summer_wedding_by_Lindsey_Brown.jpg?v=1620901412"
    ],
        shopId: shops[1]._id,
        shop: {
          _id: shops[1]._id,
          name: shops[1].name,
          avatar: shops[1].avatar,
          ratings: 4.2
        },
        sold_out: 8,
        ratings: 4.3
      }
    ];

    // Tạo products với QR codes
    const products = [];
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];
      const product = await Product.create(productData);
      const qrResult = await generateProductQR(product._id, product);
      if (qrResult.success) {
        await Product.findByIdAndUpdate(product._id, {
          qrCode: qrResult.qrCodePath,
          qrCodeUrl: qrResult.qrCodeUrl,
          traceabilityId: qrResult.traceabilityId
        });
        const updatedProduct = await Product.findById(product._id);
        products.push(updatedProduct);
      } else {
        products.push(product);
      }
    }

    // Tạo events với QR code
    const eventsData = [
      {
        name: "Black Friday Sale - MacBook Pro",
        description: "Special discount on MacBook Pro during Black Friday",
        category: "Computers and Laptops",
        start_Date: new Date(),
        Finish_Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        originalPrice: 1299,
        discountPrice: 999,
        stock: 20,
        images: ["https://i.ytimg.com/vi/x9MTvwRSB70/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDsvcj3o1TKJ0S_K4ckeGoyZi0OcQ"],
        shopId: shops[0]._id,
        shop: {
          _id: shops[0]._id,
          name: shops[0].name,
          avatar: shops[0].avatar,
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
        images: ["https://cdn.sanity.io/images/qiodnnh0/production/271d5298edbf74b8380aefe230c4e86b4c998326-1226x618.jpg?fit=max&auto=format"],
        shopId: shops[1]._id,
        shop: {
          _id: shops[1]._id,
          name: shops[1].name,
          avatar: shops[1].avatar,
          ratings: 4.2
        },
        sold_out: 12
      }
    ];

    const events = [];
    for (let i = 0; i < eventsData.length; i++) {
      const eventData = eventsData[i];
      const event = await Event.create(eventData);
      const qrResult = await generateProductQR(event._id, event);
      if (qrResult.success) {
        await Event.findByIdAndUpdate(event._id, {
          qrCode: qrResult.qrCodePath,
          qrCodeUrl: qrResult.qrCodeUrl,
          traceabilityId: qrResult.traceabilityId
        });
        const updatedEvent = await Event.findById(event._id);
        events.push(updatedEvent);
      } else {
        events.push(event);
      }
    }

    // Tạo orders
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
      }
    ]);

    // Tạo conversations & messages
    const conversations = await Conversation.create([
      {
        members: [users[0]._id.toString(), shops[0]._id.toString()],
        lastMessage: "Xin chào, sản phẩm có QR code truy xuất không?",
        lastMessageId: users[0]._id.toString(),
      }
    ]);

    const messages = await Message.create([
      {
        conversationId: conversations[0]._id.toString(),
        text: "Xin chào, sản phẩm có QR code truy xuất không?",
        sender: users[0]._id.toString(),
      },
      {
        conversationId: conversations[0]._id.toString(),
        text: "Chào bạn! Có ạ, tất cả sản phẩm đều có QR code để truy xuất nguồn gốc.",
        sender: shops[0]._id.toString(),
      }
    ]);

    // Tạo coupon codes
    const coupons = await CouponCode.create([
      {
        name: "NEWUSER10",
        value: 10,
        minAmount: 50,
        maxAmount: 100,
        shopId: shops[0]._id,
        selectedProduct: null,
        createdAt: new Date()
      }
    ]);

    // Tạo withdraw requests
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

    console.log("✅ Seed data with QR codes created successfully!");
    console.log(`👤 Created ${users.length + 1} users (including admin)`);
    console.log(`🏪 Created ${shops.length} shops`);
    console.log(`📦 Created ${products.length} products with QR codes`);
    console.log(`🎉 Created ${events.length} events with QR codes`);
    console.log(`🛍️ Created ${orders.length} orders`);
    console.log(`💬 Created ${conversations.length} conversations`);
    console.log(`📨 Created ${messages.length} messages`);
    console.log(`🎟️ Created ${coupons.length} coupons`);
    console.log(`💰 Created ${withdraws.length} withdraw requests`);

    console.log("\n🔑 Login Credentials:");
    console.log("Admin: admin@eshop.com / admin123");
    console.log("User: john@example.com / 123456");
    console.log("Shop1: techstore@example.com / shop123");
    console.log("Shop2: fashion@example.com / shop123");

    console.log("\n🌱 QR CODE FEATURES:");
    console.log("   ✅ All products now have QR codes");
    console.log("   ✅ All events now have QR codes");
    console.log("   ✅ Scan QR to trace product origin");

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

if (require.main === module) {
  connectDB().then(() => {
    seedData();
  });
}

module.exports = { seedData };