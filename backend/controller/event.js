const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const { validateObjectIdParam } = require("../middleware/validation");
const router = express.Router();
const fs = require("fs");

// create event
// router.post(
//   "/create-event",
//   upload.array("images"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const shopId = req.body.shopId;
//       const shop = await Shop.findById(shopId);
//       if (!shop) {
//         return next(new ErrorHandler("Shop Id is invalid!", 400));
//       } else {
//         const files = req.files;
//         // Lấy URL ảnh từ Cloudinary
//         const imageUrls = files.map((file) => file.path);

//         const eventData = req.body;
//         eventData.images = imageUrls;
//         eventData.shop = shop;

//         const product = await Event.create(eventData);

//         res.status(201).json({
//           success: true,
//           product,
//         });
//       }
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );
router.post(
  "/create-event",
  isSeller,
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      if (req.seller._id.toString() !== shopId) {
        return next(new ErrorHandler("You can only create events for your own shop", 403));
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }
      const files = req.files;
      if (!files || files.length === 0) {
        return next(new ErrorHandler("Please upload at least one image!", 400));
      }
      const imageUrls = files.map((file) => file.path);

      const eventData = { ...req.body, images: imageUrls, shop: shop._id };
      const product = await Event.create(eventData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events of a shop
router.get(
  "/get-all-events/:id",
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const eventData = await Event.findById(productId);
      if (!eventData) {
        return next(new ErrorHandler("Event not found with this id!", 404));
      }

      if (!eventData.shopId || eventData.shopId.toString() !== req.seller._id.toString()) {
        return next(new ErrorHandler("You can only delete your own events", 403));
      }

      eventData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const event = await Event.findByIdAndDelete(productId);

      if (!event) {
        return next(new ErrorHandler("Event not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// review for a Event
router.put(
  "/create-new-review-event",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { rating, comment, productId, orderId } = req.body;

      const event = await Event.findById(productId);
      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      if (order.user._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You can only review events from your own orders", 403));
      }

      const hasEventInOrder = order.cart.some(
        (item) => item._id && item._id.toString() === productId
      );
      if (!hasEventInOrder) {
        return next(new ErrorHandler("Event is not in this order", 400));
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

      const isReviewed = event.reviews.find(
        (rev) => rev.user && rev.user._id && rev.user._id.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        event.reviews.forEach((rev) => {
          if (rev.user && rev.user._id && rev.user._id.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = reviewUser;
          }
        });
      } else {
        event.reviews.push(review);
      }

      let avg = 0;

      event.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      event.ratings = avg / event.reviews.length;

      await event.save({ validateBeforeSave: false });

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

module.exports = router;
