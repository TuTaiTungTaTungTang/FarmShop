// Script để generate QR codes cho tất cả products hiện có
require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
const Product = require("./model/product");
const { generateProductQR } = require("./utils/qrGenerator");

const generateQRForAllProducts = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to database");
    
    const products = await Product.find({}).populate('shop');
    console.log(`📊 Found ${products.length} products`);
    
    let generated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const product of products) {
      try {
        if (!product.qrCode && !product.traceabilityId) {
          console.log(`🔄 Generating QR for: ${product.name}`);
          
          const qrResult = await generateProductQR(product._id, product);
          
          if (qrResult.success) {
            product.qrCode = qrResult.qrCodePath;
            product.qrCodeUrl = qrResult.qrCodeUrl;
            product.traceabilityId = qrResult.traceabilityId;
            await product.save();
            
            generated++;
            console.log(`✅ Generated QR: ${product.name}`);
          } else {
            errors++;
            console.log(`❌ Failed QR: ${product.name} - ${qrResult.message}`);
          }
        } else {
          skipped++;
          console.log(`⏭️  Skipped (already has QR): ${product.name}`);
        }
      } catch (error) {
        errors++;
        console.log(`❌ Error processing ${product.name}:`, error.message);
      }
    }
    
    console.log("\n📈 QR Generation Summary:");
    console.log(`✅ Generated: ${generated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${products.length}`);
    
    console.log("\n🎉 QR generation completed!");
    
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database disconnected");
    process.exit(0);
  }
};

// Check if products already have QR codes
const checkQRStatus = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    
    const totalProducts = await Product.countDocuments();
    const productsWithQR = await Product.countDocuments({ 
      qrCode: { $exists: true, $ne: null },
      traceabilityId: { $exists: true, $ne: null }
    });
    const productsWithoutQR = totalProducts - productsWithQR;
    
    console.log("📊 QR Status Check:");
    console.log(`📦 Total products: ${totalProducts}`);
    console.log(`✅ Products with QR: ${productsWithQR}`);
    console.log(`❌ Products without QR: ${productsWithoutQR}`);
    
    await mongoose.connection.close();
    
    return { totalProducts, productsWithQR, productsWithoutQR };
  } catch (error) {
    console.error("❌ Error checking QR status:", error);
    process.exit(1);
  }
};

// Main execution
const main = async () => {
  console.log("🌱 QR Code Generator for Existing Products");
  console.log("==========================================\n");
  
  const status = await checkQRStatus();
  
  if (status.productsWithoutQR > 0) {
    console.log(`\n🔄 Generating QR codes for ${status.productsWithoutQR} products...\n`);
    await generateQRForAllProducts();
  } else {
    console.log("\n✅ All products already have QR codes!");
    process.exit(0);
  }
};

main();