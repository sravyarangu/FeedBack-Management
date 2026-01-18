# ADMIN MODULE DOCUMENTATION

## 📚 Overview

The Admin Module is the most powerful module in FBMS with complete system control. Admins manage all master data including students, faculty, HODs, subjects, programs, batches, and regulations. They handle special cases like lateral entries, detained students, batch transfers, and password resets. Admin is responsible for initial system setup and ongoing data maintenance.

---

## 🔐 Authentication

### **Login Credentials**
- **Admin ID**: Unique admin identifier (e.g., ADMIN_001, SUPER_ADMIN)
- **Password**: Highly secure password with regular rotation policy

### **Login Process**
1. Admin navigates to admin login page
2. Enters Admin ID and Password
3. System validates credentials against `admin` collection
4. If valid:
   - JWT token generated with role: "admin" and full permissions
   - Token stored securely
   - Redirected to Admin Dashboard
5. If invalid:
   - Error message: "Invalid Admin Credentials"
   - Failed login attempt logged for security

### **Multi-Factor Authentication** (Recommended)
- OTP via email/SMS for sensitive operations
- IP whitelisting for admin access
- Session timeout after inactivity

---

## 🏠 Admin Dashboard

### **Dashboard Overview**
The Admin Dashboard provides quick access to all management modules and system statistics.

### **Dashboard Components**

#### **Quick Statistics**
```
┌────────────────────────────────────────────────┐
│  SYSTEM OVERVIEW                               │
│                                                │
│  📊 Total Students: 4,500                      │
│  👨‍🏫 Total Faculty: 250                         │
│  🏢 Departments: 8                             │
│  📚 Total Subjects: 450                        │
│  📋 Active Feedback Forms: 12                  │
│  ✅ Feedback Submissions (This Month): 8,500   │
│                                                │
│  🔔 Recent Alerts                              │
│  • 15 detained students require batch update  │
│  • New regulation R24 subjects need upload    │
│  • Password reset requests: 3 pending         │
└────────────────────────────────────────────────┘
```

#### **Management Modules Menu**
1. **Student Management**
2. **Faculty Management**
3. **HOD Management**
4. **Subject Management**
5. **Program Management**
6. **Batch Management**
7. **Feedback Questions Management**
8. **Reports & Analytics**
9. **System Settings**

---

## 👨‍🎓 MODULE 1: STUDENT MANAGEMENT

### **Purpose**
Manage complete student lifecycle: admission, updates, special cases, and account management.

---

### **1.1 Add Students (Bulk Upload)**

#### **Process**
1. Select **Program** (B.Tech, M.Tech, MBA, etc.)
2. Select **Batch** (e.g., 2021-2025)
3. Select **Branch** (CSE, ECE, MECH, etc.)
4. Click **"Upload Excel"**
5. Download template if needed
6. Upload filled Excel file
7. System validates data
8. Preview imported data
9. Confirm and save

#### **Excel Template Format**
| Roll Number | Name | DOB | Email | Program | Branch | Batch Start | Batch End | Regulation | Current Year |
|-------------|------|-----|-------|---------|--------|-------------|-----------|------------|--------------|
| 21B81A0501 | John Doe | 15/05/2003 | john@example.com | B.Tech | CSE | 2021 | 2025 | R20 | 3 |
| 21B81A0502 | Jane Smith | 20/08/2003 | jane@example.com | B.Tech | CSE | 2021 | 2025 | R20 | 3 |

#### **Validation Rules**
- Roll Number: Unique, alphanumeric
- DOB: Valid date format (DD/MM/YYYY)
- Email: Valid format, unique
- Batch Start < Batch End
- Current Year: 1-4 for B.Tech, 1-2 for M.Tech

#### **Error Handling**
- Duplicate roll numbers rejected
- Invalid dates flagged
- Missing mandatory fields highlighted
- Partial success: Valid records imported, invalid ones listed for correction

---

### **1.2 Add Individual Student**

For single student additions or corrections.

**Form Fields**:
```
┌──────────────────────────────────────────┐
│  ADD NEW STUDENT                         │
│                                          │
│  Roll Number: [________________]         │
│  Name: [_________________________]       │
│  Date of Birth: [__/__/____]            │
│  Email: [_________________________]      │
│  Program: [B.Tech ▼]                     │
│  Branch: [CSE ▼]                         │
│  Batch Start: [2021 ▼]                   │
│  Batch End: [2025 ▼]                     │
│  Regulation: [R20 ▼]                     │
│  Current Year: [3 ▼]                     │
│                                          │
│  [Cancel] [Save Student]                 │
└──────────────────────────────────────────┘
```

---

### **1.3 Handle Lateral Entry Students**

Students who join directly in 2nd or 3rd year (e.g., diploma holders).

#### **Process**
1. Go to **Student Management → Lateral Entry**
2. Click **"Add Lateral Entry Student"**
3. Fill details:
   - Roll Number (newly assigned)
   - Name, DOB, Email
   - Program, Branch
   - **Entry Year**: Year they joined (e.g., 2023)
   - **Entry Level**: 2nd Year or 3rd Year
   - Batch: Assign to appropriate existing batch
   - Current Year: Set to their actual academic year
4. System marks student as lateral entry
5. Student will see subjects for their actual year, not calculated from batch

**Example**:
- Lateral entry student joins in 2023 directly to 2nd year
- Assigned to 2022-2026 batch (to graduate with that batch)
- Current Year set to 2
- Will see 2nd year subjects regardless of join date

---

### **1.4 Handle Detained Students**

Students who failed and are repeating a year.

#### **Process**
1. Go to **Student Management → Detained Students**
2. Search for student by roll number
3. Click **"Mark as Detained"**
4. Select:
   - **Detained Year**: Which year they're repeating
   - **New Current Year**: Set to repeated year
   - **New Batch** (optional): Move to another batch if needed
5. Confirm changes
6. System updates student record:
   ```javascript
   {
     roll: "21B81A0501",
     currentYear: 2, // Was 3, now repeating 2nd year
     detained: true,
     detainedHistory: [{
       year: 3,
       detainedAt: Date,
       reason: "Failed in key subjects"
     }]
   }
   ```
7. Student will now see 2nd year subjects on their dashboard

#### **Batch Transfer for Detained**
If student needs to move to a different batch:
- Select new batch (e.g., from 2021-2025 to 2022-2026)
- Update batch_start and batch_end
- Student graduates with new batch

---

### **1.5 Batch Transfer / Branch Change**

Handle students who change branches or transfer batches.

#### **Process**
1. Go to **Student Management → Transfers**
2. Search for student
3. Click **"Transfer Student"**
4. Modify:
   - **New Branch**: If branch change
   - **New Batch**: If batch change
   - **New Regulation**: If regulation changes with branch
   - **Current Year**: Adjust if needed
5. Confirm changes
6. System updates:
   ```javascript
   {
     roll: "21B81A0501",
     branch: "ECE", // Changed from CSE to ECE
     batch_start: 2021,
     regulation: "R20",
     transferHistory: [{
       fromBranch: "CSE",
       toBranch: "ECE",
       transferDate: Date,
       reason: "Personal preference"
     }]
   }
   ```
7. Student sees subjects for new branch/batch

---

### **1.6 Edit Student Details**

Update student information.

1. Search student by roll number or name
2. Click **"Edit"**
3. Modify allowed fields:
   - Name (spelling corrections)
   - Email
   - DOB (corrections only)
   - Current Year (for detained/lateral cases)
4. **Cannot change**: Roll Number (unique identifier)
5. Save changes

---

### **1.7 Delete Student**

Remove student from system (use with caution).

1. Search student
2. Click **"Delete"**
3. Confirmation dialog with warnings:
   - All feedback submissions will be retained (for data integrity)
   - Student account will be deactivated
   - Can be reactivated later if needed
4. Confirm deletion
5. System marks student as inactive (soft delete)

---

### **1.8 Password Reset**

Reset student login credentials.

1. Go to **Student Management → Password Reset**
2. Enter student roll number
3. System generates temporary DOB-based login or allows admin to set new DOB
4. Send reset instructions to student email
5. Student logs in with updated DOB

---

### **1.9 View Student Records**

Search and filter students:
- **By Branch**: View all CSE students
- **By Batch**: View 2021-2025 batch
- **By Year**: View all 3rd year students
- **By Status**: Active, Detained, Lateral Entry
- **Export**: Download student list as Excel

---

## 👨‍🏫 MODULE 2: FACULTY MANAGEMENT

### **Purpose**
Manage faculty records, assignments, and credentials.

---

### **2.1 Add Faculty (Bulk Upload)**

#### **Process**
1. Click **"Faculty Management → Upload Faculty"**
2. Download Excel template
3. Fill faculty details
4. Upload Excel file
5. System validates and imports

#### **Excel Template**
| Faculty ID | Name | Email | Branch | Designation | Joining Date |
|------------|------|-------|--------|-------------|--------------|
| FAC101 | Dr. Smith | smith@college.edu | CSE | Professor | 01/06/2015 |
| FAC102 | Dr. Johnson | johnson@college.edu | CSE | Associate Professor | 15/08/2018 |

---

### **2.2 Add Individual Faculty**

**Form Fields**:
```
┌──────────────────────────────────────────┐
│  ADD NEW FACULTY                         │
│                                          │
│  Faculty ID: [________________]          │
│  Name: [_________________________]       │
│  Email: [_________________________]      │
│  Branch: [CSE ▼]                         │
│  Designation: [Professor ▼]             │
│  Joining Date: [__/__/____]             │
│  Phone: [_________________________]      │
│  Specialization: [__________________]    │
│                                          │
│  [Cancel] [Save Faculty]                 │
└──────────────────────────────────────────┘
```

**Designations**:
- Professor
- Associate Professor
- Assistant Professor
- Lecturer
- Guest Faculty

---

### **2.3 Edit Faculty Details**

1. Search faculty by ID or name
2. Click **"Edit"**
3. Update allowed fields:
   - Name, Email, Phone
   - Designation (promotions)
   - Branch (transfers)
4. Save changes

---

### **2.4 Deactivate Faculty**

For retired or resigned faculty:
1. Search faculty
2. Click **"Deactivate"**
3. Faculty marked as inactive
4. Won't appear in HOD's faculty selection
5. Historical data preserved

---

### **2.5 View Faculty Records**

Filters:
- By Branch
- By Designation
- Active/Inactive status
- Export to Excel

---

## 🏢 MODULE 3: HOD MANAGEMENT

### **Purpose**
Manage HOD accounts and department assignments.

---

### **3.1 Add HOD**

**Form Fields**:
```
┌──────────────────────────────────────────┐
│  ADD NEW HOD                             │
│                                          │
│  HOD ID: [HOD_CSE__________]             │
│  Name: [_________________________]       │
│  Branch: [CSE ▼]                         │
│  Email: [_________________________]      │
│  Password: [____________]                │
│  Confirm Password: [____________]        │
│                                          │
│  [Cancel] [Create HOD Account]           │
└──────────────────────────────────────────┘
```

**Rules**:
- One HOD per branch/department
- HOD ID format: HOD_{BRANCH_CODE}
- Strong password required
- Email must be valid and unique

---

### **3.2 Edit HOD Details**

1. Select branch
2. View current HOD
3. Click **"Edit"**
4. Update Name, Email
5. Save changes

---

### **3.3 Change HOD Password**

1. Go to **HOD Management → Reset Password**
2. Select branch/HOD
3. Enter new password
4. Confirm password
5. Save
6. Notify HOD via email

---

### **3.4 Transfer HOD**

When HOD changes department:
1. Select old HOD
2. Click **"Transfer"**
3. Select new branch
4. Update HOD_ID if needed
5. Save
6. Update access permissions

---

### **3.5 View All HODs**

List of all HODs by department with:
- Name
- Branch
- Email
- Last Login
- Active Forms Published
- Edit/Reset options

---

## 📚 MODULE 4: SUBJECT MANAGEMENT

### **Purpose**
Manage subject database for all programs, regulations, and semesters.

---

### **4.1 Add Subjects (Bulk Upload)**

#### **Process**
1. Go to **Subject Management → Upload Subjects**
2. Select:
   - **Program**: B.Tech, M.Tech, etc.
   - **Branch**: CSE, ECE, etc.
   - **Regulation**: R20, R22, R23, R24
   - **Year**: 1, 2, 3, 4
   - **Semester**: 1-8
3. Download template
4. Fill subject details
5. Upload Excel file
6. Validate and import

#### **Excel Template**
| Subject Code | Subject Name | Type | Credits | Category |
|--------------|--------------|------|---------|----------|
| CS501 | Operating Systems | Theory | 3 | Core |
| CS502 | DBMS | Theory | 3 | Core |
| CS503 | OS Lab | Lab | 1.5 | Core |
| CS5XX | Machine Learning | Theory | 3 | Open Elective |
| CS5YY | Blockchain | Theory | 3 | Professional Elective |

**Types**:
- Theory
- Lab
- Project
- Seminar

**Categories**:
- Core (Mandatory)
- Open Elective
- Professional Elective
- Minor
- Honors

---

### **4.2 Add Individual Subject**

**Form Fields**:
```
┌──────────────────────────────────────────┐
│  ADD NEW SUBJECT                         │
│                                          │
│  Subject Code: [CS501_______]            │
│  Subject Name: [__________________]      │
│  Program: [B.Tech ▼]                     │
│  Branch: [CSE ▼]                         │
│  Regulation: [R22 ▼]                     │
│  Year: [3 ▼]                             │
│  Semester: [5 ▼]                         │
│  Type: [Theory ▼]                        │
│  Category: [Core ▼]                      │
│  Credits: [3 ▼]                          │
│                                          │
│  [Cancel] [Save Subject]                 │
└──────────────────────────────────────────┘
```

---

### **4.3 Edit Subject**

1. Search subject by code or name
2. Click **"Edit"**
3. Update allowed fields (name, credits, type)
4. **Cannot change**: Subject Code (unique identifier)
5. Save changes

---

### **4.4 Delete Subject**

1. Search subject
2. Click **"Delete"**
3. Warning: Check if subject is currently mapped
4. If mapped, cannot delete (must unmap first)
5. Confirm deletion
6. Subject removed from database

---

### **4.5 View Subjects by Semester**

Filter and view:
- By Program, Branch, Regulation
- By Year and Semester
- By Type (Theory/Lab)
- By Category (Core/Elective)
- Export to Excel

---

### **4.6 Copy Subjects Across Regulations**

When new regulation is introduced:
1. Go to **Subject Management → Copy Subjects**
2. Select:
   - **Source Regulation**: R20
   - **Target Regulation**: R22
   - **Program and Branch**: B.Tech CSE
3. System copies all subjects from R20 to R22
4. Admin can then edit/update as needed
5. Saves time for similar regulations

---

## 🎓 MODULE 5: PROGRAM MANAGEMENT

### **Purpose**
Manage academic programs offered by the institution.

---

### **5.1 Add Program**

**Form Fields**:
```
┌──────────────────────────────────────────┐
│  ADD NEW PROGRAM                         │
│                                          │
│  Program Code: [BTECH_____]              │
│  Program Name: [Bachelor of Technology] │
│  Duration (Years): [4 ▼]                 │
│  Total Semesters: [8 ▼]                  │
│  Current Status: [Active ▼]              │
│                                          │
│  [Cancel] [Save Program]                 │
└──────────────────────────────────────────┘
```

**Examples**:
- B.Tech (4 years, 8 semesters)
- M.Tech (2 years, 4 semesters)
- MBA (2 years, 4 semesters)
- MCA (3 years, 6 semesters)

---

### **5.2 View All Programs**

List showing:
- Program Code
- Program Name
- Duration
- Active/Inactive Status
- Total Students Enrolled
- Edit/Deactivate options

---

### **5.3 Deactivate Program**

For discontinued programs:
1. Select program
2. Click **"Deactivate"**
3. Program hidden from new selections
4. Existing students unaffected

---

## 🎒 MODULE 6: BATCH MANAGEMENT

### **Purpose**
Manage student batches and academic years.

---

### **6.1 Create New Batch**

**Form Fields**:
```
┌──────────────────────────────────────────┐
│  CREATE NEW BATCH                        │
│                                          │
│  Batch Start Year: [2024 ▼]             │
│  Batch End Year: [2028 ▼]                │
│  Program: [B.Tech ▼]                     │
│  Regulation: [R24 ▼]                     │
│  Intake Capacity: [________]             │
│                                          │
│  [Cancel] [Create Batch]                 │
└──────────────────────────────────────────┘
```

**Naming Convention**: 2024-2028 (for B.Tech 4-year program)

---

### **6.2 View All Batches**

Shows:
- Batch Name (2021-2025)
- Program
- Regulation
- Total Students
- Current Year
- Status (Active/Completed)

---

### **6.3 Close Batch**

For graduated batches:
1. Select batch
2. Click **"Mark as Completed"**
3. Batch marked inactive
4. Students' accounts remain accessible for records

---

## ❓ MODULE 7: FEEDBACK QUESTIONS MANAGEMENT

### **Purpose**
Configure feedback criteria/questions that students rate.

---

### **7.1 View Current Questions**

Shows list of all feedback criteria currently in use:

**Example Questions**:
1. Subject knowledge of the faculty
2. Communication skills and clarity
3. Use of teaching aids and technology
4. Ability to solve doubts and queries
5. Availability and approachability
6. Encouragement for participation
7. Timely completion of syllabus
8. Fairness in evaluation
9. Regularity and punctuality
10. Overall teaching effectiveness
... (up to 25 criteria)

---

### **7.2 Add New Question**

**Form**:
```
┌──────────────────────────────────────────┐
│  ADD FEEDBACK QUESTION                   │
│                                          │
│  S.No: [16__]                            │
│  Criteria Text:                          │
│  [_____________________________________] │
│  [_____________________________________] │
│                                          │
│  [Cancel] [Add Question]                 │
└──────────────────────────────────────────┘
```

---

### **7.3 Edit Question**

1. Select question
2. Click **"Edit"**
3. Modify text
4. Save
5. **Note**: Applies to future feedback, doesn't change historical data

---

### **7.4 Reorder Questions**

Drag-and-drop interface to reorder criteria sequence.

---

### **7.5 Deactivate Question**

Mark question as inactive (stops appearing in new forms, preserves old data).

---

## 📊 MODULE 8: REPORTS & ANALYTICS

### **Purpose**
Generate system-wide reports and insights.

---

### **8.1 System Reports**

**Available Reports**:
1. **Student Enrollment Report**
   - Total students by branch, batch, year
   - Export to Excel/PDF

2. **Faculty Performance Report**
   - Overall average ratings for all faculty
   - Department-wise breakdown
   - Top and bottom performers

3. **Feedback Submission Report**
   - Response rates by branch, semester
   - Timeline of submissions
   - Pending feedback tracking

4. **Subject-wise Analysis**
   - Best and worst rated subjects
   - Trends over semesters
   - Improvement tracking

5. **Department Comparison**
   - Inter-department performance
   - Best practices identification

---

### **8.2 Custom Reports**

Build custom reports with filters:
- Date range
- Programs/Branches
- Specific faculty/subjects
- Export formats (Excel, PDF, CSV)

---

### **8.3 Audit Logs**

View system activity:
- User logins (Student, HOD, Admin)
- Data modifications (who changed what, when)
- Feedback publications
- Password resets
- Export logs for compliance

---

## ⚙️ MODULE 9: SYSTEM SETTINGS

### **Purpose**
Configure system-wide parameters.

---

### **9.1 Academic Calendar**

Set important dates:
- Semester start/end dates
- Feedback periods (start and end dates)
- Exam schedules
- Holidays

---

### **9.2 Email Templates**

Configure automated emails:
- Feedback reminder to students
- Analytics summary to HODs
- Password reset emails
- Welcome emails for new users

---

### **9.3 Backup & Restore**

- Schedule automatic database backups
- Manual backup trigger
- Restore from backup
- Export all data

---

### **9.4 User Roles & Permissions**

Define custom roles (future enhancement):
- Super Admin
- Department Admin
- Data Entry Operator
- Read-only Analyst

---

## 🎯 What Admins Can Do

### **✅ Admins CAN:**
- Add/Edit/Delete students, faculty, HODs
- Upload bulk data via Excel
- Manage all programs, batches, regulations
- Create and modify subjects for all semesters
- Handle lateral entry and detained students
- Transfer students between branches/batches
- Reset passwords for all users
- Configure feedback questions/criteria
- View system-wide analytics and reports
- Manage academic calendar and schedules
- Configure email templates and notifications
- Backup and restore database
- View audit logs
- Access all modules (Student, HOD, Admin)
- Modify system settings
- Export data to Excel/PDF

### **❌ Admins SHOULD NOT:**
- Modify individual student feedback submissions
- Access student login credentials (DOB is hashed/encrypted)
- Change historical analytics data
- Delete HOD accounts without proper handover
- Remove subjects that are currently in use

---

## 🔄 Complete Admin Workflow

### **Initial System Setup**
1. Create programs (B.Tech, M.Tech, etc.)
2. Create batches (2021-2025, 2022-2026, etc.)
3. Add departments/branches
4. Upload faculty records
5. Create HOD accounts for each department
6. Upload subjects for all regulations and semesters
7. Configure feedback questions
8. Upload student records batch-wise
9. Test system with sample data
10. Go live

### **Semester-wise Operations**
1. Start of semester:
   - Update academic calendar
   - Upload new batch students (if 1st year)
   - Handle lateral entries
   - Update detained students
2. Mid-semester:
   - Handle student transfers
   - Process password reset requests
   - Add/modify faculty as needed
3. Feedback period:
   - Monitor submission rates via reports
   - Assist HODs if mapping issues
4. End of semester:
   - Generate performance reports
   - Archive feedback data
   - Prepare for next semester

---

## 🔧 Technical Implementation

### **Frontend Components**
```
src/pages/admin/
├── AdminLogin.jsx
├── AdminDashboard.jsx
├── StudentManagement.jsx
├── FacultyManagement.jsx
├── HODManagement.jsx
├── SubjectManagement.jsx
├── ProgramManagement.jsx
├── BatchManagement.jsx
├── FeedbackQuestions.jsx
├── Reports.jsx
└── Settings.jsx

src/components/admin/
├── BulkUpload.jsx               # Excel upload component
├── StudentForm.jsx              # Add/Edit student
├── FacultyForm.jsx              # Add/Edit faculty
├── HODForm.jsx                  # Add/Edit HOD
├── SubjectForm.jsx              # Add/Edit subject
├── LateralEntryForm.jsx         # Lateral entry handling
├── DetainedStudentForm.jsx      # Detained handling
├── BatchTransferForm.jsx        # Transfer students
├── DataTable.jsx                # Reusable data table
├── ExportButton.jsx             # Excel/PDF export
└── AuditLog.jsx                 # Activity logs viewer
```

### **API Endpoints**

#### **POST /api/admin/students/bulk-upload**
Multipart form-data with Excel file

#### **POST /api/admin/students/add**
```json
{
  "roll": "21B81A0501",
  "name": "John Doe",
  "dob": "2003-05-15",
  ...
}
```

#### **PUT /api/admin/students/:roll/detain**
```json
{
  "newCurrentYear": 2,
  "newBatch": "2022-2026"
}
```

#### **POST /api/admin/faculty/bulk-upload**
Excel file upload

#### **POST /api/admin/hod/create**
```json
{
  "hod_id": "HOD_CSE",
  "name": "Dr. Smith",
  "branch": "CSE",
  "password": "hashed_password"
}
```

#### **POST /api/admin/subjects/bulk-upload**
Excel with subjects for regulation

#### **GET /api/admin/reports/feedback-summary**
Query: `?startDate=2025-01-01&endDate=2025-06-30`

#### **GET /api/admin/audit-logs**
Query: `?module=student&action=edit&dateRange=...`

---

## 🛡️ Security Best Practices

### **Admin Account Security**
- Strong password requirements (min 12 chars, alphanumeric + special)
- Regular password rotation (every 90 days)
- Two-factor authentication (OTP via email/SMS)
- IP whitelisting (admin access only from specific IPs)
- Session timeout (15 minutes inactivity)

### **Data Protection**
- All passwords hashed with bcrypt
- Student DOB encrypted
- Sensitive data masked in logs
- Regular database backups
- GDPR/compliance adherence

### **Audit Trail**
- Log all admin actions
- Track who modified what and when
- Cannot delete audit logs
- Export logs for compliance reviews

### **Role-Based Access**
- Separate admin roles (Super Admin, Department Admin, etc.)
- Principle of least privilege
- Approval workflows for critical operations

---

## ✅ Testing Checklist

- [ ] Admin can log in securely
- [ ] Can upload student records via Excel
- [ ] Bulk upload validates data correctly
- [ ] Can add individual students
- [ ] Lateral entry handling works
- [ ] Detained student updates work
- [ ] Batch transfers work correctly
- [ ] Can add/edit/delete faculty
- [ ] HOD account creation works
- [ ] Can upload subjects for new regulations
- [ ] Feedback questions can be modified
- [ ] Reports generate correctly
- [ ] Audit logs capture all actions
- [ ] Export to Excel/PDF works
- [ ] Password resets work
- [ ] System settings update properly
- [ ] Cannot delete actively used data

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Excel upload fails | Invalid format | Use provided template exactly |
| Duplicate roll numbers | Already exists | Check existing records first |
| Cannot delete faculty | Currently mapped | Ask HOD to unmap first |
| Subject not visible to HOD | Wrong regulation/semester | Verify upload parameters |
| Reports not generating | Large data set | Add filters to reduce scope |
| Password reset not working | Email not configured | Check SMTP settings |

---

## 📞 Support

For admin-related issues:
- System bugs: Contact development team
- Data issues: Verify with registrar office
- Access issues: Contact IT support
- Training: Request admin training session

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Module Owner**: System Administration Team  
**Critical**: This module has full system access. Handle with care.
