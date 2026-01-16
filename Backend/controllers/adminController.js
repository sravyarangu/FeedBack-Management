import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';
import Student from '../models/student.js';
import Faculty from '../models/faculty.js';
import Program from '../models/program.js';
import Batch from '../models/batch.js';
import Subject from '../models/subject.js';
import HOD from '../models/hod.js';
import SubjectMap from '../models/subjectMap.js';

// ============ ADMIN PROFILE ============

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json({ success: true, admin });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ PROGRAM MANAGEMENT ============

export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort('name');
    res.json({ success: true, programs });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProgram = async (req, res) => {
  try {
    const { name, code, duration, branches } = req.body;

    if (!name || !code || !duration) {
      return res.status(400).json({ message: 'Name, code, and duration are required' });
    }

    const program = new Program({ name, code, duration, branches });
    await program.save();

    res.status(201).json({ 
      success: true, 
      message: 'Program created successfully',
      program 
    });
  } catch (error) {
    console.error('Create program error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Program with this name or code already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const { name, code, duration, branches, isActive } = req.body;

    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { name, code, duration, branches, isActive },
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ 
      success: true, 
      message: 'Program updated successfully',
      program 
    });
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk Upload Programs
export const bulkUploadPrograms = async (req, res) => {
  try {
    const { programs } = req.body;

    if (!Array.isArray(programs) || programs.length === 0) {
      return res.status(400).json({ message: 'Invalid program data' });
    }

    console.log(`Processing ${programs.length} programs for bulk upload...`);

    const results = {
      success: [],
      failed: []
    };

    const bulkOps = [];

    for (const programData of programs) {
      try {
        // Validate required fields
        if (!programData.name || !programData.duration) {
          results.failed.push({ 
            name: programData.name || 'UNKNOWN', 
            error: 'Missing required fields (name or duration)' 
          });
          continue;
        }

        // Generate code from name if not provided (e.g., "BTECH" from "BTech")
        const code = programData.code || programData.name.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Prepare bulk operation (upsert)
        bulkOps.push({
          updateOne: {
            filter: { name: programData.name },
            update: { 
              $set: {
                name: programData.name,
                code: code,
                duration: Number(programData.duration),
                branches: programData.branches || [],
                isActive: true
              }
            },
            upsert: true
          }
        });
        
      } catch (error) {
        console.error(`✗ Failed to prepare ${programData.name}:`, error.message);
        results.failed.push({ 
          name: programData.name, 
          error: error.message 
        });
      }
    }

    // Execute bulk operation if there are valid programs
    if (bulkOps.length > 0) {
      const bulkResult = await Program.bulkWrite(bulkOps, { ordered: false });
      
      console.log(`✓ Bulk operation complete:`);
      console.log(`  - Inserted: ${bulkResult.upsertedCount}`);
      console.log(`  - Updated: ${bulkResult.modifiedCount}`);
      console.log(`  - Matched: ${bulkResult.matchedCount}`);
      
      results.success = bulkOps.map(op => ({
        name: op.updateOne.update.$set.name,
        action: bulkResult.upsertedCount > 0 ? 'created' : 'updated'
      }));
    }

    console.log(`Bulk upload complete: ${results.success.length} succeeded, ${results.failed.length} failed`);

    res.json({ 
      success: true, 
      message: `Processed ${programs.length} programs: ${results.success.length} successful, ${results.failed.length} failed`,
      results 
    });
  } catch (error) {
    console.error('Bulk upload programs error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ============ BATCH MANAGEMENT ============

export const getBatches = async (req, res) => {
  try {
    const { program, branch } = req.query;
    const filter = {};
    
    if (program) filter.program = program;
    if (branch) filter.branch = branch;

    const batches = await Batch.find(filter).sort({ admittedYear: -1 });
    res.json({ success: true, batches });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBatch = async (req, res) => {
  try {
    const { program, admittedYear, branch, regulation, studentsCount } = req.body;

    if (!program || !admittedYear || !branch) {
      return res.status(400).json({ message: 'Program, admitted year, and branch are required' });
    }

    const batch = new Batch({ 
      program, 
      admittedYear, 
      branch, 
      regulation, 
      studentsCount: studentsCount || 0 
    });
    await batch.save();

    res.status(201).json({ 
      success: true, 
      message: 'Batch created successfully',
      batch 
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const { program, admittedYear, branch, regulation, studentsCount, isActive } = req.body;

    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { program, admittedYear, branch, regulation, studentsCount, isActive },
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json({ 
      success: true, 
      message: 'Batch updated successfully',
      batch 
    });
  } catch (error) {
    console.error('Update batch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json({ success: true, message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Delete batch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ STUDENT MANAGEMENT ============

export const getStudents = async (req, res) => {
  try {
    const { program, branch, admittedYear, page = 1, limit = 50, search } = req.query;
    const filter = {};
    
    if (program) filter.program = program;
    if (branch) filter.branch = branch;
    if (admittedYear) filter.admittedYear = parseInt(admittedYear);
    
    // Add search functionality for roll number or name
    if (search) {
      filter.$or = [
        { rollNo: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const students = await Student.find(filter)
      .select('-__v')
      .sort('rollNo')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Student.countDocuments(filter);

    console.log(`Retrieved ${students.length} students. Total: ${total}`);

    res.json({ 
      success: true, 
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkUploadStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Invalid student data' });
    }

    console.log(`Processing ${students.length} students for bulk upload...`);

    const results = {
      success: [],
      failed: []
    };

    // Use bulkWrite for better performance
    const bulkOps = [];
    
    for (const studentData of students) {
      try {
        // Validate required fields
        if (!studentData.rollNo || !studentData.name || !studentData.dob) {
          results.failed.push({ 
            rollNo: studentData.rollNo || 'UNKNOWN', 
            error: 'Missing required fields (rollNo, name, or dob)' 
          });
          continue;
        }

        // Calculate currentYear if admittedYear is provided
        if (studentData.admittedYear && studentData.program) {
          const currentCalendarYear = new Date().getFullYear();
          const yearsSinceAdmission = currentCalendarYear - studentData.admittedYear;
          
          // Try to get duration from Program collection
          let maxYears = 4; // default
          try {
            const program = await Program.findOne({ 
              $or: [
                { name: studentData.program },
                { name: { $regex: new RegExp(`^${studentData.program}$`, 'i') } },
                { code: studentData.program }
              ]
            });
            
            if (program && program.duration) {
              maxYears = program.duration;
            } else {
              // Fallback to hardcoded values if program not found
              const programYears = {
                'BTECH': 4, 'BTech': 4, 'B.Tech': 4,
                'MTECH': 2, 'MTech': 2, 'M.Tech': 2,
                'MBA': 2, 'MCA': 2
              };
              maxYears = programYears[studentData.program] || 4;
            }
          } catch (error) {
            console.log(`Could not fetch program duration for ${studentData.program}, using fallback`);
            const programYears = {
              'BTECH': 4, 'BTech': 4, 'B.Tech': 4,
              'MTECH': 2, 'MTech': 2, 'M.Tech': 2,
              'MBA': 2, 'MCA': 2
            };
            maxYears = programYears[studentData.program] || 4;
          }
          
          studentData.currentYear = Math.max(1, Math.min(yearsSinceAdmission, maxYears));
          studentData.semester = (studentData.currentYear * 2) - 1; // First semester of current year
        }
        
        // Prepare bulk operation (upsert)
        bulkOps.push({
          updateOne: {
            filter: { rollNo: studentData.rollNo },
            update: { $set: studentData },
            upsert: true
          }
        });
        
      } catch (error) {
        console.error(`✗ Failed to prepare ${studentData.rollNo}:`, error.message);
        results.failed.push({ 
          rollNo: studentData.rollNo, 
          error: error.message 
        });
      }
    }

    // Execute bulk operation if there are valid students
    if (bulkOps.length > 0) {
      const bulkResult = await Student.bulkWrite(bulkOps, { ordered: false });
      
      console.log(`✓ Bulk operation complete:`);
      console.log(`  - Inserted: ${bulkResult.upsertedCount}`);
      console.log(`  - Updated: ${bulkResult.modifiedCount}`);
      console.log(`  - Matched: ${bulkResult.matchedCount}`);
      
      results.success = bulkOps.map(op => ({
        rollNo: op.updateOne.update.$set.rollNo,
        action: bulkResult.upsertedCount > 0 ? 'created' : 'updated'
      }));
    }

    console.log(`Bulk upload complete: ${results.success.length} succeeded, ${results.failed.length} failed`);

    res.json({ 
      success: true, 
      message: `Processed ${students.length} students: ${results.success.length} successful, ${results.failed.length} failed`,
      results 
    });
  } catch (error) {
    console.error('Bulk upload students error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Bulk Upload HODs
export const bulkUploadHODs = async (req, res) => {
  try {
    const { hods } = req.body;

    if (!Array.isArray(hods) || hods.length === 0) {
      return res.status(400).json({ message: 'Invalid HOD data' });
    }

    console.log(`Processing ${hods.length} HODs for bulk upload...`);

    const results = {
      success: [],
      failed: []
    };

    // Default password
    const defaultPassword = 'Hod@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const bulkOps = [];
    const hodsToSendEmail = [];

    for (const hodData of hods) {
      try {
        // Validate required fields
        if (!hodData.name || !hodData.email || !hodData.branch) {
          results.failed.push({ 
            email: hodData.email || 'UNKNOWN', 
            error: 'Missing required fields (name, email, or branch)' 
          });
          continue;
        }

        // Generate username from email (part before @)
        const username = hodData.email.split('@')[0];
        
        // Generate reset token
        const resetToken = jwt.sign(
          { email: hodData.email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        const resetPasswordExpire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Prepare HOD data
        const hodDocument = {
          name: hodData.name,
          email: hodData.email,
          username: username,
          password: hashedPassword,
          branch: hodData.branch,
          designation: hodData.designation || 'HOD',
          program: hodData.program || 'BTECH',
          resetPasswordToken: resetToken,
          resetPasswordExpire: resetPasswordExpire,
          isActive: true
        };

        bulkOps.push({
          updateOne: {
            filter: { email: hodData.email },
            update: { $set: hodDocument },
            upsert: true
          }
        });

        // Store for email sending
        hodsToSendEmail.push({
          name: hodData.name,
          email: hodData.email,
          resetToken: resetToken
        });
        
      } catch (error) {
        console.error(`✗ Failed to prepare ${hodData.email}:`, error.message);
        results.failed.push({ 
          email: hodData.email, 
          error: error.message 
        });
      }
    }

    // Execute bulk operation
    if (bulkOps.length > 0) {
      const bulkResult = await HOD.bulkWrite(bulkOps, { ordered: false });
      
      console.log(`✓ Bulk operation complete:`);
      console.log(`  - Inserted: ${bulkResult.upsertedCount}`);
      console.log(`  - Updated: ${bulkResult.modifiedCount}`);
      console.log(`  - Matched: ${bulkResult.matchedCount}`);
      
      // Send password reset emails
      console.log(`\n📧 Sending password reset emails to ${hodsToSendEmail.length} HODs...`);
      
      for (const hod of hodsToSendEmail) {
        try {
          const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${hod.resetToken}`;
          
          console.log(`📧 Email sent to ${hod.email}`);
          console.log(`   Reset URL: ${resetUrl}`);
          console.log(`   Name: ${hod.name}`);
          
          // TODO: Integrate actual email service (nodemailer, SendGrid, etc.)
          // For now, just logging the reset link
          // await sendEmail({
          //   to: hod.email,
          //   subject: 'Account Created - Reset Your Password',
          //   html: `
          //     <h2>Welcome ${hod.name}!</h2>
          //     <p>Your HOD account has been created.</p>
          //     <p>Default Password: Hod@123</p>
          //     <p>Please click the link below to set your new password:</p>
          //     <a href="${resetUrl}">Reset Password</a>
          //     <p>This link will expire in 7 days.</p>
          //   `
          // });
          
          results.success.push({
            email: hod.email,
            action: 'created',
            resetLinkSent: true
          });
        } catch (emailError) {
          console.error(`✗ Failed to send email to ${hod.email}:`, emailError.message);
          results.success.push({
            email: hod.email,
            action: 'created',
            resetLinkSent: false,
            emailError: 'Email service not configured'
          });
        }
      }
    }

    console.log(`\nBulk upload complete: ${results.success.length} succeeded, ${results.failed.length} failed`);

    res.json({ 
      success: true, 
      message: `Processed ${hods.length} HODs: ${results.success.length} successful, ${results.failed.length} failed`,
      results,
      note: 'Email service not configured. Reset links logged to console.'
    });
  } catch (error) {
    console.error('Bulk upload HODs error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const studentData = req.body;

    if (!studentData.rollNo || !studentData.name || !studentData.dob) {
      return res.status(400).json({ message: 'Roll Number, Name, and DOB are required' });
    }

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully',
      student 
    });
  } catch (error) {
    console.error('Create student error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ 
      success: true, 
      message: 'Student updated successfully',
      student 
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ FACULTY MANAGEMENT ============

export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort('name');
    res.json({ success: true, faculty });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const { facultyId, name, email, department, designation } = req.body;

    if (!facultyId || !name || !email) {
      return res.status(400).json({ message: 'Faculty ID, name, and email are required' });
    }

    const faculty = new Faculty({ facultyId, name, email, department, designation });
    await faculty.save();

    res.status(201).json({ 
      success: true, 
      message: 'Faculty created successfully',
      faculty 
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Faculty with this ID or email already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { facultyId, name, email, department, designation, isActive } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { facultyId, name, email, department, designation, isActive },
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({ 
      success: true, 
      message: 'Faculty updated successfully',
      faculty 
    });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ SUBJECT MANAGEMENT ============

export const getAllSubjects = async (req, res) => {
  try {
    const { program, branch } = req.query;
    const filter = {};
    
    if (program) filter.program = program;
    if (branch) filter.branch = branch;

    const subjects = await Subject.find(filter).sort({ program: 1, year: 1, semester: 1 });
    res.json({ success: true, subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { subjectCode, subjectName, program, branch, regulation, year, semester, credits } = req.body;

    if (!subjectCode || !subjectName || !program || !year || !semester) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const subject = new Subject({ 
      subjectCode, 
      subjectName, 
      program, 
      branch, 
      regulation, 
      year, 
      semester, 
      credits 
    });
    await subject.save();

    res.status(201).json({ 
      success: true, 
      message: 'Subject created successfully',
      subject 
    });
  } catch (error) {
    console.error('Create subject error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject with this code already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ 
      success: true, 
      message: 'Subject updated successfully',
      subject 
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ HOD MANAGEMENT ============

export const getAllHODs = async (req, res) => {
  try {
    const hods = await HOD.find().select('-password').sort('branch');
    res.json({ success: true, hods });
  } catch (error) {
    console.error('Get HODs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createHOD = async (req, res) => {
  try {
    const { username, password, name, email, branch, program } = req.body;

    if (!username || !password || !name || !email || !branch || !program) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const hod = new HOD({ 
      username, 
      password: hashedPassword, 
      name, 
      email, 
      branch, 
      program 
    });
    await hod.save();

    res.status(201).json({ 
      success: true, 
      message: 'HOD created successfully',
      hod: { ...hod.toObject(), password: undefined }
    });
  } catch (error) {
    console.error('Create HOD error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'HOD with this username or email already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateHOD = async (req, res) => {
  try {
    const { username, password, name, email, branch, program, isActive } = req.body;
    
    const updateData = { username, name, email, branch, program, isActive };
    
    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const hod = await HOD.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!hod) {
      return res.status(404).json({ message: 'HOD not found' });
    }

    res.json({ 
      success: true, 
      message: 'HOD updated successfully',
      hod 
    });
  } catch (error) {
    console.error('Update HOD error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteHOD = async (req, res) => {
  try {
    const hod = await HOD.findByIdAndDelete(req.params.id);

    if (!hod) {
      return res.status(404).json({ message: 'HOD not found' });
    }

    res.json({ success: true, message: 'HOD deleted successfully' });
  } catch (error) {
    console.error('Delete HOD error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ SUBJECT MAPPING MANAGEMENT ============

export const getSubjectMapping = async (req, res) => {
  try {
    const { program, branch, admittedYear, semester } = req.query;
    const filter = { isActive: true };
    
    if (program) filter.program = program;
    if (branch) filter.branch = branch;
    if (admittedYear) filter.admittedYear = parseInt(admittedYear);
    if (semester) filter.semester = parseInt(semester);

    const mappings = await SubjectMap.find(filter)
      .populate('facultyId', 'facultyId name email designation')
      .populate('subjectId', 'subjectCode subjectName credits')
      .sort({ program: 1, branch: 1, admittedYear: -1, semester: 1 });

    res.json({ success: true, mappings });
  } catch (error) {
    console.error('Get subject mapping error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSubjectMapping = async (req, res) => {
  try {
    const { program, branch, admittedYear, year, semester, subjectId, facultyId, academicYear } = req.body;

    if (!program || !branch || !admittedYear || !year || !semester || !subjectId || !facultyId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if mapping already exists
    let mapping = await SubjectMap.findOne({
      program,
      branch,
      admittedYear,
      semester,
      subjectId
    });

    if (mapping) {
      // Update existing mapping
      mapping.facultyId = facultyId;
      mapping.year = year;
      mapping.academicYear = academicYear;
      mapping.isActive = true;
      await mapping.save();
    } else {
      // Create new mapping
      mapping = new SubjectMap({
        program,
        branch,
        admittedYear,
        year,
        semester,
        subjectId,
        facultyId,
        academicYear,
        isActive: true
      });
      await mapping.save();
    }

    await mapping.populate('facultyId', 'facultyId name email designation');
    await mapping.populate('subjectId', 'subjectCode subjectName credits');

    res.json({ 
      success: true, 
      message: 'Subject mapping saved successfully',
      mapping 
    });
  } catch (error) {
    console.error('Save subject mapping error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mapping already exists for this subject' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkUploadSubjectMapping = async (req, res) => {
  try {
    const { mappings } = req.body;

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return res.status(400).json({ message: 'Invalid mapping data' });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const mapData of mappings) {
      try {
        const { program, branch, admittedYear, year, semester, subjectId, facultyId, academicYear } = mapData;

        // Check if mapping already exists
        let mapping = await SubjectMap.findOne({
          program,
          branch,
          admittedYear,
          semester,
          subjectId
        });

        if (mapping) {
          // Update existing
          mapping.facultyId = facultyId;
          mapping.year = year;
          mapping.academicYear = academicYear;
          mapping.isActive = true;
          await mapping.save();
          results.success.push({ ...mapData, action: 'updated' });
        } else {
          // Create new
          mapping = new SubjectMap(mapData);
          await mapping.save();
          results.success.push({ ...mapData, action: 'created' });
        }
      } catch (error) {
        results.failed.push({ 
          ...mapData, 
          error: error.message 
        });
      }
    }

    res.json({ 
      success: true, 
      message: `Processed ${mappings.length} mappings`,
      results 
    });
  } catch (error) {
    console.error('Bulk subject mapping error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSubjectMapping = async (req, res) => {
  try {
    const mapping = await SubjectMap.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('facultyId', 'facultyId name email designation')
    .populate('subjectId', 'subjectCode subjectName credits');

    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    res.json({ 
      success: true, 
      message: 'Mapping updated successfully',
      mapping 
    });
  } catch (error) {
    console.error('Update subject mapping error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSubjectMapping = async (req, res) => {
  try {
    const mapping = await SubjectMap.findByIdAndDelete(req.params.id);

    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    res.json({ success: true, message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error('Delete subject mapping error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
