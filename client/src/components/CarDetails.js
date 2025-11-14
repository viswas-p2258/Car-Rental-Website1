import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CarDetails.css';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDateTime: '',
    endDateTime: '',
    pickupLocation: '',
    dropoffLocation: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await carsAPI.getById(id);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car:', error);
      setMessage('Car not found');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Check availability first
      const availabilityCheck = await bookingsAPI.checkAvailability({
        carId: id,
        startDateTime: bookingData.startDateTime,
        endDateTime: bookingData.endDateTime,
      });

      if (!availabilityCheck.data.available) {
        setMessage('Car is not available for the selected dates');
        return;
      }

      // Create booking
      const response = await bookingsAPI.create({
        carId: id,
        ...bookingData,
      });

      setMessage('Booking created successfully!');
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!car) return <div className="container"><p>Car not found</p></div>;

  return (
    <div className="car-details container">
      <div className="car-details-content">
        <div className="car-images">
          <img src={car.images[0] || 'https://via.placeholder.com/600'} alt={car.name} />
        </div>

        <div className="car-info">
          <h1>{car.name}</h1>
          <p className="car-subtitle">{car.brand} • {car.model} • {car.year}</p>
          {car.featured && <span className="badge badge-featured">Featured</span>}
          {car.bestSeller && <span className="badge badge-bestseller">Best Seller</span>}
          
          <div className="price">₹{car.pricePerDay}/day</div>

          <div className="car-specs">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div><strong>Category:</strong> {car.category}</div>
              <div><strong>Seats:</strong> {car.seats}</div>
              <div><strong>Transmission:</strong> {car.transmission}</div>
              <div><strong>Fuel Type:</strong> {car.fuelType}</div>
              <div><strong>Location:</strong> {car.location}</div>
              {car.mileagePerLitre && <div><strong>Mileage:</strong> {car.mileagePerLitre} km/L</div>}
              {car.rangeKm && <div><strong>Range:</strong> {car.rangeKm} km</div>}
            </div>
          </div>

          <div className="car-description">
            <h3>Description</h3>
            <p>{car.description}</p>
          </div>
        </div>
      </div>

      <div className="booking-form card">
        <h2>Book This Car</h2>
        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label>Start Date & Time</label>
            <input
              type="datetime-local"
              required
              value={bookingData.startDateTime}
              onChange={(e) => setBookingData({ ...bookingData, startDateTime: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>End Date & Time</label>
            <input
              type="datetime-local"
              required
              value={bookingData.endDateTime}
              onChange={(e) => setBookingData({ ...bookingData, endDateTime: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Pickup Location</label>
            <input
              type="text"
              required
              value={bookingData.pickupLocation}
              onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
              placeholder="Enter pickup location"
            />
          </div>

          <div className="form-group">
            <label>Dropoff Location</label>
            <input
              type="text"
              required
              value={bookingData.dropoffLocation}
              onChange={(e) => setBookingData({ ...bookingData, dropoffLocation: e.target.value })}
              placeholder="Enter dropoff location"
            />
          </div>

          {message && (
            <div className={message.includes('success') ? 'success' : 'error'}>
              {message}
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarDetails;

