require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
const Product = require("./model/product");
const Shop = require("./model/shop");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB for migration...");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

const migrateProducts = async () => {
  try {
    await connectDB();

    // Find all products
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products to migrate...`);

    let updated = 0;
    let failed = 0;

    for (const product of products) {
      try {
        // If shop is an Object (not ObjectId), we need to fix it
        if (product.shop && typeof product.shop === 'object' && product.shop._id) {
          // Shop is already populated as object, set it correctly
          product.shop = product.shop._id;
          await product.save();
          updated++;
          console.log(`✅ Updated product: ${product.name}`);
        } else if (!product.shop && product.shopId) {
          // Shop field is missing, try to find the shop by shopId
          const shop = await Shop.findById(product.shopId);
          if (shop) {
            product.shop = shop._id;
            await product.save();
            updated++;
            console.log(`✅ Fixed product: ${product.name}`);
          }
        }
      } catch (err) {
        failed++;
        console.error(`❌ Failed to migrate product ${product._id}: ${err.message}`);
      }
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

migrateProducts();
