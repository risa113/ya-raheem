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

// Global shared order storage in memory if DB connection is offline
let inMemoryOrders = [];

// 1. Fetch All Orders (for Admin Panel & Customer Order Tracking)
router.get('/', async (req, res) => {
  try {
    let orders = [];
    try {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } catch (dbErr) {
      console.warn('MongoDB fetch orders note:', dbErr.message);
    }
    
    // Merge DB orders and in-memory orders without duplicates
    const allOrdersMap = new Map();
    inMemoryOrders.forEach(o => allOrdersMap.set(o.id || o.orderNumber, o));
    orders.forEach(o => {
      const obj = o.toObject ? o.toObject() : o;
      const key = obj.id || obj._id?.toString() || obj.orderNumber;
      allOrdersMap.set(key, { ...obj, id: obj.id || key });
    });

    const combined = Array.from(allOrdersMap.values());
    res.json({ success: true, count: combined.length, orders: combined });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders.' });
  }
});

// 2. Create Order Route
router.post('/', async (req, res) => {
  try {
    const { order } = req.body;
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order object is required.' });
    }

    // Save in memory array first
    const existingIndex = inMemoryOrders.findIndex(o => (o.id && o.id === order.id) || o.orderNumber === order.orderNumber);
    if (existingIndex > -1) {
      inMemoryOrders[existingIndex] = order;
    } else {
      inMemoryOrders.unshift(order);
    }

    // Save in MongoDB if connected
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
      console.warn('MongoDB Order Create Note:', dbErr.message);
    }

    res.json({ success: true, message: 'Order created successfully', order });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Error creating order.' });
  }
});

// 3. Update Order Status Route
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    // Update in-memory array
    inMemoryOrders = inMemoryOrders.map(o => (o.id === id || o.orderNumber === id) ? { ...o, status } : o);

    // Update MongoDB
    try {
      await Order.findOneAndUpdate(
        { $or: [{ id: id }, { orderNumber: id }] },
        { status },
        { new: true }
      );
    } catch (dbErr) {
      console.warn('MongoDB status update note:', dbErr.message);
    }

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Error updating order status.' });
  }
});

// 4. Clear All Orders Route
router.delete('/clear-all', async (req, res) => {
  try {
    inMemoryOrders = [];
    try {
      await Order.deleteMany({});
    } catch (dbErr) {
      console.warn('MongoDB clear orders note:', dbErr.message);
    }
    res.json({ success: true, message: 'All orders cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing orders.' });
  }
});

// 5. Order Notification Route
router.post('/notify-admin', async (req, res) => {
  try {
    const { order } = req.body;
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order data required.' });
    }

    // Save in memory array first
    const existingIndex = inMemoryOrders.findIndex(o => (o.id && o.id === order.id) || o.orderNumber === order.orderNumber);
    if (existingIndex > -1) {
      inMemoryOrders[existingIndex] = order;
    } else {
      inMemoryOrders.unshift(order);
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
