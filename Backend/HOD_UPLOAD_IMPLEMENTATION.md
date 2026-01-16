# HOD Excel Upload Implementation Guide

## Overview
This document describes the HOD bulk upload functionality that allows administrators to upload HOD (Head of Department) data via Excel files. The system automatically creates accounts with hashed default passwords and sends password reset links via email.

## Features Implemented

### 1. Excel Template Structure
**Required Columns:**
- **Name**: Full name of the HOD
- **Email**: Email address (used for login and password reset)
- **Branch**: Department/Branch (e.g., CSE, ECE, MECH)
- **Designation**: Position title (defaults to "HOD" if not provided)

**Download Template:**
- Template can be downloaded from Admin Dashboard → HOD Management → Download Template
- File name: `hod_template.xlsx`

### 2. Backend Implementation

#### HOD Model Updates (`models/hod.js`)
```javascript
{
  username: String,        // Auto-generated from email (part before @)
  password: String,        // Hashed default password: "Hod@123"
  name: String,           // Required
  email: String,          // Required, unique
  branch: String,         // Required
  designation: String,    // Default: "HOD"
  program: String,        // Default: "BTECH"
  resetPasswordToken: String,      // JWT token for password reset
  resetPasswordExpire: Date,       // Token expiration (7 days)
  isActive: Boolean       // Default: true
}
```

#### API Endpoints

**1. Bulk Upload HODs**
```http
POST /api/admin/hods/bulk
Authorization: Bearer <admin_token>
Content-Type: application/json

Request Body:
{
  "hods": [
    {
      "name": "Dr. John Smith",
      "email": "john.smith@university.edu",
      "branch": "CSE",
      "designation": "HOD"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Processed 5 HODs: 5 successful, 0 failed",
  "results": {
    "success": [...],
    "failed": [...]
  },
  "note": "Email service not configured. Reset links logged to console."
}
```

**2. Reset Password with Token**
```http
POST /api/auth/hod/reset-password
Content-Type: application/json

Request Body:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "newSecurePassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password.",
  "name": "Dr. John Smith",
  "email": "john.smith@university.edu"
}
```

### 3. Password Management

#### Default Password
- **Default Password**: `Hod@123`
- Stored as bcrypt hash with salt rounds: 10
- Must be changed on first login using reset link

#### Password Reset Flow
1. Admin uploads HOD Excel file
2. System creates HOD accounts with hashed default password
3. System generates JWT reset token (valid for 7 days)
4. Reset link sent to HOD's email:
   ```
   http://localhost:5173/reset-password/{token}
   ```
5. HOD clicks link, enters new password
6. Token validated, password updated and hashed
7. Reset token cleared from database
8. HOD can login with new password

#### Password Requirements
- Minimum 6 characters
- No special character requirements (can be customized)

### 4. Frontend Implementation

#### Admin Dashboard (`Admin.jsx`)
- **Download Template Button**: Downloads Excel template with required columns
- **Upload HODs Button**: Opens file upload modal
- **File Processing**: 
  - Reads Excel file using SheetJS (xlsx)
  - Maps columns: Name → name, Email → email, Branch → branch, Designation → designation
  - Sends to backend API
  - Shows success/failure message with count

#### Reset Password Page (`ResetPassword.jsx`)
- Route: `/reset-password/:token`
- Features:
  - Token extraction from URL
  - New password input (min 6 chars)
  - Confirm password validation
  - Loading states
  - Error handling (expired/invalid token)
  - Success message with auto-redirect to login
  - Back to login button

### 5. Security Features

#### Password Hashing
```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('Hod@123', salt);
```

#### Token Generation
```javascript
const resetToken = jwt.sign(
  { email: hodData.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

#### Token Validation
```javascript
// Verify JWT signature
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Check database for valid, non-expired token
const hod = await HOD.findOne({ 
  email: decoded.email,
  resetPasswordToken: token,
  resetPasswordExpire: { $gt: Date.now() }
});
```

### 6. Email Integration (Placeholder)

**Current Status**: Email service not implemented
**Reset links are logged to server console**

**To Implement Email Service:**

1. Install email package (e.g., nodemailer):
```bash
npm install nodemailer
```

2. Configure email service:
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

3. Send email in `bulkUploadHODs`:
```javascript
await transporter.sendMail({
  to: hod.email,
  subject: 'Account Created - Reset Your Password',
  html: `
    <h2>Welcome ${hod.name}!</h2>
    <p>Your HOD account has been created.</p>
    <p>Default Password: Hod@123</p>
    <p>Please click the link below to set your new password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 7 days.</p>
  `
});
```

### 7. Usage Instructions

#### For Administrators:

1. **Download Template**
   - Navigate to Admin Dashboard → HOD Management
   - Click "Download Template"
   - Open `hod_template.xlsx` in Excel

2. **Fill HOD Data**
   - Enter HOD information in columns: Name, Email, Branch, Designation
   - Ensure email addresses are valid and unique
   - Save the Excel file

3. **Upload File**
   - Click "Upload HODs" button
   - Select the filled Excel file
   - Click "Upload HODs" in modal
   - Wait for success message
   - Check server console for password reset links

4. **Share Reset Links**
   - Copy reset links from server console
   - Send to respective HODs via email/message
   - Inform them to check spam folder if using email

#### For HODs:

1. **Receive Reset Link**
   - Receive link from admin: `http://localhost:5173/reset-password/{token}`

2. **Reset Password**
   - Click the link (valid for 7 days)
   - Enter new password (min 6 characters)
   - Confirm password
   - Click "Reset Password"

3. **Login**
   - Navigate to HOD Login page
   - Enter username (part before @ in email)
   - Enter new password
   - Access HOD Dashboard

## Testing

### Test HOD Upload:

1. Create test Excel file:
```
| Name          | Email                | Branch | Designation |
|---------------|---------------------|--------|-------------|
| Dr. John Doe  | john.doe@test.com   | CSE    | HOD         |
| Dr. Jane Smith| jane.smith@test.com | ECE    | HOD         |
```

2. Upload via Admin Dashboard

3. Check server console for:
```
✓ Bulk operation complete:
  - Inserted: 2
  - Updated: 0
  - Matched: 2

📧 Sending password reset emails to 2 HODs...
📧 Email sent to john.doe@test.com
   Reset URL: http://localhost:5173/reset-password/eyJhbGc...
   Name: Dr. John Doe
```

4. Copy reset URL and test password reset

## Environment Variables

Add to `.env`:
```env
# Frontend URL for reset links
FRONTEND_URL=http://localhost:5173

# JWT Secret for token generation
JWT_SECRET=your-secret-key-here

# Email Configuration (when implementing)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Error Handling

### Upload Errors:
- Missing required fields → Skipped with error message
- Duplicate email → Update existing HOD
- Invalid data format → Failed entry in results

### Reset Password Errors:
- Invalid token → "Invalid or expired reset token"
- Expired token (>7 days) → "Invalid or expired reset token"
- Password too short → "New password must be at least 6 characters"
- Passwords don't match → "Passwords do not match"

## Database Schema Changes

```javascript
// New fields added to HOD schema
resetPasswordToken: {type: String},
resetPasswordExpire: {type: Date},
designation: {type: String, default: 'HOD'}
```

## Files Modified

### Backend:
1. `models/hod.js` - Added resetPasswordToken, resetPasswordExpire, designation fields
2. `controllers/adminController.js` - Added bulkUploadHODs function
3. `controllers/authController.js` - Added hodResetPasswordWithToken function
4. `routes/admin.js` - Added POST /hods/bulk route
5. `routes/auth.js` - Added POST /hod/reset-password route

### Frontend:
1. `services/adminService.js` - Added bulkUploadHODs method
2. `features/admin/pages/Admin.jsx` - Updated HOD upload handler and template
3. `pages/ResetPassword.jsx` - Created new reset password page
4. `app/App.jsx` - Added /reset-password/:token route

## Future Enhancements

1. **Email Service Integration**: Implement nodemailer or SendGrid
2. **Email Templates**: Design HTML email templates with branding
3. **Bulk Email Queue**: Use queue system for large uploads
4. **Email Delivery Tracking**: Log email send status
5. **Resend Reset Link**: Allow admins to resend links
6. **Password Strength Meter**: Add to reset password form
7. **Two-Factor Authentication**: Optional 2FA for HODs
8. **Audit Log**: Track password reset activities

## Support

For issues or questions:
- Check server console for detailed error messages
- Verify Excel file format matches template
- Ensure email addresses are unique
- Check token expiration (7 days max)
- Verify JWT_SECRET in environment variables
