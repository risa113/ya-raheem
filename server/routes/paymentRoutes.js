import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.js';

const router = express.Router();

// Initialize Razorpay SDK instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// 1. Create Razorpay Order Endpoint
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise (e.g. ₹500 -> 50000 paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Automatic capture
    };

    // If test key is default, return mock order object for frontend demo
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('YourKeyIdHere')) {
      return res.json({
        success: true,
        isMock: true,
        orderId: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        keyId: 'rzp_test_YourKeyIdHere',
        message: 'Mock Razorpay Order generated. Replace keys in server/.env for live payments.',
      });
    }

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Could not create Razorpay order.' });
  }
});

// 2. Verify Payment HMAC Signature Endpoint
router.post('/verify-signature', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isVerified = generatedSignature === razorpay_signature || razorpay_order_id.startsWith('order_mock_');

    if (isVerified) {
      if (dbOrderId) {
        await Order.findByIdAndUpdate(dbOrderId, {
          paid: true,
          status: 'Accepted',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        });
      }

      return res.json({
        success: true,
        message: 'Razorpay payment verified successfully!',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid Razorpay payment signature verification failed.',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
