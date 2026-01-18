import express from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import {
  getAdminProfile,
  getAllPrograms,
  createProgram,
  bulkUploadPrograms,
  updateProgram,
  deleteProgram,
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  bulkUploadBatches,
  getStudents,
  bulkUploadStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  bulkUploadFaculty,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  bulkUploadSubjects,
  getAllHODs,
  createHOD,
  bulkUploadHODs,
  updateHOD,
  deleteHOD,
  bulkUploadBranches,
  getSubjectMapping,
  createSubjectMapping,
  bulkUploadSubjectMapping,
  updateSubjectMapping,
  deleteSubjectMapping
} from '../controllers/adminController.js';
import { downloadTemplate } from '../controllers/templateController.js';

const router = express.Router();

// Get admin profile
router.get('/profile', auth, isAdmin, getAdminProfile);

// ============ TEMPLATE DOWNLOADS ============

// Download Excel templates for bulk upload
router.get('/template/:type', auth, isAdmin, downloadTemplate);

// ============ BRANCH MANAGEMENT ============

// Bulk upload branches
router.post('/branches/bulk', auth, isAdmin, bulkUploadBranches);

// ============ PROGRAM MANAGEMENT ============

// Get all programs
router.get('/programs', auth, isAdmin, getAllPrograms);

// Bulk upload programs
router.post('/programs/bulk', auth, isAdmin, bulkUploadPrograms);

// Create program
router.post('/programs', auth, isAdmin, createProgram);

// Update program
router.put('/programs/:id', auth, isAdmin, updateProgram);

// Delete program
router.delete('/programs/:id', auth, isAdmin, deleteProgram);

// ============ BATCH MANAGEMENT ============

// Get batches (with optional filtering)
router.get('/batches', auth, isAdmin, getBatches);

// Bulk upload batches
router.post('/batches/bulk', auth, isAdmin, bulkUploadBatches);

// Create batch
router.post('/batches', auth, isAdmin, createBatch);

// Update batch
router.put('/batches/:id', auth, isAdmin, updateBatch);

// Delete batch
router.delete('/batches/:id', auth, isAdmin, deleteBatch);

// ============ STUDENT MANAGEMENT ============

// Get students (with filtering and pagination)
router.get('/students', auth, isAdmin, getStudents);

// Bulk upload students
router.post('/students/bulk', auth, isAdmin, bulkUploadStudents);

// Create single student
router.post('/students', auth, isAdmin, createStudent);

// Update student
router.put('/students/:id', auth, isAdmin, updateStudent);

// Delete student
router.delete('/students/:id', auth, isAdmin, deleteStudent);

// ============ FACULTY MANAGEMENT ============

// Get all faculty
router.get('/faculty', auth, isAdmin, getAllFaculty);

// Bulk upload faculty
router.post('/faculty/bulk', auth, isAdmin, bulkUploadFaculty);

// Create faculty
router.post('/faculty', auth, isAdmin, createFaculty);

// Update faculty
router.put('/faculty/:id', auth, isAdmin, updateFaculty);

// Delete faculty
router.delete('/faculty/:id', auth, isAdmin, deleteFaculty);

// ============ SUBJECT MANAGEMENT ============

// Get all subjects
router.get('/subjects', auth, isAdmin, getAllSubjects);

// Bulk upload subjects
router.post('/subjects/bulk', auth, isAdmin, bulkUploadSubjects);

// Create subject
router.post('/subjects', auth, isAdmin, createSubject);

// Update subject
router.put('/subjects/:id', auth, isAdmin, updateSubject);

// Delete subject
router.delete('/subjects/:id', auth, isAdmin, deleteSubject);

// ============ HOD MANAGEMENT ============

// Get all HODs
router.get('/hods', auth, isAdmin, getAllHODs);

// Bulk upload HODs
router.post('/hods/bulk', auth, isAdmin, bulkUploadHODs);

// Create HOD
router.post('/hods', auth, isAdmin, createHOD);

// Update HOD
router.put('/hods/:id', auth, isAdmin, updateHOD);

// Delete HOD
router.delete('/hods/:id', auth, isAdmin, deleteHOD);

// ============ SUBJECT MAPPING MANAGEMENT ============

// Get subject mappings with filters
router.get('/subject-mapping', auth, isAdmin, getSubjectMapping);

// Create or update single subject mapping
router.post('/subject-mapping', auth, isAdmin, createSubjectMapping);

// Bulk upload subject mappings
router.post('/subject-mapping/bulk', auth, isAdmin, bulkUploadSubjectMapping);

// Update subject mapping
router.put('/subject-mapping/:id', auth, isAdmin, updateSubjectMapping);

// Delete subject mapping
router.delete('/subject-mapping/:id', auth, isAdmin, deleteSubjectMapping);

export default router;
