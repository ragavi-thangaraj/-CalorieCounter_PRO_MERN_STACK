# Calorie Counter Backend

A professional Node.js backend API for the Calorie Counter application.

## Features

- User authentication with JWT tokens
- Email OTP verification
- Food database with search functionality
- Exercise tracking
- Daily and weekly statistics
- Weight tracking
- Secure password hashing
- Rate limiting and security middleware

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email services
- Express Rate Limit for API protection
- Helmet for security headers

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3001
MONGODB_URI=mongodb+srv://ragavi:qwerty786!A@caloriesdb.vwyaye1.mongodb.net/caloriecounter?retryWrites=true&w=majority&appName=CaloriesDB
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Seed the database with sample foods and exercises:
```bash
node scripts/seedDatabase.js
```

3. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update user profile

### Foods
- `GET /api/foods/search?q=query` - Search foods
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods/entries` - Add food entry
- `GET /api/foods/entries?date=YYYY-MM-DD` - Get food entries
- `PUT /api/foods/entries/:id` - Update food entry
- `DELETE /api/foods/entries/:id` - Delete food entry

### Exercises
- `GET /api/exercises/search?q=query` - Search exercises
- `POST /api/exercises/entries` - Add exercise entry
- `GET /api/exercises/entries?date=YYYY-MM-DD` - Get exercise entries
- `DELETE /api/exercises/entries/:id` - Delete exercise entry

### Weight
- `POST /api/weight` - Add weight entry
- `GET /api/weight?days=30` - Get weight entries

### Statistics
- `GET /api/stats/daily?date=YYYY-MM-DD` - Get daily stats
- `GET /api/stats/weekly?startDate=YYYY-MM-DD` - Get weekly stats

## Deployment on Render.com

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy!

## Email Configuration

For email OTP functionality, you need to:

1. Use Gmail SMTP or another email service
2. For Gmail, enable 2-factor authentication
3. Generate an App Password
4. Use the App Password in EMAIL_PASS environment variable

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with express-validator
- MongoDB injection protection

## Database Schema

The application uses MongoDB with the following collections:
- Users (authentication and profile data)
- Foods (nutrition database)
- FoodEntries (user food logs)
- Exercises (exercise database)
- ExerciseEntries (user exercise logs)
- WeightEntries (user weight tracking)

## Error Handling

The API includes comprehensive error handling with:
- Validation errors
- Authentication errors
- Database errors
- Network timeouts
- Proper HTTP status codes