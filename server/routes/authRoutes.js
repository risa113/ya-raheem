import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  );
};

// 1. Fetch All Registered Users with Order Stats (Admin Endpoint)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const allOrders = await Order.find({});

    // Enrich users with order metrics
    const enrichedUsers = users.map(user => {
      const userOrders = allOrders.filter(o => o.customer && (o.customer.phone === user.phone || o.customer.fullName === user.fullName));
      const totalSpent = userOrders.reduce((sum, o) => sum + o.grandTotal, 0);

      return {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email || '',
        role: user.role || 'customer',
        createdAt: user.createdAt,
        addresses: user.addresses || [],
        totalOrders: userOrders.length,
        totalSpent,
        lastOrderTime: userOrders.length > 0 ? userOrders[0].orderTime : 'N/A',
      };
    });

    res.json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    console.error('Fetch Users Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching users.' });
  }
});

// 2. Update User Role / Status (Admin Endpoint)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'User role updated successfully!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Username / Phone / Email & Password Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Phone/Email and Password are required.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { phone: identifier.trim() },
        { fullName: { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } },
      ],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Account not found with this Username, Phone, or Email.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email || '',
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// 4. Register / Sign Up Endpoint
router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, Phone, and Password are required.' });
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const existingUser = await User.findOne({
      $or: [
        { phone: cleanPhone },
        ...(cleanEmail ? [{ email: cleanEmail }] : []),
      ],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this phone number or email already exists.' });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password,
      role: 'customer',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Reset / Forgot Password Endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { phoneOrEmail, newPassword } = req.body;

    if (!phoneOrEmail || !newPassword) {
      return res.status(400).json({ success: false, message: 'Phone/Email and new password are required.' });
    }

    const cleanIdentifier = phoneOrEmail.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { phone: phoneOrEmail.trim() },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this Phone or Email.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating password.' });
  }
});

export default router;
