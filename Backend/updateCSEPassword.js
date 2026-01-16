import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import HOD from './models/hod.js';

dotenv.config();

const updateCSEPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const cseEmail = 'hod.cse@jntugvcev.edu.in';
    const newPassword = 'hod@123';

    console.log(`🔄 Updating password for CSE HOD: ${cseEmail}`);
    console.log(`   New password: ${newPassword}\n`);

    // Find CSE HOD
    const hod = await HOD.findOne({ email: cseEmail });

    if (!hod) {
      console.log('❌ CSE HOD not found with this email');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('✅ CSE HOD found:');
    console.log(`   Name: ${hod.name}`);
    console.log(`   Email: ${hod.email}`);
    console.log(`   Branch: ${hod.branch}\n`);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    hod.password = hashedPassword;
    await hod.save();

    console.log('✅ Password updated successfully!\n');

    // Verify the new password
    console.log('🔐 Verifying new password...');
    const isMatch = await bcrypt.compare(newPassword, hod.password);
    console.log(`   Verification: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}\n`);

    if (isMatch) {
      console.log('✅ CSE HOD can now login with:');
      console.log(`   Email: ${cseEmail}`);
      console.log(`   Password: ${newPassword}\n`);
    }

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateCSEPassword();
