require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");

const checkCollections = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    
    console.log("🔍 Checking all collections in database...\n");
    
    // Lấy tất cả collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log("📊 Collections found:");
    console.log("=".repeat(50));
    
    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`${i + 1}. ${collection.name} - ${count} documents`);
    }
    
    console.log("\n" + "=".repeat(50));
    console.log(`📈 Total collections: ${collections.length}`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

checkCollections();