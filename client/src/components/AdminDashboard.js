import React, { useState, useEffect } from 'react';
import { carsAPI, bookingsAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carFormData, setCarFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: 0,
    category: 'Sedan',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    mileagePerLitre: 0,
    location: '',
    images: [''],
    availableCount: 1,
    featured: false,
    bestSeller: false,
    description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'cars') {
      fetchCars();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carsAPI.getAll();
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setMessage('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAll();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      const imagesArray = carFormData.images.filter(img => img.trim() !== '');
      
      if (imagesArray.length === 0) {
        setMessage('At least one image URL is required');
        return;
      }

      const carData = {
        ...carFormData,
        images: imagesArray,
        year: parseInt(carFormData.year),
        pricePerDay: parseFloat(carFormData.pricePerDay),
        seats: parseInt(carFormData.seats),
        availableCount: parseInt(carFormData.availableCount),
        mileagePerLitre: carFormData.mileagePerLitre ? parseFloat(carFormData.mileagePerLitre) : undefined,
      };

      if (editingCar) {
        await carsAPI.update(editingCar._id, carData);
        setMessage('Car updated successfully!');
      } else {
        await carsAPI.create(carData);
        setMessage('Car created successfully!');
      }

      setShowCarForm(false);
      setEditingCar(null);
      resetCarForm();
      fetchCars();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save car');
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarFormData({
      name: car.name || '',
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      pricePerDay: car.pricePerDay || 0,
      category: car.category || 'Sedan',
      seats: car.seats || 5,
      transmission: car.transmission || 'Automatic',
      fuelType: car.fuelType || 'Petrol',
      mileagePerLitre: car.mileagePerLitre || 0,
      location: car.location || '',
      images: car.images && car.images.length > 0 ? car.images : [''],
      availableCount: car.availableCount || 1,
      featured: car.featured || false,
      bestSeller: car.bestSeller || false,
      description: car.description || '',
    });
    setShowCarForm(true);
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carsAPI.delete(id);
        setMessage('Car deleted successfully!');
        fetchCars();
      } catch (error) {
        setMessage('Failed to delete car');
      }
    }
  };

  const resetCarForm = () => {
    setCarFormData({
      name: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      pricePerDay: 0,
      category: 'EV',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileagePerLitre: 0,
      location: '',
      images: [''],
      availableCount: 1,
      featured: false,
      bestSeller: false,
      description: '',
    });
  };

  const addImageField = () => {
    setCarFormData({
      ...carFormData,
      images: [...carFormData.images, ''],
    });
  };

  const updateImageField = (index, value) => {
    const newImages = [...carFormData.images];
    newImages[index] = value;
    setCarFormData({ ...carFormData, images: newImages });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="admin-dashboard container">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === 'cars' ? 'active' : ''}
          onClick={() => setActiveTab('cars')}
        >
          Manage Cars
        </button>
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
      </div>

      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      {activeTab === 'cars' && (
        <div className="admin-cars">
          <div className="admin-header">
            <h2>Cars Management</h2>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetCarForm();
                setEditingCar(null);
                setShowCarForm(true);
              }}
            >
              Add New Car
            </button>
          </div>

          {showCarForm && (
            <div className="car-form card">
              <h3>{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
              <form onSubmit={handleCarSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      required
                      value={carFormData.name}
                      onChange={(e) => setCarFormData({ ...carFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand *</label>
                    <input
                      type="text"
                      required
                      value={carFormData.brand}
                      onChange={(e) => setCarFormData({ ...carFormData, brand: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Model *</label>
                    <input
                      type="text"
                      required
                      value={carFormData.model}
                      onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year *</label>
                    <input
                      type="number"
                      required
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={carFormData.year}
                      onChange={(e) => setCarFormData({ ...carFormData, year: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price Per Day (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={carFormData.pricePerDay}
                      onChange={(e) => setCarFormData({ ...carFormData, pricePerDay: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      required
                      value={carFormData.category}
                      onChange={(e) => setCarFormData({ ...carFormData, category: e.target.value })}
                    >
                      <option value="EV">EV</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Seats *</label>
                    <input
                      type="number"
                      required
                      min="2"
                      value={carFormData.seats}
                      onChange={(e) => setCarFormData({ ...carFormData, seats: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Transmission *</label>
                    <select
                      required
                      value={carFormData.transmission}
                      onChange={(e) => setCarFormData({ ...carFormData, transmission: e.target.value })}
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fuel Type *</label>
                    <select
                      required
                      value={carFormData.fuelType}
                      onChange={(e) => setCarFormData({ ...carFormData, fuelType: e.target.value })}
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Mileage (km/L)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={carFormData.mileagePerLitre}
                      onChange={(e) => setCarFormData({ ...carFormData, mileagePerLitre: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      required
                      value={carFormData.location}
                      onChange={(e) => setCarFormData({ ...carFormData, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Available Count *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={carFormData.availableCount}
                      onChange={(e) => setCarFormData({ ...carFormData, availableCount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    required
                    rows="3"
                    value={carFormData.description}
                    onChange={(e) => setCarFormData({ ...carFormData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Image URLs *</label>
                  {carFormData.images.map((img, index) => (
                    <input
                      key={index}
                      type="url"
                      value={img}
                      onChange={(e) => updateImageField(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      style={{ marginBottom: '10px' }}
                    />
                  ))}
                  <button type="button" onClick={addImageField} className="btn btn-secondary">
                    Add Another Image
                  </button>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={carFormData.featured}
                        onChange={(e) => setCarFormData({ ...carFormData, featured: e.target.checked })}
                      />
                      Featured
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={carFormData.bestSeller}
                        onChange={(e) => setCarFormData({ ...carFormData, bestSeller: e.target.checked })}
                      />
                      Best Seller
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingCar ? 'Update Car' : 'Create Car'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCarForm(false);
                      setEditingCar(null);
                      resetCarForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading cars...</p>
          ) : (
            <div className="admin-cars-list">
              {cars.length === 0 ? (
                <p>No cars found. Create your first car!</p>
              ) : (
                <div className="card-grid">
                  {cars.map((car) => (
                    <div key={car._id} className="car-card">
                      <img src={car.images[0] || 'https://via.placeholder.com/300'} alt={car.name} />
                      <div className="car-card-content">
                        <h3>{car.name}</h3>
                        <p>{car.brand} • {car.model} • {car.year}</p>
                        <p>📍 {car.location}</p>
                        <div className="price">₹{car.pricePerDay}/day</div>
                        <div className="car-actions">
                          <button
                            onClick={() => handleEditCar(car)}
                            className="btn btn-secondary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car._id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="admin-bookings">
          <h2>All Bookings</h2>
          {loading ? (
            <p>Loading bookings...</p>
          ) : (
            <div className="bookings-list">
              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking._id} className="booking-card card">
                    <div className="booking-header">
                      <h3>{booking.car?.name || 'Car'}</h3>
                      <span className={`status status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="detail-item">
                        <strong>User:</strong> {booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})
                      </div>
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
                        <strong>Total Price:</strong> ${booking.totalPrice}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

