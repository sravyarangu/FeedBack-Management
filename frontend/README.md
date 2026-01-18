# Feedback Management Portal - Frontend

A production-grade React application for managing student feedback in educational institutions.

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for icons

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # App bootstrap & routing
│   │   └── App.jsx        # Main app with routes
│   ├── features/          # Role-based feature modules
│   │   ├── admin/         # Admin module
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── layouts/
│   │   ├── auth/          # Authentication module
│   │   │   ├── pages/     # Login, Landing, ForgotPassword
│   │   │   └── components/
│   │   ├── hod/           # HOD module
│   │   │   ├── pages/     # Dashboard, Feedback, Analytics
│   │   │   ├── components/
│   │   │   └── layouts/   # HODLayout
│   │   └── student/       # Student module
│   │       ├── pages/     # Profile, Submissions, Feedback
│   │       ├── components/
│   │       └── layouts/   # StudentLayout
│   ├── shared/            # Shared resources
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── constants/     # Data & constants
│   ├── context/           # Global state providers
│   ├── assets/            # Images, fonts
│   ├── styles/            # Global styles
│   └── main.jsx           # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Path Aliases

Available import aliases (configured in vite.config.js):

- `@/` → `src/`
- `@features/` → `src/features/`
- `@shared/` → `src/shared/`
- `@context/` → `src/context/`
- `@assets/` → `src/assets/`
