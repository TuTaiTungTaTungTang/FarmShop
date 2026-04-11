const Messages = require("../model/messages");
const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { upload } = require("../multer");
const { isAuthenticatedOrSeller } = require("../middleware/auth");
const { validateObjectIdParam } = require("../middleware/validation");
const router = express.Router();
const path = require("path");

// create new message
router.post(
  "/create-new-message",
  isAuthenticatedOrSeller,
  upload.single("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;

      const conversation = await Conversation.findById(req.body.conversationId);
      if (!conversation) {
        return next(new ErrorHandler("Conversation not found", 404));
      }

      const actorId = req.user ? req.user._id.toString() : req.seller._id.toString();
      const isMember = conversation.members.some(
        (memberId) => memberId.toString() === actorId
      );

      if (!isMember) {
        return next(new ErrorHandler("Unauthorized to send message", 403));
      }

      if (req.body.sender && req.body.sender.toString() !== actorId) {
        return next(new ErrorHandler("Sender mismatch", 403));
      }

      if (req.file) {
        // Lưu link Cloudinary
        messageData.images = req.file.path;
      }

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  isAuthenticatedOrSeller,
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversation = await Conversation.findById(req.params.id);
      if (!conversation) {
        return next(new ErrorHandler("Conversation not found", 404));
      }

      const actorId = req.user ? req.user._id.toString() : req.seller._id.toString();
      const isMember = conversation.members.some(
        (memberId) => memberId.toString() === actorId
      );

      if (!isMember) {
        return next(new ErrorHandler("Unauthorized to read messages", 403));
      }

      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;
