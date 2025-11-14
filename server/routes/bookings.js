const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { protect, admin } = require('../middleware/auth');

// Helper: check overlap
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// @route   POST /api/bookings/check
// @desc    Check car availability for a time window
// @access  Public
router.post('/check', async (req, res) => {
  try {
    const { carId, startDateTime, endDateTime } = req.body;
    if (!carId || !startDateTime || !endDateTime) {
      return res.status(400).json({ message: 'carId, startDateTime, endDateTime are required' });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (!(start < end)) return res.status(400).json({ message: 'Invalid time range' });

    // Find overlapping bookings that are not cancelled
    const existing = await Booking.find({
      car: carId,
      status: { $ne: 'Cancelled' },
      $or: [
        { startDateTime: { $lt: end }, endDateTime: { $gt: start } }
      ]
    });

    // availableCount cars of the same listing
    const available = (car.availableCount || 1) - existing.length;
    res.json({ available: available > 0, availableUnits: Math.max(0, available) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { carId, startDateTime, endDateTime, pickupLocation, dropoffLocation } = req.body;
    if (!carId || !startDateTime || !endDateTime || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (!(start < end)) return res.status(400).json({ message: 'Invalid time range' });

    // Availability check
    const overlapping = await Booking.countDocuments({
      car: carId,
      status: { $ne: 'Cancelled' },
      $or: [
        { startDateTime: { $lt: end }, endDateTime: { $gt: start } }
      ]
    });
    if ((overlapping || 0) >= (car.availableCount || 1)) {
      return res.status(409).json({ message: 'Car not available for the selected period' });
    }

    // Pricing: simple day-fraction pricing based on hours
    const ms = end.getTime() - start.getTime();
    const hours = ms / (1000 * 60 * 60);
    const dailyRate = car.pricePerDay || 0;
    const hourlyRate = dailyRate / 24;
    const totalPrice = Math.max(0, Math.round(hours * hourlyRate * 100) / 100);

    const booking = new Booking({
      car: car._id,
      user: req.user._id,
      startDateTime: start,
      endDateTime: end,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      status: 'Confirmed'
    });
    const created = await booking.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/my
// @desc    Get current user bookings
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings
// @desc    Admin - list all bookings
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('car');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking (owner or admin)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'Cancelled';
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


