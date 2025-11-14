# Car Rental Website

A full-stack car rental application with React frontend and Node.js/Express backend.

## Features

- User authentication (Register/Login)
- Browse and search cars by category, location, and brand
- View detailed car information
- Book cars with date/time selection
- View and manage bookings
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Create a `.env` file in the server directory (optional, defaults are provided):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car_rental_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Make sure MongoDB is running on your system

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Running Both Servers

### Option 1: Run in separate terminals

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### Option 2: Use npm scripts (if configured)

You can also create a root-level script to run both, but for now, use separate terminals.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Cars
- `GET /api/cars` - Get all cars (supports query params: category, brand, location, featured, bestSeller)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car (admin only)
- `PUT /api/cars/:id` - Update car (admin only)
- `DELETE /api/cars/:id` - Delete car (admin only)

### Bookings
- `POST /api/bookings/check` - Check car availability
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my` - Get user's bookings (protected)
- `GET /api/bookings` - Get all bookings (admin only)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

## Default Configuration

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017/car_rental_db`

## Notes

- Make sure MongoDB is running before starting the backend
- The frontend is configured to proxy API requests to the backend
- CORS is enabled on the backend to allow frontend requests
- JWT tokens are stored in localStorage for authentication

## Troubleshooting

1. **MongoDB Connection Error**: Make sure MongoDB is running and the connection string is correct
2. **Port Already in Use**: Change the PORT in the .env file or kill the process using the port
3. **CORS Errors**: Ensure the backend CORS middleware is properly configured
4. **Module Not Found**: Run `npm install` in both client and server directories

