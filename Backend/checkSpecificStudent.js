import mongoose from 'mongoose';
import Student from './models/student.js';

const checkStudent = async () => {
  try {
    const MONGO_URI = "mongodb+srv://sravyaranguwork_db_user:jntugv@cluster0.cpotcnc.mongodb.net/StudentDB";
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");
    
    // Find student by roll number
    const student = await Student.findOne({ rollNo: '23VV1A0552' });
    
    if (!student) {
      console.log('Student not found with roll number: 23VV1A0552');
      await mongoose.connection.close();
      return;
    }
    
    console.log('Student data for 23VV1A0552:');
    console.log('================================');
    console.log(JSON.stringify(student, null, 2));
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkStudent();
