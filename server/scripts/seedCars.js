const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('../models/Car');

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const count = await Car.countDocuments();
  if (count > 0) {
    console.log('Cars already exist. Skipping seed.');
    await mongoose.disconnect();
    return;
  }

  const cars = [
    {
      name: 'Toyota Corolla Altis',
      brand: 'Toyota',
      model: 'Corolla Altis',
      year: 2020,
      pricePerDay: 45,
      category: 'Sedan',
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
      category: 'SUV',
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
      category: 'Electric',
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
      category: 'SUV',
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

  await Car.insertMany(cars);
  console.log(`Inserted ${cars.length} cars.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


