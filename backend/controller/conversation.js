const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAuthenticatedOrSeller } = require("../middleware/auth");
const { validateObjectIdParam } = require("../middleware/validation");
const router = express.Router();

// create a new conversation
router.post(
  "/create-new-conversation",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      if (req.user._id.toString() !== userId) {
        return next(new ErrorHandler("Unauthorized conversation creation", 403));
      }

      const isConversationExist = await Conversation.findOne({ groupTitle });

      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

// get seller conversations
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (req.seller._id.toString() !== req.params.id) {
        return next(new ErrorHandler("Unauthorized access to conversations", 403));
      }

      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// get user conversations
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (
        req.user._id.toString() !== req.params.id &&
        req.user.role !== "Admin"
      ) {
        return next(new ErrorHandler("Unauthorized access to conversations", 403));
      }

      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// update the last message
router.put(
  "/update-last-message/:id",
  isAuthenticatedOrSeller,
  validateObjectIdParam("id"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const existingConversation = await Conversation.findById(req.params.id);
      if (!existingConversation) {
        return next(new ErrorHandler("Conversation not found", 404));
      }

      const actorId = req.user ? req.user._id.toString() : req.seller._id.toString();
      const isMember = existingConversation.members.some(
        (memberId) => memberId.toString() === actorId
      );

      if (!isMember) {
        return next(new ErrorHandler("Unauthorized conversation update", 403));
      }

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;
