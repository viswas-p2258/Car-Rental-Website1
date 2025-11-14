const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  pickupLocation: { type: String, required: true, trim: true },
  dropoffLocation: { type: String, required: true, trim: true },
  totalPrice: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  notes: { type: String, trim: true }
}, { timestamps: true });

// Ensure start is before end
bookingSchema.pre('save', function(next) {
  if (this.startDateTime >= this.endDateTime) {
    return next(new Error('startDateTime must be before endDateTime'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);


