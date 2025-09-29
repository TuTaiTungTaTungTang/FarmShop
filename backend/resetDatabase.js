require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");

const resetDatabase = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to database");
    
    console.log("🗑️ Dropping entire database...");
    await mongoose.connection.db.dropDatabase();
    console.log("✅ Database dropped successfully");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database disconnected");
    process.exit(0);
  }
};

resetDatabase();