const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const { generateProductQR, deleteQRFile } = require("../utils/qrGenerator");
const { validateObjectIdParam } = require("../middleware/validation");

// create product
router.post(
  "/create-product",
  isSeller,
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      if (req.seller._id.toString() !== shopId) {
        return next(new ErrorHandler("You can only create products for your own shop", 403));
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {


  const files = req.files;
  // Lấy URL ảnh từ Cloudinary
  const imageUrls = files.map((file) => file.path);

  const productData = req.body;
  productData.images = imageUrls;
  productData.shop = shopId;
  
  // Xử lý các trường có thể null/undefined - set null thay vì delete
  if (!productData.originalPrice || productData.originalPrice === '' || productData.originalPrice === 'undefined' || productData.originalPrice === 'null') {
    productData.originalPrice = null;
  } else {
    const price = Number(productData.originalPrice);
    if (isNaN(price)) {
      productData.originalPrice = null;
    } else {
      productData.originalPrice = price;
    }
  }
  
  if (!productData.discountPrice || productData.discountPrice === '' || productData.discountPrice === 'undefined' || productData.discountPrice === 'null') {
    productData.discountPrice = null;
  } else {
    const price = Number(productData.discountPrice);
    if (isNaN(price)) {
      productData.discountPrice = null;
    } else {
      productData.discountPrice = price;
    }
  }
  
  if (!productData.stock || productData.stock === '' || productData.stock === 'undefined' || productData.stock === 'null') {
    productData.stock = null;
  } else {
    const stockNum = Number(productData.stock);
    if (isNaN(stockNum)) {
      productData.stock = null;
    } else {
      productData.stock = stockNum;
    }
  }

  const product = await Product.create(productData);
        // 🚀 Tự động tạo QR code cho sản phẩm mới (như FaceFarm)
        console.log(`🔄 Generating QR code for product: ${product.name}`);
        const qrResult = await generateProductQR(product._id, productData);
        
        if (qrResult.success) {
          // Cập nhật sản phẩm với thông tin QR
          await Product.findByIdAndUpdate(product._id, {
            qrCode: qrResult.qrCodePath,
            qrCodeUrl: qrResult.qrCodeUrl,
            traceabilityId: qrResult.traceabilityId
          });

          console.log(`✅ QR code generated successfully for: ${product.name}`);
          
          // Lấy sản phẩm đã cập nhật để trả về
          const updatedProduct = await Product.findById(product._id);
          
          res.status(201).json({
            success: true,
            product: updatedProduct,
            qrGenerated: true,
            message: "Sản phẩm và QR code đã được tạo thành công!"
          });
        } else {
          console.log(`⚠️ QR generation failed for: ${product.name} - ${qrResult.message}`);
          
          // Sản phẩm vẫn được tạo thành công dù QR thất bại
          res.status(201).json({
            success: true,
            product,
            qrGenerated: false,
            qrError: qrResult.message,
            message: "Sản phẩm đã được tạo nhưng QR code chưa thể tạo"
          });
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id }).populate("shop");

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const productData = await Product.findById(productId);
      if (!productData) {
        return next(new ErrorHandler("Product not found with this id!", 404));
      }

      if (!productData.shopId || productData.shopId.toString() !== req.seller._id.toString()) {
        return next(new ErrorHandler("You can only delete your own products", 403));
      }

      productData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().populate("shop").sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      if (order.user._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You can only review products from your own orders", 403));
      }

      const hasProductInOrder = order.cart.some(
        (item) => item._id && item._id.toString() === productId
      );
      if (!hasProductInOrder) {
        return next(new ErrorHandler("Product is not in this order", 400));
      }

      const reviewUser = {
        _id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
      };

      const review = {
        user: reviewUser,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user && rev.user._id && rev.user._id.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user && rev.user._id && rev.user._id.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = reviewUser;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        order._id,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().populate("shop").sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// 🔍 Get product traceability info by traceability ID (QR scan endpoint - giống FaceFarm)
router.get(
  "/traceability/:traceId", 
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { traceId } = req.params;
      
      const product = await Product.findOne({ traceabilityId: traceId }).populate("shop");
      
      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm với mã traceability này!", 404));
      }

      // If populate failed or shop doesn't exist, try to fetch shop separately
      let shopData = product.shop;
      if (!shopData && product.shopId) {
        shopData = await Shop.findById(product.shopId);
      }

      if (!shopData) {
        return next(new ErrorHandler("Không tìm thấy thông tin cửa hàng!", 404));
      }

      // Trả về thông tin traceability chi tiết (như FaceFarm)
      const traceabilityInfo = {
        product: {
          _id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          tags: product.tags,
          originalPrice: product.originalPrice,
          discountPrice: product.discountPrice,
          stock: product.stock,
          images: product.images,
          ratings: product.ratings,
          reviews: product.reviews,
          sold_out: product.sold_out,
          createdAt: product.createdAt,
          qrCode: product.qrCode,
          qrCodeUrl: product.qrCodeUrl
        },
        shop: {
          _id: shopData._id,
          name: shopData.name,
          phoneNumber: shopData.phoneNumber,
          address: shopData.address,
          description: shopData.description,
          avatar: shopData.avatar,
          createdAt: shopData.createdAt
        },
        traceability: {
          traceabilityId: product.traceabilityId,
          scanTime: new Date(),
          productAge: Math.floor((new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)), // Số ngày từ khi tạo
          qrCodePath: product.qrCode
        }
      };

      res.status(200).json({
        success: true,
        data: traceabilityInfo,
        message: "Thông tin truy xuất nguồn gốc sản phẩm"
      });

    } catch (error) {
      console.error("Traceability lookup error:", error);
      return next(new ErrorHandler("Lỗi khi truy xuất thông tin sản phẩm!", 500));
    }
  })
);

// � Get single product by id (populated with shop) - used by frontend fallback
router.get(
  "/get-product/:id",
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate("shop");

      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm!", 404));
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Error fetching product by id:", error);
      return next(new ErrorHandler(error.message || "Lỗi máy chủ", 500));
    }
  })
);

// �🔄 Regenerate QR code for existing product (cho seller)
router.put(
  "/regenerate-qr/:id",
  isSeller,
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate("shop");
      
      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm!", 404));
      }

      if (!product.shopId || product.shopId.toString() !== req.seller._id.toString()) {
        return next(new ErrorHandler("Bạn chỉ có thể tạo lại QR cho sản phẩm của shop mình", 403));
      }

      // Xóa QR code cũ nếu có
      if (product.qrCode) {
        deleteQRFile(product.qrCode);
      }

      // Tạo QR code mới
      const qrResult = await generateProductQR(product._id, product);
      
      if (qrResult.success) {
        // Cập nhật với QR code mới
        product.qrCode = qrResult.qrCodePath;
        product.qrCodeUrl = qrResult.qrCodeUrl;
        product.traceabilityId = qrResult.traceabilityId;
        await product.save();

        res.status(200).json({
          success: true,
          message: "QR code đã được tạo lại thành công!",
          qrCode: qrResult.qrCodePath,
          qrCodeUrl: qrResult.qrCodeUrl,
          traceabilityId: qrResult.traceabilityId
        });
      } else {
        return next(new ErrorHandler("Không thể tạo QR code: " + qrResult.message, 500));
      }

    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
