require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
const Product = require("./model/product");
const fs = require("fs");
const path = require("path");

const checkQRCodes = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to database");
    
    const products = await Product.find({});
    
    console.log("\n📊 QR CODE STATUS REPORT:");
    console.log("═══════════════════════════════════════");
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   QR Code: ${product.qrCode || '❌ KHÔNG CÓ'}`);
      console.log(`   Traceability ID: ${product.traceabilityId || '❌ KHÔNG CÓ'}`);
      
      if (product.qrCode) {
        const qrPath = path.join(__dirname, 'uploads', product.qrCode);
        const exists = fs.existsSync(qrPath);
        console.log(`   File exists: ${exists ? '✅ YES' : '❌ NO'}`);
      }
    });
    
    const qrCount = products.filter(p => p.qrCode).length;
    console.log(`\n📈 SUMMARY: ${qrCount}/${products.length} products have QR codes`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

checkQRCodes();