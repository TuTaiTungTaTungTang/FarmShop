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

    // 3. 🏪 Tạo TEST SHOPS (nông sản / farm shops)
    console.log("🏪 Creating farm shops...");
    const shops = await Shop.create([
      {
        name: "FreshFarm Co",
        email: "freshfarm@example.com",
        password: "shop123",
        description: "Tập đoàn nông sản sạch, cung cấp gạo, rau củ quả tươi ngon truy xuất nguồn gốc.",
        address: "123 Farm Road, Đồng Tháp, Việt Nam",
        phoneNumber: 84901230001,
        zipCode: 87000,
        avatar: "https://picsum.photos/seed/farm1/200",
        availableBalance: 15000,
      },
      {
        name: "Green Valley Farm",
        email: "greenvalley@example.com",
        password: "shop123",
        description: "Nông trại hữu cơ chuyên rau củ sạch, trái cây theo mùa và sản phẩm chế biến.",
        address: "45 Valley Lane, Lâm Đồng, Việt Nam",
        phoneNumber: 84909870002,
        zipCode: 67000,
        avatar: "https://picsum.photos/seed/farm2/200",
        availableBalance: 8000,
      },
      {
        name: "Organic Harvest",
        email: "organicharvest@example.com",
        password: "shop123",
        description: "Chuỗi cung ứng nông sản hữu cơ, mật ong, trứng và các sản phẩm chế biến từ nông trại.",
        address: "78 Harvest Street, Tiền Giang, Việt Nam",
        phoneNumber: 84905550003,
        zipCode: 79000,
        avatar: "https://picsum.photos/seed/farm3/200",
        availableBalance: 5500,
      }
    ]);

    // 4. 📦 Tạo PRODUCTS (SẼ CÓ QR SAU)
    console.log("📦 Generating many farm product variants (this may take a moment)...");

    // Base templates to expand into many products
    const baseProducts = [
      {
        name: "Gạo ST25 Hữu Cơ",
        description: "Gạo ST25 hữu cơ, trồng theo tiêu chuẩn VietGAP, thơm và dẻo.",
        category: "Rice",
        tags: "rice,organic,st25,traceable",
        basePrice: 40,
        shopIndex: 0,
        imgSeed: "rice"
      },
      {
        name: "Combo Rau Sạch Hữu Cơ",
        description: "Combo rau củ hữu cơ gồm xà lách, cải, cà rốt - hái tươi trong ngày.",
        category: "Vegetables",
        tags: "vegetable,organic,fresh,traceable",
        basePrice: 6,
        shopIndex: 1,
        imgSeed: "veg"
      },
      {
        name: "Mật Ong Rừng",
        description: "Mật ong rừng nguyên chất, thu hái thủ công.",
        category: "Honey",
        tags: "honey,organic,forest,traceable",
        basePrice: 15,
        shopIndex: 2,
        imgSeed: "honey"
      },
      {
        name: "Trứng Gà Hữu Cơ",
        description: "Trứng gà chăn thả, nguồn gốc rõ ràng, an toàn cho gia đình.",
        category: "Eggs",
        tags: "eggs,organic,free-range,traceable",
        basePrice: 5,
        shopIndex: 2,
        imgSeed: "eggs"
      },
      {
        name: "Cà Phê Arabica Hạt",
        description: "Cà phê Arabica Đà Lạt hạt, rang xay vừa, hương vị đậm đà.",
        category: "Coffee",
        tags: "coffee,arabica,dalat,traceable",
        basePrice: 10,
        shopIndex: 1,
        imgSeed: "coffee"
      }
    ];

    // Generate richer variants to reach ~60 products with distinct names and attributes
    const productsData = [];
    const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // descriptor pools by category
    const descriptors = {
      Rice: {
        sizes: ["1kg", "2kg", "5kg", "10kg"],
        packs: ["Túi giấy", "Bao vải", "Hộp quà"],
        regions: ["Đồng Tháp", "An Giang", "Cần Thơ", "Long An"],
        certs: ["VietGAP", "Hữu cơ", "GlobalGAP", "Không chứng nhận"]
      },
      Vegetables: {
        sizes: ["0.5kg", "1kg", "2kg", "Combo gia đình"],
        packs: ["Túi lưới", "Hộp giấy", "Bao đổi hàng"],
        regions: ["Lâm Đồng", "Đà Lạt", "Bảo Lộc"],
        certs: ["Hữu cơ", "Hydroponic", "VietGAP"]
      },
      Honey: {
        sizes: ["250g", "500g", "1kg"],
        types: ["Mật ong rừng", "Mật ong hoa cà phê", "Mật ong hoa nhãn"],
        regions: ["Bình Phước", "Kon Tum", "Phú Thọ"],
        certs: ["Nguyên chất", "Pha loãng"]
      },
      Eggs: {
        packs: ["Hộp 6", "Hộp 10", "Hộp 20"],
        types: ["Gà ta chăn thả", "Gà công nghiệp"],
        regions: ["Tiền Giang", "An Giang", "Sóc Trăng"]
      },
      Coffee: {
        sizes: ["250g", "500g", "1kg"],
        roast: ["Light Roast", "Medium Roast", "Dark Roast"],
        regions: ["Đà Lạt", "Lâm Đồng", "Buôn Ma Thuột"]
      }
    };

    for (const base of baseProducts) {
      const pool = descriptors[base.category] || {};
      // create up to 12 variants with varied descriptors
      for (let v = 1; v <= 12; v++) {
        // build variant attrs
        const size = pool.sizes ? choose(pool.sizes) : (pool.packs ? choose(pool.packs) : `${v * 100}g`);
        const pack = pool.packs ? choose(pool.packs) : null;
        const region = pool.regions ? choose(pool.regions) : "Vùng miền";
        const cert = pool.certs ? choose(pool.certs) : (pool.types ? choose(pool.types) : "Tiêu chuẩn") ;
        const roast = pool.roast ? choose(pool.roast) : null;

        // nicer name construction per category
        let variantName = base.name;
        if (base.category === "Rice") {
          variantName = `${base.name} - ${size} (${cert}) - ${region}`;
        } else if (base.category === "Vegetables") {
          variantName = `${base.name} - ${size} - ${region} ${cert ? `(${cert})` : ''}`;
        } else if (base.category === "Honey") {
          variantName = `${choose(pool.types || [base.name])} - ${size} - ${region}`;
        } else if (base.category === "Eggs") {
          variantName = `${base.name} - ${choose(pool.packs)} - ${choose(pool.types)}`;
        } else if (base.category === "Coffee") {
          variantName = `${base.name} - ${size} - ${roast} - ${region}`;
        } else {
          variantName = `${base.name} - Variant ${v}`;
        }

        // price calculation influenced by size and certification
        let originalPrice = base.basePrice * (1 + (Math.random() * 0.6 - 0.2));
        if (size && typeof size === 'string') {
          if (size.includes('kg')) originalPrice *= parseFloat(size.replace('kg','')) || 1;
          if (size.includes('g')) originalPrice *= (parseFloat(size.replace('g',''))/1000) || 1;
          if (size.toLowerCase().includes('combo')) originalPrice *= 3;
        }
        if (cert && cert.toLowerCase().includes('hữu cơ')) originalPrice *= 1.25;
        const originalPriceRounded = Math.round(originalPrice * 100) / 100;
        const discountPrice = Math.round((originalPriceRounded * (0.85 + Math.random()*0.2)) * 100) / 100;

        // Create multiple distinct images per product using picsum seeds
        const seedBase = (base.imgSeed || variantName).toString().slice(0,30).replace(/[^a-zA-Z0-9]/g, '');
        const sizes = [ [1200,800], [800,600], [600,600], [400,400] ];
        const images = Array.from({ length: 4 }).map((_, idx) => {
          const s = `${seedBase}-${v}-${idx}`;
          const [w, h] = sizes[idx % sizes.length];
          return `https://picsum.photos/seed/${encodeURIComponent(s)}/${w}/${h}`;
        });

        // pick shop (mostly base shop but sometimes other shops to diversify)
        const shopPick = Math.random() < 0.85 ? shops[base.shopIndex] : choose(shops);

        productsData.push({
          name: variantName,
          description: `${base.description} - ${size ? size : ''} ${cert ? '- ' + cert : ''}. Nguồn: ${region}.`,
          category: base.category,
          tags: `${base.tags},${cert || ''},${region}`,
          originalPrice: originalPriceRounded,
          discountPrice: discountPrice,
          stock: Math.floor(20 + Math.random() * 480),
          images,
          shopId: shopPick._id,
          shop: {
            name: shopPick.name,
            shop_avatar: { public_id: "test", url: shopPick.avatar },
            ratings: 4 + Math.round(Math.random() * 10) / 10
          },
          sold_out: Math.floor(Math.random() * 50),
          ratings: 3.5 + Math.round(Math.random() * 15) / 10
        });
      }
    }

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
    console.log("🎉 Creating farm events with QR codes...");
    const eventsData = [
      {
        name: "Harvest Festival - FreshFarm 2025",
        description: "Lễ hội thu hoạch và bán sản phẩm tươi ngon từ trang trại FreshFarm. Nhiều ưu đãi cho khách tham quan.",
        category: "Farm Events",
        start_Date: new Date(),
        Finish_Date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        originalPrice: 0,
        discountPrice: 0,
        stock: 0,
        images: ["https://picsum.photos/seed/event1/1200/600"],
        shopId: shops[0]._id,
        shop: {
          name: shops[0].name,
          shop_avatar: { public_id: "test", url: shops[0].avatar },
          ratings: 4.8
        },
        sold_out: 0,
        tags: "harvest,farm,freshfarm"
      },
      {
        name: "Organic Market - Green Valley",
        description: "Chợ nông sản hữu cơ với các gian hàng từ Green Valley Farm và đối tác, giảm giá đặc biệt cho combo rau củ.",
        category: "Farm Events",
        start_Date: new Date(),
        Finish_Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        originalPrice: 0,
        discountPrice: 0,
        stock: 0,
        images: ["https://picsum.photos/seed/event2/1200/600"],
        shopId: shops[1]._id,
        shop: {
          name: shops[1].name,
          shop_avatar: { public_id: "test", url: shops[1].avatar },
          ratings: 4.6
        },
        sold_out: 0,
        tags: "organic,market,greenvalley"
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