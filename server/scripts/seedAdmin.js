const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const email = 'admin@carrental.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
      console.log('Email:', email);
      console.log('Password: Admin@123');
      return process.exit(0);
    }
    const admin = new User({
      name: 'Admin',
      email,
      password: 'Admin@123',
      isAdmin: true
    });
    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password: Admin@123');
  } catch (e) {
    console.error('Failed to seed admin:', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();



