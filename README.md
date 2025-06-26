# CalorieCounter Pro

A professional calorie tracking web application built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Secure login/signup with OTP verification
- **Daily Calorie Tracking**: Log meals and track nutritional intake
- **Food Database**: Search and add foods with comprehensive nutritional information
- **Progress Monitoring**: Visual charts and statistics
- **Goal Setting**: Customizable daily calorie and nutrition goals
- **Responsive Design**: Optimized for all devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- React Router for navigation
- Axios for API calls

### Backend Requirements
- Node.js with Express
- MongoDB database
- JWT authentication
- Email service for OTP
- Bcrypt for password hashing

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update environment variables in `.env`

5. Start development server:
   ```bash
   npm run dev
   ```

## Backend Setup

The application requires a backend API. Create a separate Node.js project with the following endpoints:

### Authentication Routes
- POST `/api/auth/signup` - User registration
- POST `/api/auth/verify-otp` - OTP verification
- POST `/api/auth/login` - User login
- PUT `/api/auth/profile` - Update user profile

### Food Routes
- GET `/api/foods/search` - Search foods
- GET `/api/foods/:id` - Get food details
- POST `/api/foods/entries` - Add food entry
- GET `/api/foods/entries` - Get food entries
- PUT `/api/foods/entries/:id` - Update food entry
- DELETE `/api/foods/entries/:id` - Delete food entry

### Stats Routes
- GET `/api/stats/daily` - Get daily statistics
- GET `/api/stats/weekly` - Get weekly statistics

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  age: Number,
  height: Number,
  weight: Number,
  activityLevel: String,
  goal: String,
  dailyCalorieGoal: Number,
  isVerified: Boolean,
  otp: String,
  otpExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Foods Collection
```javascript
{
  _id: ObjectId,
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
  sugar: Number,
  sodium: Number,
  servingSize: String,
  category: String
}
```

### Food Entries Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  foodId: ObjectId,
  quantity: Number,
  meal: String,
  date: String,
  createdAt: Date
}
```

## Deployment

### Frontend (Vercel)
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Set environment variables
   - Deploy

### Backend (Render)
1. Create a separate Node.js project
2. Implement the required API endpoints
3. Connect to MongoDB Atlas
4. Deploy to Render

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL

### Backend
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `EMAIL_SERVICE` - Email service configuration
- `PORT` - Server port

## License

MIT License