require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
const Product = require("./model/product");

const updateProductToNull = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected successfully");

    // Update sản phẩm Sâu riêng (ID: 695628cfcbbead29897c7ee3)
    const productId = "695628cfcbbead29897c7ee3";
    
    const result = await Product.findByIdAndUpdate(
      productId,
      {
        originalPrice: null,
        discountPrice: null,
        stock: null
      },
      { new: true }
    );

    if (result) {
      console.log("✅ Cập nhật thành công!");
      console.log("Sản phẩm:", result.name);
      console.log("originalPrice:", result.originalPrice);
      console.log("discountPrice:", result.discountPrice);
      console.log("stock:", result.stock);
    } else {
      console.log("❌ Không tìm thấy sản phẩm");
    }

  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

if (require.main === module) {
  updateProductToNull();
}
