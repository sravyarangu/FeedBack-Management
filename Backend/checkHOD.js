import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import HOD from './models/hod.js';

dotenv.config();

const checkAndCreateHOD = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check existing HODs
    const existingHODs = await HOD.find().select('-password');
    console.log(`📊 Found ${existingHODs.length} HOD(s) in database:\n`);
    
    if (existingHODs.length > 0) {
      existingHODs.forEach((hod, index) => {
        console.log(`${index + 1}. ${hod.name}`);
        console.log(`   Email: ${hod.email}`);
        console.log(`   Username: ${hod.username}`);
        console.log(`   Branch: ${hod.branch}`);
        console.log(`   Active: ${hod.isActive}`);
        console.log('');
      });
      
      console.log('\n⚠️  To login, use:');
      console.log(`   Email: ${existingHODs[0].email}`);
      console.log(`   Password: Hod@123 (if recently uploaded) or check your upload`);
      console.log('\n');
    } else {
      console.log('⚠️  No HODs found! Creating a test HOD...\n');
      
      // Create test HOD
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Hod@123', salt);
      
      const testHOD = new HOD({
        name: 'Test HOD',
        email: 'hod@test.com',
        username: 'hod',
        password: hashedPassword,
        branch: 'CSE',
        program: 'BTECH',
        designation: 'HOD',
        isActive: true
      });
      
      await testHOD.save();
      
      console.log('✅ Test HOD created successfully!\n');
      console.log('📋 Login Credentials:');
      console.log('====================');
      console.log('Email: hod@test.com');
      console.log('Password: Hod@123');
      console.log('====================\n');
    }

    // Test password verification for first HOD
    if (existingHODs.length > 0) {
      console.log('🔐 Testing password for first HOD...');
      const firstHOD = await HOD.findOne({ email: existingHODs[0].email });
      const testPassword = 'Hod@123';
      const isMatch = await bcrypt.compare(testPassword, firstHOD.password);
      
      console.log(`   Testing password: ${testPassword}`);
      console.log(`   Match result: ${isMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);
      
      if (!isMatch) {
        console.log('\n⚠️  Password does not match! Updating to Hod@123...');
        const salt = await bcrypt.genSalt(10);
        firstHOD.password = await bcrypt.hash('Hod@123', salt);
        await firstHOD.save();
        console.log('✅ Password updated successfully!');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  }
};

checkAndCreateHOD();
