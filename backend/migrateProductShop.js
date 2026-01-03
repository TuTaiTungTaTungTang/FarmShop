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

    // Get the Product collection directly (bypass Mongoose validation)
    const collection = mongoose.connection.collection("products");

    // Step 1: Find products with shop as object, convert to shopId
    const productsWithObjectShop = await Product.find();
    console.log(`📦 Found ${productsWithObjectShop.length} products...`);

    let updated = 0;
    let failed = 0;

    for (const product of productsWithObjectShop) {
      try {
        // If shop is an object with _id, extract the _id
        if (product.shop && typeof product.shop === 'object' && product.shop._id) {
          const shopId = product.shop._id;
          
          // Use raw MongoDB update to avoid schema validation
          await collection.updateOne(
            { _id: product._id },
            { $set: { shop: new mongoose.Types.ObjectId(shopId) } }
          );
          updated++;
          console.log(`✅ Updated product: ${product.name}`);
        } else if (!product.shop && product.shopId) {
          // If shop is missing, set it from shopId
          const shopId = typeof product.shopId === 'string' 
            ? new mongoose.Types.ObjectId(product.shopId)
            : product.shopId;
            
          await collection.updateOne(
            { _id: product._id },
            { $set: { shop: shopId } }
          );
          updated++;
          console.log(`✅ Fixed product: ${product.name}`);
        } else if (product.shop && typeof product.shop === 'object' && !product.shop._id) {
          // shop is an object but doesn't have _id, try to use shopId
          if (product.shopId) {
            const shopId = typeof product.shopId === 'string' 
              ? new mongoose.Types.ObjectId(product.shopId)
              : product.shopId;
              
            await collection.updateOne(
              { _id: product._id },
              { $set: { shop: shopId } }
            );
            updated++;
            console.log(`✅ Fixed product (used shopId): ${product.name}`);
          } else {
            failed++;
            console.warn(`⚠️ Product ${product._id} has invalid shop and no shopId`);
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
