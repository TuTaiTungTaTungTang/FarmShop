const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a PaymentIntent
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    // Expect amount in smallest currency unit (cents for USD)
    const amount = req.body?.amount;

    if (amount == null) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // Ensure amount is an integer and positive
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount. Expect a positive integer in smallest currency unit.' });
    }

    // Minimum 50 cents (50) to avoid very small charges
    if (amount < 50) {
      return res.status(400).json({ success: false, message: 'Amount too small. Minimum is $0.50 (50 cents).' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: {
        company: "Omprakash",
      },
    });

    res.status(200).json({ success: true, client_secret: paymentIntent.client_secret });
  })
);

// Return publishable stripe key for client
router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
