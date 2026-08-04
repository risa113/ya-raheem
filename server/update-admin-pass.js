import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const NEW_ADMIN_PASSWORD = 'midnightfuels@123';
const ADMIN_PHONE = '8608724931';

async function updateAdminPassword() {
  try {
    console.log('Connecting to MongoDB Atlas Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!');

    // Find user with phone 8608724931
    let userByPhone = await User.findOne({ phone: ADMIN_PHONE });

    if (userByPhone) {
      userByPhone.role = 'admin';
      userByPhone.password = NEW_ADMIN_PASSWORD;
      await userByPhone.save();
      console.log(`✅ User (${userByPhone.fullName} / ${userByPhone.phone}) promoted to ADMIN with password: ${NEW_ADMIN_PASSWORD}`);
    } else {
      let adminUser = await User.findOne({ email: 'admin@midnightfuel.com' });
      if (adminUser) {
        adminUser.phone = ADMIN_PHONE;
        adminUser.password = NEW_ADMIN_PASSWORD;
        await adminUser.save();
        console.log(`✅ Admin updated with phone: ${ADMIN_PHONE}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin user:', error);
    process.exit(1);
  }
}

updateAdminPassword();
