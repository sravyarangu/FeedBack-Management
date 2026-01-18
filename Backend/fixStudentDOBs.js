import mongoose from 'mongoose';
import Student from './models/student.js';

// Helper function to convert Excel serial number to ddmmyyyy
const convertExcelDateToddmmyyyy = (excelDate) => {
  if (!excelDate) return excelDate;
  
  const numValue = Number(excelDate);
  if (numValue > 0 && numValue < 60000) {
    // Excel date: days since 1900-01-01
    const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
    const date = new Date(excelEpoch.getTime() + numValue * 86400000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  }
  
  return excelDate;
};

const fixStudentDOBs = async () => {
  try {
    const MONGO_URI = "mongodb+srv://sravyaranguwork_db_user:jntugv@cluster0.cpotcnc.mongodb.net/StudentDB";
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");
    
    // Get all students with invalid DOB format
    const students = await Student.find();
    
    console.log(`Found ${students.length} students in database\n`);
    
    let fixed = 0;
    
    for (const student of students) {
      // Check if DOB is not in ddmmyyyy format
      if (!/^\d{8}$/.test(student.dob)) {
        const oldDOB = student.dob;
        const newDOB = convertExcelDateToddmmyyyy(student.dob);
        
        student.dob = newDOB;
        await student.save();
        
        console.log(`✓ Fixed ${student.rollNo}: ${oldDOB} → ${newDOB}`);
        fixed++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} student DOB records`);
    
    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixStudentDOBs();
