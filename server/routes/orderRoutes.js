import express from 'express';
import { Order } from '../models/Order.js';

const router = express.Router();
const ADMIN_PHONE = '8608724931';

// Real SMS Dispatcher Function supporting Fast2SMS, 2Factor, and Twilio
async function sendSmsToAdmin(order) {
  const rawAdminPhone = ADMIN_PHONE.replace(/[^0-9]/g, '').slice(-10);
  const itemsSummary = order.items.map(it => `${it.quantity}x ${it.product.name}`).join(', ');
  const messageText = `🔥 MIDNIGHT FUEL NEW ORDER! #${order.orderNumber} | Total: Rs.${order.grandTotal} | Cust: ${order.customer.fullName} (${order.customer.phone}) | Items: ${itemsSummary} | Address: ${order.customer.address}, ${order.customer.area}`;

  console.log(`\n=================================================================`);
  console.log(`🔔 NEW ORDER NOTIFICATION DISPATCHED TO RESTAURANT ADMIN (+91 ${rawAdminPhone})`);
  console.log(`📄 Message: ${messageText}`);
  console.log(`=================================================================\n`);

  let smsSent = false;
  let providerName = '';
  let gatewayResponse = null;

  // 1. Try Fast2SMS Route 1: Dev API
  if (process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY.trim() !== '') {
    try {
      const apiKey = process.env.FAST2SMS_API_KEY.trim();
      
      // Method A: Dev OTP route
      const urlA = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${order.orderNumber.replace(/[^0-9]/g, '') || '1234'}&flash=0&numbers=${rawAdminPhone}`;
      const resA = await fetch(urlA);
      const dataA = await resA.json();
      console.log('📱 Fast2SMS Method A Response:', dataA);
      
      if (dataA.return) {
        smsSent = true;
        providerName = 'Fast2SMS (OTP Route)';
        gatewayResponse = dataA;
      } else {
        // Method B: Quick Transactional route (route=q)
        const urlB = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(messageText)}&flash=0&numbers=${rawAdminPhone}`;
        const resB = await fetch(urlB);
        const dataB = await resB.json();
        console.log('📱 Fast2SMS Method B Response:', dataB);
        if (dataB.return) {
          smsSent = true;
          providerName = 'Fast2SMS (Quick Route)';
          gatewayResponse = dataB;
        } else {
          gatewayResponse = dataB;
        }
      }
    } catch (err) {
      console.error('Fast2SMS Exception:', err.message);
    }
  }

  // 2. Try 2Factor.in Gateway (No IP Restrictions)
  if (!smsSent && process.env.TWO_FACTOR_API_KEY && process.env.TWO_FACTOR_API_KEY.trim() !== '') {
    try {
      const apiKey = process.env.TWO_FACTOR_API_KEY.trim();
      const response = await fetch(`https://2factor.in/API/V1/${apiKey}/SMS/${rawAdminPhone}/${order.orderNumber.replace(/[^0-9]/g, '')}/AUTOGEN`);
      const data = await response.json();
      console.log('📱 2Factor Response:', data);
      if (data.Status === 'Success') {
        smsSent = true;
        providerName = '2Factor.in';
        gatewayResponse = data;
      }
    } catch (err) {
      console.error('2Factor Exception:', err.message);
    }
  }

  return { smsSent, providerName, gatewayResponse, adminPhone: rawAdminPhone };
}

// Order Notification Route
router.post('/notify-admin', async (req, res) => {
  try {
    const { order } = req.body;
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order data required.' });
    }

    // Save order in MongoDB if connected
    try {
      await Order.create({
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        status: order.status || 'Pending',
        orderTime: order.orderTime,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal || order.grandTotal,
        grandTotal: order.grandTotal,
        paid: Boolean(order.paid),
      });
    } catch (dbErr) {
      console.warn('MongoDB Order Save Note:', dbErr.message);
    }

    // Dispatch SMS to Admin Phone +91 86087 24931
    const { smsSent, providerName, gatewayResponse, adminPhone } = await sendSmsToAdmin(order);

    const waText = encodeURIComponent(
      `🔥 NEW ORDER RECEIVED! Order #${order.orderNumber}\nCustomer: ${order.customer.fullName} (${order.customer.phone})\nTotal: ₹${order.grandTotal} (${order.paymentMethod})\nAddress: ${order.customer.address}, ${order.customer.area}`
    );
    const waUrl = `https://wa.me/91${adminPhone}?text=${waText}`;

    res.json({
      success: true,
      message: smsSent 
        ? `Order notification SMS sent to Admin (+91 ${adminPhone}) via ${providerName}!`
        : `Order notification triggered for Admin (+91 ${adminPhone})!`,
      smsSent,
      providerName,
      gatewayResponse,
      adminPhone: `+91 ${adminPhone}`,
      whatsappAlertUrl: waUrl,
    });
  } catch (error) {
    console.error('Admin Order Notification Error:', error);
    res.status(500).json({ success: false, message: 'Error processing order notification.' });
  }
});

export default router;
