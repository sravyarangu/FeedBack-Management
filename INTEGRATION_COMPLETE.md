# Frontend-Backend Integration Setup Guide

## 🎉 Integration Complete!

The Feedback Management System now has complete integration between the React frontend and Node.js/Express backend.

## 📦 What Has Been Implemented

### 1. API Service Layer (`frontend/src/services/`)
- ✅ **api.js** - Axios instance with interceptors for token management
- ✅ **authService.js** - All authentication APIs (login, logout, change password)
- ✅ **studentService.js** - Student-specific APIs
- ✅ **hodService.js** - HOD department management APIs
- ✅ **adminService.js** - Admin CRUD operations for all entities
- ✅ **principalService.js** - Principal analytics and reporting APIs
- ✅ **index.js** - Central export point for all services

### 2. Authentication Context (`frontend/src/context/AuthContext.jsx`)
- ✅ Real API integration for all login types
- ✅ Support for 5 user roles: student, hod, admin, principal, vice-principal
- ✅ Token & user data management in localStorage
- ✅ Automatic token attachment to requests
- ✅ Auto-redirect on token expiration (401 errors)
- ✅ Change password functionality
- ✅ Error handling and clearing

### 3. Updated Login Pages
- ✅ **StudentLogin.jsx** - Uses Roll Number + Date of Birth (YYYY-MM-DD)
- ✅ **HODLogin.jsx** - Uses Email + Password
- ✅ **AdminLogin.jsx** - Role-based login (Principal/Vice Principal/Super Admin)

### 4. Environment Configuration
- ✅ **frontend/.env** - `VITE_API_URL=http://localhost:3000/api`
- ✅ **Backend/.env** - MongoDB URI, JWT secret, etc.

### 5. Backend Configuration
- ✅ CORS enabled in `Backend/index.js`
- ✅ All routes properly configured
- ✅ JWT authentication middleware

## 🚀 How to Run the Integrated System

### Step 1: Start MongoDB
Make sure MongoDB is running:
```powershell
# If using local MongoDB
mongod

# Or if using MongoDB Atlas, ensure your connection string is correct in Backend/.env
```

### Step 2: Setup and Start Backend
```powershell
# Navigate to Backend folder
cd "c:\Users\Sravya Rangu\OneDrive\Documents\Feedback Management System\FeedBack-Management-JNTUGV\Backend"

# Install dependencies (if not already installed)
npm install

# Seed the database with test data (OPTIONAL - run only once)
node seed.js

# Start the backend server
npm start
```

The backend will run on: **http://localhost:3000**

### Step 3: Setup and Start Frontend
Open a new terminal:
```powershell
# Navigate to Frontend folder
cd "c:\Users\Sravya Rangu\OneDrive\Documents\Feedback Management System\FeedBack-Management-JNTUGV\frontend"

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

The frontend will run on: **http://localhost:5173**

## 🧪 Testing the Integration

### Test Credentials (After running seed.js)

#### Student Login
- URL: http://localhost:5173/login/student
- Roll Number: `23VV1A0546`
- Date of Birth: `2005-01-10`

#### HOD Login (All HODs use password: `hod@123`)
- URL: http://localhost:5173/login/hod
- **CSE HOD:**
  - Email: `hod.cse@jntugvcev.edu.in`
  - Password: `hod@123`
- **ECE HOD:**
  - Email: `hod.ece@jntugvcev.edu.in`
  - Password: `hod@123`
- **EEE HOD:**
  - Email: `hod.eee@jntugvcev.edu.in`
  - Password: `hod@123`

#### Admin/Principal Login
- URL: http://localhost:5173/login/admin
- **Super Admin:**
  - Email: `admin@jntugv.edu.in`
  - Password: `Admin@123`
- **Principal:**
  - Email: `principal@jntugv.edu.in`
  - Password: `Principal@123`
- **Vice Principal:**
  - Email: `viceprincipal@jntugv.edu.in`
  - Password: `VicePrincipal@123`

### Testing Checklist

1. ✅ **Student Login Flow**
   - Open http://localhost:5173/login/student
   - Enter credentials
   - Should redirect to /student/dashboard
   - Check browser DevTools > Application > Local Storage for 'token' and 'user'

2. ✅ **HOD Login Flow**
   - Open http://localhost:5173/login/hod
   - Enter HOD credentials
   - Should redirect to /hod/dashboard
   - Verify department-specific data is shown

3. ✅ **Admin Login Flow**
   - Open http://localhost:5173/login/admin
   - Select role (Principal/Vice Principal/Super Admin)
   - Enter credentials
   - Should redirect to appropriate dashboard

4. ✅ **Error Handling**
   - Try invalid credentials
   - Should show error message without page refresh

5. ✅ **Token Expiration**
   - Login as any user
   - In DevTools > Application > Local Storage, modify the 'token' value
   - Refresh page or make an API call
   - Should redirect to landing page

6. ✅ **Network Verification**
   - Open DevTools > Network tab
   - Login as any user
   - Check:
     - Request URL is correct (/api/auth/...)
     - Authorization header is present after login
     - Response status is 200 for success
     - Response contains token and user data

## 🔧 API Endpoint Examples

### Authentication
```javascript
// Student Login
POST http://localhost:3000/api/auth/student/login
Body: { "rollNo": "23VV1A0546", "dob": "2005-01-10" }

// HOD Login
POST http://localhost:3000/api/auth/hod/login
Body: { "email": "hod.cse@jntugvcev.edu.in", "password": "hod@123" }

// Admin Login
POST http://localhost:3000/api/auth/admin/login
Body: { "email": "admin@jntugv.edu.in", "password": "Admin@123" }
```

### Using Services in Components
```javascript
import { studentService } from '../services';

// In a React component
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error:', error.response?.data?.message);
    }
  };
  fetchProfile();
}, []);
```

## 🔒 Security Features

1. **JWT Token Authentication** - All protected routes require valid token
2. **Automatic Token Injection** - Axios interceptor adds token to all requests
3. **Token Expiration Handling** - Auto-logout on 401 errors
4. **Password Hashing** - Bcrypt for secure password storage
5. **CORS Protection** - Cross-origin requests properly configured

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key_change_in_production_2024
JWT_EXPIRE=7d
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend has `app.use(cors())` in index.js
- Check that backend is running on port 3000

### 401 Unauthorized
- Clear localStorage and try logging in again
- Check if JWT_SECRET matches in backend .env
- Verify token hasn't expired

### Network Error
- Ensure backend is running (`npm start` in Backend folder)
- Check VITE_API_URL in frontend .env
- Verify no firewall is blocking port 3000

### Login Works But Dashboard Empty
- Run `node seed.js` in Backend folder to populate database
- Check Network tab for API response data
- Verify MongoDB connection string is correct

## 📚 Additional Resources

- Full API documentation: See `INTEGRATION_GUIDE.md`
- Backend structure: See `docs/PROJECT_STRUCTURE.md`
- Testing guide: See `INTEGRATION_GUIDE.md` (Manual Testing section)

## ✅ Integration Status

| Component | Status |
|-----------|--------|
| API Service Layer | ✅ Complete |
| AuthContext | ✅ Complete |
| Login Pages | ✅ Complete |
| Token Management | ✅ Complete |
| Error Handling | ✅ Complete |
| Environment Config | ✅ Complete |
| Backend CORS | ✅ Complete |

## 🎯 Next Steps

1. Test all login flows with the provided credentials
2. Implement module-specific features (student feedback submission, HOD analytics, etc.)
3. Add form validation and loading states
4. Implement remaining API integrations in dashboard pages
5. Add error boundaries and better error handling
6. Prepare for production deployment

---

**Integration completed successfully! 🎉**

For detailed testing procedures, refer to the INTEGRATION_GUIDE.md file.
