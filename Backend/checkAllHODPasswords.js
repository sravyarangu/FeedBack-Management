import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import HOD from './models/hod.js';

dotenv.config();

const checkAllHODPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const allHods = await HOD.find({ isActive: true }).select('email name branch password');
    
    console.log(`📋 Testing passwords for ${allHods.length} HODs:\n`);

    const commonPasswords = ['hod@123', 'Hod@123', 'HOD@123', 'Admin@123', 'admin@123'];

    for (const hod of allHods) {
      console.log(`${hod.name} (${hod.email})`);
      console.log(`   Branch: ${hod.branch}`);
      
      let foundPassword = null;
      for (const pwd of commonPasswords) {
        const match = await bcrypt.compare(pwd, hod.password);
        if (match) {
          foundPassword = pwd;
          break;
        }
      }
      
      if (foundPassword) {
        console.log(`   ✅ Password: ${foundPassword}\n`);
      } else {
        console.log(`   ❌ Password: Not found in common passwords\n`);
      }
    }

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkAllHODPasswords();
