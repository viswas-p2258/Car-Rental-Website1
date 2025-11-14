import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import './Bookings.css';

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancel(id);
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="bookings-page container">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card">
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card card">
              <div className="booking-header">
                <h3>{booking.car?.name || 'Car'}</h3>
                <span className={`status status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <strong>Start:</strong> {formatDate(booking.startDateTime)}
                </div>
                <div className="detail-item">
                  <strong>End:</strong> {formatDate(booking.endDateTime)}
                </div>
                <div className="detail-item">
                  <strong>Pickup:</strong> {booking.pickupLocation}
                </div>
                <div className="detail-item">
                  <strong>Dropoff:</strong> {booking.dropoffLocation}
                </div>
                <div className="detail-item">
                  <strong>Total Price:</strong> ₹{booking.totalPrice}
                </div>
              </div>

              {booking.status !== 'Cancelled' && (
                <div className="booking-actions">
                  <button
                    onClick={() => navigate('/payment', { state: { bookingData: booking } })}
                    className="btn btn-primary"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="btn btn-danger"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;

