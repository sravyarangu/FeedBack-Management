import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import HOD from './models/hod.js';

dotenv.config();

const testHODLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const testEmail = 'hod.ece@jntugvcev.edu.in';
    const testPassword = 'Hod@123';

    console.log(`🔍 Testing login for: ${testEmail}`);
    console.log(`   Password to test: ${testPassword}\n`);

    // Find HOD
    const hod = await HOD.findOne({ email: testEmail, isActive: true });

    if (!hod) {
      console.log('❌ HOD not found with this email');
      console.log('\n📋 Available HOD emails:');
      const allHods = await HOD.find({ isActive: true }).select('email name');
      allHods.forEach(h => console.log(`   - ${h.email} (${h.name})`));
      process.exit(0);
    }

    console.log('✅ HOD found:');
    console.log(`   Name: ${hod.name}`);
    console.log(`   Email: ${hod.email}`);
    console.log(`   Username: ${hod.username}`);
    console.log(`   Branch: ${hod.branch}`);
    console.log(`   Program: ${hod.program}`);
    console.log(`   Active: ${hod.isActive}`);
    console.log(`   Stored password hash: ${hod.password.substring(0, 20)}...`);
    console.log(`   Hash length: ${hod.password.length}`);

    // Test password
    console.log('\n🔐 Testing password comparison...');
    const isMatch = await bcrypt.compare(testPassword, hod.password);
    console.log(`   bcrypt.compare('${testPassword}', hashedPassword) = ${isMatch}`);

    if (isMatch) {
      console.log('\n✅ Password is CORRECT - Login should work!');
    } else {
      console.log('\n❌ Password is INCORRECT');
      console.log('\n🔧 Testing other common passwords:');
      const commonPasswords = ['Hod@123', 'hod@123', 'HOD@123', 'Admin@123'];
      for (const pwd of commonPasswords) {
        const match = await bcrypt.compare(pwd, hod.password);
        console.log(`   ${pwd}: ${match ? '✅ MATCH' : '❌ no match'}`);
      }
    }

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testHODLogin();
