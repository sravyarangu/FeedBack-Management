import mongoose from 'mongoose';
import Student from './models/student.js';

const checkDOB = async () => {
  try {
    const MONGO_URI = "mongodb+srv://sravyaranguwork_db_user:jntugv@cluster0.cpotcnc.mongodb.net/StudentDB";
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");
    
    // Get sample students
    const students = await Student.find().limit(5);
    
    console.log(`Found ${students.length} students in database:\n`);
    
    students.forEach(student => {
      console.log('---');
      console.log(`Roll No: ${student.rollNo}`);
      console.log(`Name: ${student.name}`);
      console.log(`DOB: ${student.dob}`);
      console.log(`DOB Type: ${typeof student.dob}`);
      console.log(`DOB Length: ${student.dob ? student.dob.length : 'N/A'}`);
      console.log(`Is ddmmyyyy format (8 digits)? ${/^\d{8}$/.test(student.dob)}`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDOB();
