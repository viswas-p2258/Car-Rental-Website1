const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1990 },
  pricePerDay: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['EV', 'Petrol', 'Diesel'], trim: true },
  seats: { type: Number, required: true, min: 2 },
  transmission: { type: String, required: true, enum: ['Automatic', 'Manual'] },
  fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
  mileagePerLitre: { type: Number, min: 0 },
  rangeKm: { type: Number, min: 0 },
  location: { type: String, required: true, trim: true },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) { return v.length > 0; },
      message: 'At least one car image is required'
    }
  },
  availableCount: { type: Number, required: true, min: 0, default: 1 },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);


