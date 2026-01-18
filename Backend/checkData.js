import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from './models/faculty.js';
import Program from './models/program.js';
import Subject from './models/subject.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check Faculty
    const facultyCount = await Faculty.countDocuments();
    console.log(`\n📊 Faculty Collection:`);
    console.log(`   Total records: ${facultyCount}`);
    if (facultyCount > 0) {
      const sampleFaculty = await Faculty.find().limit(3).select('name email branch designation');
      console.log('   Sample records:');
      sampleFaculty.forEach(f => {
        console.log(`   - ${f.name} (${f.email}) - ${f.branch} - ${f.designation}`);
      });
    }

    // Check Programs
    const programCount = await Program.countDocuments();
    console.log(`\n📊 Program Collection:`);
    console.log(`   Total records: ${programCount}`);
    if (programCount > 0) {
      const samplePrograms = await Program.find().limit(3).select('name code duration');
      console.log('   Sample records:');
      samplePrograms.forEach(p => {
        console.log(`   - ${p.name} (${p.code}) - Duration: ${p.duration} years`);
      });
    }

    // Check Subjects
    const subjectCount = await Subject.countDocuments();
    console.log(`\n📊 Subject Collection:`);
    console.log(`   Total records: ${subjectCount}`);
    if (subjectCount > 0) {
      const sampleSubjects = await Subject.find().limit(3).select('name code branch');
      console.log('   Sample records:');
      sampleSubjects.forEach(s => {
        console.log(`   - ${s.name} (${s.code}) - Branch: ${s.branch}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();
