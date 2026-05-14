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

## Getting Started

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
