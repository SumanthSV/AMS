# AMS-SM24E: Enterprise Attendance Management System

AMS-SM24E is a comprehensive attendance management system built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a complete solution for managing employee attendance, shifts, leave requests, and more.

## Features

- **JWT-based Authentication** with role-based access control (Admin, HR, Employee)
- **Employee Management** with departments and position tracking
- **Shift Management** with flexible, fixed, and rotational shifts
- **Attendance Tracking** with check-in/check-out functionality
- **Leave Management** with request and approval workflow
- **Real-time Updates** via WebSocket connection
- **Analytics Dashboard** with exportable reports
- **Notification System** for important events

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time Communication**: Socket.IO
- **Email Notifications**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/ams-sm24e.git
cd ams-sm24e
```

2. Install dependencies for both client and server:
```
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

3. Create environment variables:
```
# Copy the example env file
cp .env.example .env
```

4. Update the `.env` file with your configuration values

### Running the Application

#### Development Mode

To run both the client and server in development mode:

```
npm run dev:all
```

Or run them separately:

```
# Server only
npm run server

# Client only
npm run client
```

#### Production Mode

To build the client for production:

```
npm run build
```

To start the server in production mode:

```
cd server
npm start
```

## Project Structure

```
ams-sm24e/
├── client/             # Frontend React application
│   ├── public/         # Static files
│   └── src/            # React source code
│       ├── components/ # Reusable components
│       ├── context/    # React context providers
│       ├── layouts/    # Page layouts
│       ├── pages/      # Application pages
│       ├── types/      # TypeScript type definitions
│       └── utils/      # Utility functions
├── server/             # Backend Express application
│   ├── src/
│       ├── config/     # Configuration files
│       ├── controllers/# Route controllers
│       ├── middleware/ # Express middleware
│       ├── models/     # Mongoose models
│       ├── routes/     # Express routes
│       └── utils/      # Utility functions
└── README.md           # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users` - Get all users (Admin/HR only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/me` - Get current user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department (Admin/HR only)
- `PUT /api/departments/:id` - Update department (Admin/HR only)
- `DELETE /api/departments/:id` - Delete department (Admin only)

### Shifts
- `GET /api/shifts` - Get all shifts
- `POST /api/shifts` - Create shift (Admin/HR only)
- `PUT /api/shifts/:id` - Update shift (Admin/HR only)
- `DELETE /api/shifts/:id` - Delete shift (Admin only)

### Attendance
- `GET /api/attendance` - Get all attendance records (Admin/HR only)
- `GET /api/attendance/me` - Get current user's attendance
- `POST /api/attendance/check-in` - Check in
- `PUT /api/attendance/check-out` - Check out

### Leave Requests
- `GET /api/leaves` - Get all leave requests (Admin/HR only)
- `GET /api/leaves/me` - Get current user's leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/approve` - Approve leave request (Admin/HR only)
- `PUT /api/leaves/:id/reject` - Reject leave request (Admin/HR only)

## License

This project is licensed under the MIT License.# AMS
