# STUDENT MODULE DOCUMENTATION

## 📚 Overview

The Student Module is designed for students to log in, view their assigned subjects with mapped faculty, and submit feedback for each subject during the active feedback period. Students can only submit feedback once per subject and can view their previous submissions.

---

## 🔐 Authentication

### **Login Credentials**
- **Roll Number**: Unique student identifier (e.g., 21B81A0501)
- **Date of Birth**: In DD/MM/YYYY format for security

### **Login Process**
1. Student navigates to the student login page
2. Enters Roll Number and Date of Birth
3. System validates credentials against the `student` collection in MongoDB
4. If valid:
   - JWT token is generated with student details and role
   - Token stored in browser (localStorage/sessionStorage)
   - Redirected to Student Dashboard
5. If invalid:
   - Error message displayed: "Invalid Roll Number or Date of Birth"

### **Session Management**
- JWT token expires after a set duration (e.g., 24 hours)
- Logout clears the token and redirects to login page
- Protected routes verify token before allowing access

---

## 🏠 Student Dashboard

### **Dashboard Components**

#### **1. Student Profile Section**
Displays:
- **Name**: Full name of the student
- **Roll Number**: Unique ID
- **Branch**: Department (e.g., CSE, ECE, MECH)
- **Program**: B.Tech, M.Tech, etc.
- **Batch**: e.g., 2023-2027
- **Regulation**: e.g., R20, R22 , R23
- **Current Year**: Automatically calculated or manually set by Admin
- **Current Semester**: Derived from batch or admin updates

#### **2. Active Feedback Section**
Displays all subjects for which feedback is currently published and active:
- **Subject Code**: e.g., CS301
- **Subject Name**: e.g., Data Structures
- **Faculty Name**: Assigned by HOD
- **Faculty ID**: e.g., FAC001
- **Status**: 
  - ✅ **Submitted** (if feedback already submitted)
  - 🔴 **Pending** (if feedback not yet submitted)
- **Action Button**: 
  - "Submit Feedback" (if pending)
  - "View Submission" (if already submitted)

#### **3. Previous Submissions Section**
- List of all previously submitted feedback
- Shows subject name, faculty name, submission date
- Can view their own ratings and comments (read-only)
- **Cannot edit** after submission

---

## 📝 Feedback Submission Flow

### **Step 1: View Available Subjects**
- Dashboard loads published feedback forms from the `feedback_publish` collection
- Filters forms based on student's:
  - Program
  - Branch
  - Batch
  - Current Year
  - Current Semester
- Displays only subjects mapped in the published form

### **Step 2: Select a Subject**
- Student clicks "Submit Feedback" for a subject
- System checks:
  - Is feedback already submitted for this subject? (Prevent duplicates)
  - Is the feedback form still active/enabled?
- If checks pass, opens feedback form

### **Step 3: Fill Feedback Form**

#### **Form Structure**
- **Subject Details**: Subject name, code, faculty name (read-only)
- **Feedback Criteria**: 15-25 questions/criteria loaded from `feedback_question` collection
- **Rating Scale**: 1 to 5 for each criterion
  - 1 = Poor
  - 2 = Below Average
  - 3 = Average
  - 4 = Good
  - 5 = Excellent
- **Optional Comment Box**: Text area for additional feedback (max 500 characters)

#### **Sample Feedback Criteria**
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

### **Step 4: Submit Feedback**
- Student must rate all criteria (mandatory)
- Comment is optional
- Click "Submit" button
- System validates:
  - All questions answered
  - No duplicate submission for same map_id
- On success:
  - Feedback stored in `feedback` collection
  - Each rating stored as a separate document:
    ```javascript
    {
      student_roll: "21B81A0501",
      map_id: "MAP12345",
      question_id: 1,
      rating: 5,
      submitted_at: Date,
      comment: "Great teaching!"
    }
    ```
  - Success message displayed
  - Subject status updated to "Submitted" on dashboard
  - Student redirected to dashboard

### **Step 5: Confirmation**
- Confirmation message: "Your feedback has been submitted successfully!"
- Subject card on dashboard shows ✅ "Submitted" status
- Student can view but not edit the submission

---

## 📊 What Students Can See

### **✅ Students CAN:**
- View their own profile details
- See all subjects assigned to them for the current semester
- View faculty names mapped to each subject
- Submit feedback once per subject
- View their previous feedback submissions (their own ratings and comments)
- See submission timestamps
- Access feedback only during published/active periods

### **❌ Students CANNOT:**
- View other students' feedback
- Edit feedback after submission
- View analytics or aggregate ratings
- See faculty-wise or subject-wise averages
- Access HOD or Admin modules
- Submit feedback for unpublished subjects
- Submit feedback multiple times for the same subject
- Change their profile information (managed by Admin)

---

## 🎯 Special Cases for Students

### **1. Lateral Entry Students**
- Join directly in 2nd or 3rd year
- Admin sets their `currentYear` manually
- Dashboard shows subjects for their actual current year, not calculated from batch
- Example: Lateral entry in 2023 to 3rd year → sees 3rd year subjects regardless of batch_start

### **2. Detained Students**
- Failed a year and repeating
- Admin updates their `currentYear` to reflect actual academic year
- See subjects for repeated year, not original batch year
- Example: Original batch 2021-2025, detained in 2nd year → currentYear = 2, semester = 3 or 4

### **3. Labs with Multiple Faculty**
- Some subjects (especially labs) have 2-3 faculty members
- Students see multiple entries for the same subject with different faculty names
- Must submit feedback separately for each faculty
- Example: "Data Structures Lab" → Faculty A (sections 1-3), Faculty B (sections 4-6)

### **4. Elective Subjects**
#### **Open Electives**
- Subjects available to students from any branch
- HOD maps based on student registrations
- Student sees only electives they registered for

#### **Professional Electives**
- Branch-specific elective choices
- Student selects one from available options
- Feedback given only for selected elective

#### **Minors/Honors**
- Cross-department specialized subjects
- Mapped by HOD if student is enrolled
- Appears in dashboard if registered

---

## 🔄 User Interface Flow

### **Login Screen**
```
┌─────────────────────────────────┐
│   STUDENT LOGIN                 │
│                                 │
│   Roll Number: [___________]    │
│   Date of Birth: [__/__/____]   │
│                                 │
│   [Login Button]                │
│                                 │
│   Forgot Roll Number?           │
└─────────────────────────────────┘
```

### **Dashboard Screen**
```
┌─────────────────────────────────────────────────┐
│  STUDENT DASHBOARD                    [Logout] │
│                                                 │
│  Name: John Doe                                 │
│  Roll: 21B81A0501 | Branch: CSE | Batch: 2021  │
│  Current Semester: 5                            │
│                                                 │
│  ─────────────────────────────────────────────  │
│  ACTIVE FEEDBACK                                │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ CS501 - Operating Systems                 │ │
│  │ Faculty: Dr. Smith (FAC101)               │ │
│  │ Status: 🔴 Pending                        │ │
│  │ [Submit Feedback]                         │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ CS502 - Database Management Systems       │ │
│  │ Faculty: Dr. Johnson (FAC102)             │ │
│  │ Status: ✅ Submitted (Dec 5, 2025)        │ │
│  │ [View Submission]                         │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ─────────────────────────────────────────────  │
│  PREVIOUS SUBMISSIONS                           │
│  ─────────────────────────────────────────────  │
│  [List of past feedback with dates]            │
└─────────────────────────────────────────────────┘
```

### **Feedback Form Screen**
```
┌─────────────────────────────────────────────────┐
│  FEEDBACK FORM                        [Cancel]  │
│                                                 │
│  Subject: Operating Systems (CS501)             │
│  Faculty: Dr. Smith                             │
│                                                 │
│  ─────────────────────────────────────────────  │
│  Rate the following criteria (1-5):             │
│  ─────────────────────────────────────────────  │
│                                                 │
│  1. Subject knowledge of faculty                │
│     ○ 1   ○ 2   ○ 3   ○ 4   ● 5               │
│                                                 │
│  2. Communication skills and clarity            │
│     ○ 1   ○ 2   ○ 3   ● 4   ○ 5               │
│                                                 │
│  3. Use of teaching aids                        │
│     ○ 1   ○ 2   ● 3   ○ 4   ○ 5               │
│                                                 │
│  ... (15-25 more questions)                     │
│                                                 │
│  ─────────────────────────────────────────────  │
│  Additional Comments (Optional):                │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [Submit Feedback]                              │
└─────────────────────────────────────────────────┘
```

---

## 🔔 Notifications & Alerts

### **Feedback Reminders** (Future Enhancement)
- Email notification when feedback is published
- In-app notification for pending feedback
- Reminder 2-3 days before deadline
- Final reminder on last day

### **Status Messages**
- ✅ "Feedback submitted successfully!"
- ❌ "Please answer all questions before submitting"
- ⚠️ "Feedback period has ended for this subject"
- ℹ️ "You have already submitted feedback for this subject"

---

## 🛡️ Security & Privacy

### **Data Privacy**
- Student identity is **anonymous** in analytics
- HODs/Admin see only aggregate ratings, not individual student responses
- Student roll number is stored only for duplicate prevention
- Students cannot view other students' feedback

### **Submission Integrity**
- **One submission per subject**: Enforced by checking existing feedback for student_roll + map_id
- **No editing after submission**: Maintains data integrity
- **Timestamp recorded**: Tracks when feedback was submitted
- **JWT authentication**: Ensures only logged-in students can submit

### **Data Validation**
- All ratings must be between 1-5
- Student roll and map_id validated before submission
- Prevents SQL injection and XSS attacks
- Input sanitization for comment box

---

## 🔧 Technical Implementation

### **Frontend Components**
```
src/pages/student/
├── StudentLogin.jsx          # Login page with roll + DOB
├── StudentDashboard.jsx      # Main dashboard
├── FeedbackForm.jsx          # Feedback submission form
└── ViewSubmission.jsx        # View past submissions

src/components/student/
├── SubjectCard.jsx           # Display subject with faculty
├── FeedbackQuestion.jsx      # Single question with rating input
├── RatingInput.jsx           # 1-5 rating radio buttons
└── SubmissionHistory.jsx     # Previous submissions list
```

### **API Endpoints Used**

#### **POST /api/student/login**
Request:
```json
{
  "roll": "21B81A0501",
  "dob": "2003-05-15"
}
```
Response:
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "student": {
    "roll": "21B81A0501",
    "name": "John Doe",
    "branch": "CSE",
    "batch_start": 2021
  }
}
```

#### **GET /api/student/dashboard**
Headers: `Authorization: Bearer <token>`
Response:
```json
{
  "student": { /* profile data */ },
  "activeSubjects": [
    {
      "map_id": "MAP001",
      "subject_code": "CS501",
      "subject_name": "Operating Systems",
      "faculty_name": "Dr. Smith",
      "faculty_id": "FAC101",
      "submitted": false
    }
  ],
  "previousSubmissions": [ /* history */ ]
}
```

#### **GET /api/student/feedback-questions**
Response:
```json
{
  "questions": [
    { "s_no": 1, "criteria_text": "Subject knowledge of faculty" },
    { "s_no": 2, "criteria_text": "Communication skills" }
  ]
}
```

#### **POST /api/student/submit-feedback**
Request:
```json
{
  "map_id": "MAP001",
  "ratings": [
    { "question_id": 1, "rating": 5 },
    { "question_id": 2, "rating": 4 }
  ],
  "comment": "Excellent teacher!"
}
```
Response:
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

#### **GET /api/student/view-submission/:map_id**
Response:
```json
{
  "subject": "Operating Systems",
  "faculty": "Dr. Smith",
  "submitted_at": "2025-12-05T10:30:00Z",
  "ratings": [ /* all ratings */ ],
  "comment": "Great teaching!"
}
```

---

## 📱 Mobile Responsiveness

The Student Module should be **fully responsive** since students primarily access from mobile devices:
- Touch-friendly rating buttons (larger tap targets)
- Optimized for small screens
- Swipeable subject cards
- Bottom navigation for easy access
- Progressive Web App (PWA) capabilities

---

## ✅ Testing Checklist

- [ ] Student can log in with correct roll + DOB
- [ ] Invalid credentials show error message
- [ ] Dashboard displays correct student info
- [ ] Only published subjects are visible
- [ ] Feedback form loads all questions
- [ ] Cannot submit incomplete feedback
- [ ] Cannot submit duplicate feedback
- [ ] Submitted subjects show "Submitted" status
- [ ] Can view previous submissions
- [ ] Cannot edit after submission
- [ ] Logout clears session properly
- [ ] Works on mobile devices
- [ ] Handles network errors gracefully

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "No subjects available" | Feedback not published by HOD | Wait for HOD to publish or contact HOD |
| "Already submitted" | Duplicate submission attempt | Can only submit once per subject |
| "Session expired" | JWT token expired | Log in again |
| "Invalid roll number" | Incorrect credentials | Verify roll number and DOB |
| Page not loading | Network/server issue | Check internet connection, contact admin |
| Cannot see electives | Not registered for elective | Contact HOD/Admin to check registration |

---

## 📞 Support & Help

For student-related issues:
1. Check if feedback is published (contact HOD)
2. Verify correct roll number and DOB
3. Ensure you're in the correct batch/semester
4. Contact Admin for profile/data corrections
5. Report technical bugs to development team

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Module Owner**: Student Affairs Team
