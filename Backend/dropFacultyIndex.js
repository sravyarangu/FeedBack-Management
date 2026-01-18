import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropFacultyIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('faculties');

    // List all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the facultyId index if it exists
    try {
      await collection.dropIndex('facultyId_1');
      console.log('✓ Successfully dropped facultyId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index facultyId_1 does not exist');
      } else {
        throw error;
      }
    }

    // List indexes after dropping
    const indexesAfter = await collection.indexes();
    console.log('Indexes after dropping:', indexesAfter);

    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropFacultyIndex();
