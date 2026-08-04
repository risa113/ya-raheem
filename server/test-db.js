import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';

const testURIs = [
  "mongodb+srv://mohamedthariq113_db_user:midnightfuels%40123@midnight-fuels.nzofkow.mongodb.net/midnight_fuel?retryWrites=true&w=majority&appName=midnight-fuels",
  "mongodb+srv://mohamedthariq113_db_user:midnightfuels123@midnight-fuels.nzofkow.mongodb.net/midnight_fuel?retryWrites=true&w=majority&appName=midnight-fuels",
];

async function test() {
  for (const uri of testURIs) {
    try {
      console.log('Testing URI:', uri.replace(/:[^@]+@/, ':***@'));
      await mongoose.connect(uri);
      console.log('🎉 SUCCESS! Connected with this password.');
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.log('Failed:', err.message);
    }
  }
  process.exit(1);
}

test();
