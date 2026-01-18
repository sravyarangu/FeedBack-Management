import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Student from './models/student.js';

const testLogin = async () => {
  try {
    const MONGO_URI = "mongodb+srv://sravyaranguwork_db_user:jntugv@cluster0.cpotcnc.mongodb.net/StudentDB";
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");
    
    // Get first student
    const student = await Student.findOne();
    
    if (!student) {
      console.log('No students found');
      return;
    }
    
    console.log('Student Login Response Data:');
    console.log('================================');
    console.log(JSON.stringify({
      id: student._id,
      rollNo: student.rollNo,
      name: student.name,
      email: student.email,
      dob: student.dob,
      branch: student.branch,
      program: student.program,
      admittedYear: student.admittedYear,
      currentYear: student.currentYear,
      year: student.currentYear,
      semester: student.semester,
      regulation: student.regulation,
      specialisation: student.specialisation,
      role: 'student'
    }, null, 2));
    
    console.log('\n\nLogin Credentials:');
    console.log(`Roll No: ${student.rollNo}`);
    console.log(`Password (DOB): ${student.dob}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
