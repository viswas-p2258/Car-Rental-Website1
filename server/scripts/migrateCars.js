const mongoose = require('mongoose');
const Car = require('../models/Car');

// Migration script to update old car categories to new enum values
const migrateCars = async () => {
  try {
    // Map old categories to new ones
    const categoryMap = {
      'SUV': 'Diesel',
      'Sedan': 'Petrol',
      'Hatchback': 'Petrol',
      'Luxury': 'Petrol',
      'Electric': 'EV',
      'Convertible': 'Petrol',
      'Pickup': 'Diesel'
    };

    // Get all cars with old categories
    const cars = await Car.find({});
    
    for (const car of cars) {
      if (!['EV', 'Petrol', 'Diesel'].includes(car.category)) {
        const newCategory = categoryMap[car.category] || 'Petrol';
        car.category = newCategory;
        await car.save();
        console.log(`Migrated car ${car._id}: ${car.name} from ${car.category} to ${newCategory}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
  }
};

module.exports = migrateCars;
