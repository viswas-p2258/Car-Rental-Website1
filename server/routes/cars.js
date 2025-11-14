const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { protect, admin } = require('../middleware/auth');

// Auto-migrate cars on route load (fix invalid categories)
const autoMigrateCars = async () => {
  try {
    const categoryMap = {
      'SUV': 'Diesel',
      'Sedan': 'Petrol',
      'Hatchback': 'Petrol',
      'Luxury': 'Petrol',
      'Electric': 'EV',
      'Convertible': 'Petrol',
      'Pickup': 'Diesel'
    };

    const cars = await Car.find({});
    for (const car of cars) {
      if (!['EV', 'Petrol', 'Diesel'].includes(car.category)) {
        const newCategory = categoryMap[car.category] || 'Petrol';
        await Car.updateOne({ _id: car._id }, { category: newCategory });
      }
    }
  } catch (error) {
    console.log('Auto-migration check completed');
  }
};

// Run auto-migration when routes are loaded
autoMigrateCars();

// @route   GET /api/cars
// @desc    Get all cars (supports query: category, brand, featured, bestSeller, location)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, brand, featured, bestSeller, location } = req.query;
    const query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (location) query.location = location;
    if (featured) query.featured = featured === 'true';
    if (bestSeller) query.bestSeller = bestSeller === 'true';

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/cars/:id
// @desc    Get single car
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) return res.json(car);
    res.status(404).json({ message: 'Car not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cars
// @desc    Create a car
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const car = new Car(req.body);
    const created = await car.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update a car
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    Object.assign(car, req.body);
    const updated = await car.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    await car.deleteOne();
    res.json({ message: 'Car removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cars/seed
// @desc    Seed sample cars if none exist
// @access  Private/Admin (temporary can be called once)
router.post('/seed', protect, admin, async (req, res) => {
  try {
    const count = await Car.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Cars already seeded' });

    const cars = [
      {
        name: 'Toyota Corolla Altis',
        brand: 'Toyota',
        model: 'Corolla Altis',
        year: 2020,
        pricePerDay: 45,
        category: 'Petrol',
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        mileagePerLitre: 16,
        location: 'Chennai',
        images: ['https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg'],
        availableCount: 4,
        featured: true,
        bestSeller: true,
        rating: 4.5,
        numReviews: 38,
        description: 'Reliable sedan with comfortable ride and great efficiency.'
      },
      {
        name: 'Hyundai Creta',
        brand: 'Hyundai',
        model: 'Creta SX',
        year: 2022,
        pricePerDay: 55,
        category: 'Diesel',
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        mileagePerLitre: 18,
        location: 'Bengaluru',
        images: ['https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'],
        availableCount: 3,
        featured: true,
        bestSeller: false,
        rating: 4.3,
        numReviews: 21,
        description: 'Compact SUV ideal for city and highway with spacious cabin.'
      },
      {
        name: 'Tesla Model 3',
        brand: 'Tesla',
        model: 'Model 3 Long Range',
        year: 2023,
        pricePerDay: 120,
        category: 'EV',
        seats: 5,
        transmission: 'Automatic',
        fuelType: 'Electric',
        rangeKm: 510,
        location: 'Hyderabad',
        images: ['https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg'],
        availableCount: 2,
        featured: true,
        bestSeller: true,
        rating: 4.8,
        numReviews: 57,
        description: 'Premium electric sedan with cutting-edge tech and performance.'
      },
      {
        name: 'Mahindra Thar',
        brand: 'Mahindra',
        model: 'Thar LX',
        year: 2021,
        pricePerDay: 75,
        category: 'Diesel',
        seats: 4,
        transmission: 'Manual',
        fuelType: 'Diesel',
        mileagePerLitre: 12,
        location: 'Goa',
        images: ['https://images.pexels.com/photos/4062443/pexels-photo-4062443.jpeg'],
        availableCount: 3,
        featured: false,
        bestSeller: true,
        rating: 4.6,
        numReviews: 44,
        description: 'Rugged off-roader perfect for beach and adventure trips.'
      }
    ];

    const created = await Car.insertMany(cars);
    res.status(201).json({ inserted: created.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cars/migrate
// @desc    Migrate existing cars to new category enum values
// @access  Private/Admin
router.post('/migrate', protect, admin, async (req, res) => {
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

    const cars = await Car.find({});
    let migratedCount = 0;

    for (const car of cars) {
      if (!['EV', 'Petrol', 'Diesel'].includes(car.category)) {
        const newCategory = categoryMap[car.category] || 'Petrol';
        car.category = newCategory;
        await car.save();
        migratedCount++;
      }
    }

    res.json({ 
      message: 'Migration completed', 
      migratedCount,
      totalCars: cars.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cars/reset
// @desc    Delete all cars (for development only)
// @access  Private/Admin
router.delete('/reset', protect, admin, async (req, res) => {
  try {
    const result = await Car.deleteMany({});
    res.json({ 
      message: 'All cars deleted', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


