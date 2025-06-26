const mongoose = require('mongoose');
const Food = require('../models/Food');
const Exercise = require('../models/Exercise');
require('dotenv').config();

const foods = [
  // Fruits
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1, servingSize: '1 medium (182g)', category: 'Fruits' },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, servingSize: '1 medium (118g)', category: 'Fruits' },
  { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9, sodium: 0, servingSize: '1 medium (154g)', category: 'Fruits' },
  { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, fiber: 2, sugar: 4.9, sodium: 1, servingSize: '1 cup (152g)', category: 'Fruits' },
  { name: 'Grapes', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 16, sodium: 2, servingSize: '1 cup (151g)', category: 'Fruits' },
  { name: 'Watermelon', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, sugar: 6, sodium: 1, servingSize: '1 cup (152g)', category: 'Fruits' },
  { name: 'Pineapple', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, sugar: 10, sodium: 1, servingSize: '1 cup (165g)', category: 'Fruits' },
  { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 14, sodium: 1, servingSize: '1 cup (165g)', category: 'Fruits' },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, sugar: 10, sodium: 1, servingSize: '1 cup (148g)', category: 'Fruits' },
  { name: 'Papaya', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, sugar: 8, sodium: 8, servingSize: '1 cup (145g)', category: 'Fruits' },
  
  // Vegetables
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.5, sodium: 33, servingSize: '1 cup (91g)', category: 'Vegetables' },
  { name: 'Spinach', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, sodium: 24, servingSize: '1 cup (30g)', category: 'Vegetables' },
  { name: 'Carrots', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69, servingSize: '1 cup (128g)', category: 'Vegetables' },
  { name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5, servingSize: '1 medium (123g)', category: 'Vegetables' },
  { name: 'Potato', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6, servingSize: '1 medium (173g)', category: 'Vegetables' },
  { name: 'Onion', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, sugar: 4.2, sodium: 4, servingSize: '1 medium (110g)', category: 'Vegetables' },
  { name: 'Cucumber', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2, servingSize: '1/2 cup (52g)', category: 'Vegetables' },
  { name: 'Bell Pepper', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, sugar: 4.2, sodium: 2, servingSize: '1 medium (119g)', category: 'Vegetables' },
  { name: 'Cauliflower', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sugar: 2, sodium: 30, servingSize: '1 cup (107g)', category: 'Vegetables' },
  { name: 'Sweet Corn', calories: 86, protein: 3.2, carbs: 19, fat: 1.4, fiber: 2.7, sugar: 6.3, sodium: 15, servingSize: '1 cup (145g)', category: 'Vegetables' },
  
  // Grains
  { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sugar: 0.4, sodium: 5, servingSize: '1 cup cooked (195g)', category: 'Grains' },
  { name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, sugar: 1.6, sodium: 13, servingSize: '1 cup cooked (185g)', category: 'Grains' },
  { name: 'Oatmeal', calories: 154, protein: 5, carbs: 28, fat: 3, fiber: 4, sugar: 0.6, sodium: 9, servingSize: '1 cup cooked (234g)', category: 'Grains' },
  { name: 'Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, servingSize: '1 cup cooked (158g)', category: 'Grains' },
  { name: 'White Rice', calories: 130, protein: 2.4, carbs: 28, fat: 0.2, fiber: 0.3, sugar: 0.1, sodium: 1, servingSize: '1 cup cooked (158g)', category: 'Grains' },
  { name: 'Basmati Rice', calories: 121, protein: 3.5, carbs: 25.2, fat: 0.4, fiber: 0.7, sugar: 0.1, sodium: 1, servingSize: '1 cup cooked (163g)', category: 'Grains' },
  { name: 'Chapati', calories: 104, protein: 3, carbs: 18, fat: 2, fiber: 2.5, sugar: 0.2, sodium: 2, servingSize: '1 medium (40g)', category: 'Grains' },
  { name: 'Idli', calories: 39, protein: 1.6, carbs: 7.4, fat: 0.2, fiber: 0.3, sugar: 0.1, sodium: 65, servingSize: '1 piece (30g)', category: 'Grains' },
  { name: 'Dosa', calories: 133, protein: 2.7, carbs: 18, fat: 5.8, fiber: 0.7, sugar: 0.2, sodium: 150, servingSize: '1 piece (50g)', category: 'Grains' },
  { name: 'Bread (Whole Wheat)', calories: 69, protein: 3.6, carbs: 12, fat: 1.1, fiber: 1.9, sugar: 1.6, sodium: 132, servingSize: '1 slice (28g)', category: 'Grains' },
  
  // Proteins
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, servingSize: '100g', category: 'Protein' },
  { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 59, servingSize: '100g', category: 'Protein' },
  { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124, servingSize: '2 large eggs', category: 'Protein' },
  { name: 'Paneer', calories: 265, protein: 18, carbs: 6, fat: 20.8, fiber: 0, sugar: 4, sodium: 22, servingSize: '100g', category: 'Protein' },
  { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.3, sodium: 7, servingSize: '100g', category: 'Protein' },
  { name: 'Lentils (Cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, sugar: 1.8, sodium: 2, servingSize: '1 cup (198g)', category: 'Protein' },
  { name: 'Kidney Beans', calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, fiber: 6.4, sugar: 0.6, sodium: 2, servingSize: '1 cup (177g)', category: 'Protein' },
  { name: 'Chickpeas', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 24, servingSize: '1 cup (164g)', category: 'Protein' },
  
  // Dairy
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.4, fiber: 0, sugar: 6, sodium: 56, servingSize: '1 container (170g)', category: 'Dairy' },
  { name: 'Milk (2%)', calories: 122, protein: 8, carbs: 12, fat: 4.8, fiber: 0, sugar: 12, sodium: 115, servingSize: '1 cup (244g)', category: 'Dairy' },
  { name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9.3, fiber: 0, sugar: 0.1, sodium: 174, servingSize: '1 slice (28g)', category: 'Dairy' },
  { name: 'Butter', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, fiber: 0, sugar: 0, sodium: 82, servingSize: '1 tbsp (14g)', category: 'Dairy' },
  
  // Nuts & Seeds
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, sodium: 1, servingSize: '1 oz (28g)', category: 'Nuts & Seeds' },
  { name: 'Walnuts', calories: 185, protein: 4.3, carbs: 3.9, fat: 18, fiber: 1.9, sugar: 0.7, sodium: 1, servingSize: '1 oz (28g)', category: 'Nuts & Seeds' },
  { name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, sugar: 3, sodium: 147, servingSize: '2 tbsp (32g)', category: 'Nuts & Seeds' },
  
  // Fast Food
  { name: 'Big Mac', calories: 550, protein: 25, carbs: 45, fat: 33, fiber: 3, sugar: 9, sodium: 1010, servingSize: '1 burger', category: 'Fast Food' },
  { name: 'Pizza Slice', calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2, sugar: 4, sodium: 640, servingSize: '1 slice', category: 'Fast Food' },
  { name: 'French Fries', calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, sugar: 0.3, sodium: 210, servingSize: '1 medium (117g)', category: 'Fast Food' },
  { name: 'Potato Chips', calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1, sugar: 0.1, sodium: 149, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Chocolate Bar', calories: 229, protein: 2.5, carbs: 25, fat: 13, fiber: 1.4, sugar: 24, sodium: 40, servingSize: '1 bar (43g)', category: 'Snacks' },
  
  // Beverages
  { name: 'Orange Juice', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, sodium: 2, servingSize: '1 cup (248g)', category: 'Beverages' },
  { name: 'Coca-Cola', calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39, sodium: 45, servingSize: '1 can (355ml)', category: 'Beverages' },
  { name: 'Coffee (Black)', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5, servingSize: '1 cup (240ml)', category: 'Beverages' },
  { name: 'Tea', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 2, servingSize: '1 cup (237ml)', category: 'Beverages' },
  { name: 'Milkshake', calories: 350, protein: 8, carbs: 60, fat: 10, fiber: 0, sugar: 50, sodium: 180, servingSize: '1 cup (240ml)', category: 'Beverages' },
];

const exercises = [
  // Cardio
  { name: 'Running', caloriesPerMinute: 10, category: 'Cardio' },
  { name: 'Walking', caloriesPerMinute: 4, category: 'Cardio' },
  { name: 'Cycling', caloriesPerMinute: 8, category: 'Cardio' },
  { name: 'Swimming', caloriesPerMinute: 11, category: 'Cardio' },
  { name: 'Jumping Jacks', caloriesPerMinute: 8, category: 'Cardio' },
  { name: 'Rowing', caloriesPerMinute: 9, category: 'Cardio' },
  { name: 'Elliptical', caloriesPerMinute: 7, category: 'Cardio' },
  
  // Strength Training
  { name: 'Weight Lifting', caloriesPerMinute: 6, category: 'Strength' },
  { name: 'Push-ups', caloriesPerMinute: 7, category: 'Strength' },
  { name: 'Pull-ups', caloriesPerMinute: 8, category: 'Strength' },
  { name: 'Squats', caloriesPerMinute: 5, category: 'Strength' },
  { name: 'Deadlifts', caloriesPerMinute: 8, category: 'Strength' },
  { name: 'Bench Press', caloriesPerMinute: 7, category: 'Strength' },
  
  // Sports
  { name: 'Basketball', caloriesPerMinute: 8, category: 'Sports' },
  { name: 'Tennis', caloriesPerMinute: 7, category: 'Sports' },
  { name: 'Soccer', caloriesPerMinute: 9, category: 'Sports' },
  { name: 'Badminton', caloriesPerMinute: 6, category: 'Sports' },
  { name: 'Table Tennis', caloriesPerMinute: 4, category: 'Sports' },
  
  // Flexibility & Other
  { name: 'Yoga', caloriesPerMinute: 3, category: 'Flexibility' },
  { name: 'Dancing', caloriesPerMinute: 5, category: 'Recreation' },
  { name: 'Stretching', caloriesPerMinute: 2, category: 'Flexibility' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Food.deleteMany({});
    await Exercise.deleteMany({});

    // Insert foods
    await Food.insertMany(foods);
    console.log('Foods seeded successfully');

    // Insert exercises
    await Exercise.insertMany(exercises);
    console.log('Exercises seeded successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();