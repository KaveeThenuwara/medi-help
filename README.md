<<<<<<< HEAD
# MediHelp
=======
# MediHelp - Frontend

MediHelp is a comprehensive medical appointment management system designed to streamline healthcare services. This frontend application is built with Next.js, providing a modern and responsive user interface for patients, doctors, and administrators.

## Project Review

Watch the project review video: [MediHelp Project Review](https://youtu.be/wZAdwhOXHgg)

## Features

- **User Authentication**: Secure login and registration for patients, doctors, and admins
- **Dashboard**: Personalized dashboards for different user roles
- **Appointment Management**: Book, view, and manage appointments
- **Doctor Management**: Admin panel for managing doctors and their schedules
- **Payment Integration**: Secure payment processing for appointments
- **ChatBot**: AI-powered chatbot for user assistance
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Toastify
>>>>>>> 78fd48dd99c27706bc717432b9fd9ef62aa65f99

A healthcare appointment and user management web app built with Next.js, Tailwind CSS, React, and Framer Motion.

<<<<<<< HEAD
## Overview

MediHelp is a patient-facing medical platform that enables users to:

- Browse and find verified doctors
- Book appointments quickly
- Register and authenticate with email verification
- Access role-based dashboards for admins, doctors, receptionists, and patients
- View live statistics and appointment summaries

## Key Features

- Modern, responsive UI with Tailwind CSS and Framer Motion
- Email-based registration with OTP verification
- Secure authentication using JWT stored in `localStorage`
- Role-based navigation and dashboard redirects
- REST API integration via `src/service/api.js`

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Framer Motion
- lucide-react icons
- react-toastify

## App Structure

Important app paths:

- `/` - Landing page
- `/login` - Login form
- `/register` - Registration with email OTP verification
- `/doctors` - Doctor search/listing
- `/appointments` - Appointment overview
- `/appointments/new` - New appointment booking
- `/admin` - Admin dashboard
- `/dashboard/doctor` - Doctor dashboard
- `/dashboard/reception` - Reception dashboard
- `/dashboard` - Patient dashboard

## Authentication Flow

The app uses `AuthContext` in `src/lib/AuthContext.js` for client-side auth. After successful login or registration, the user is redirected based on role:

- `ADMIN` → `/admin`
- `DOCTOR` → `/dashboard/doctor`
- `RECEPTION` → `/dashboard/reception`
- other users → `/dashboard`

## API Integration

The client uses `src/service/api.js` to call the backend.

Example of public request without token:

```js
import { apiClientWithOuttoken } from '@/service/api';

const res = await apiClientWithOuttoken('/auth/authenticate', 'POST', {
  email: 'user@example.com',
  password: 'password123',
});
```

Example of authenticated request:

```js
import { apiClient } from '@/service/api';

const res = await apiClient('/admin/reports/summary');
```

## Environment Variables

Create a `.env.local` file in the project root and configure the backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api/v1
```

If this variable is not set, the app defaults to `http://localhost:8081/api/v1`.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run ESLint:

```bash
npm run lint
```

## Usage Notes

- `src/app/login/page.js` handles login and uses the `/auth/authenticate` endpoint.
- `src/app/register/page.js` sends a registration code, verifies it, then creates a new user.
- `src/app/page.js` fetches live stats from `/admin/reports/summary`.
- `src/components/Navbar.jsx` renders login, signup, and dashboard links based on auth state.

## Project Structure

- `src/app/` - Next.js app routes and pages
- `src/components/` - Shared UI components
- `src/lib/` - Auth context and utility logic
- `src/service/` - API client wrapper

## Notes

This frontend expects a running backend API at the configured base URL. If you need to connect to a different backend, update `NEXT_PUBLIC_API_BASE_URL`.

---

Happy hacking! 🚀
=======
### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd medi-help
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin panel pages
│   ├── appointments/      # Appointment management
│   ├── dashboard/         # User dashboards
│   ├── doctors/           # Doctor profiles
│   ├── login/             # Authentication
│   └── ...
├── components/            # Reusable React components
│   ├── ChatBot.jsx       # AI chatbot component
│   ├── Footer.jsx        # Site footer
│   └── Navbar.jsx        # Navigation bar
├── lib/                   # Utility libraries
│   ├── AuthContext.js    # Authentication context
│   └── utils.js          # Helper functions
└── service/               # API service layer
    └── api.js            # API client
```




For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
>>>>>>> 78fd48dd99c27706bc717432b9fd9ef62aa65f99
