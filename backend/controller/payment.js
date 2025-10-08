const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Omprakash",
      },
        // Validate amount
        const amount = req.body?.amount;
        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
          return res.status(400).json({ success: false, message: 'Invalid amount. Expect a positive integer in smallest currency unit.' });
        }

        // Stripe requires a minimum amount (50 cents) in many currencies after conversion.
        // If frontend sends amount in cents (USD), ensure it's at least 50.
        if (amount < 50) {
          return res.status(400).json({ success: false, message: 'Amount too small. Minimum is $0.50 (50 cents).' });
        }

        const myPayment = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          metadata: {
            company: "Omprakash",
          },
        });

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
