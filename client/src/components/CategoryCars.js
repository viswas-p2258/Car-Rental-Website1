import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { carsAPI } from '../services/api';
import './Cars.css';

const CategoryCars = ({ categoryName, categoryTitle }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    brand: '',
  });

  useEffect(() => {
    fetchCars();
  }, [filters, categoryName]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = { category: categoryName };
      if (filters.location) params.location = filters.location;
      if (filters.brand) params.brand = filters.brand;

      const response = await carsAPI.getAll(params);
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="cars-page container">
      <h1>{categoryTitle} Cars</h1>

      <div className="filters">
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Enter location"
          />
        </div>

        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            placeholder="Enter brand"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading cars...</p>
      ) : cars.length > 0 ? (
        <div className="card-grid">
          {cars.map((car) => (
            <div key={car._id} className="car-card">
              <img src={car.images[0] || 'https://via.placeholder.com/300'} alt={car.name} />
              <div className="car-card-content">
                <h3>{car.name}</h3>
                <p>{car.brand} • {car.model} • {car.year}</p>
                <p>📍 {car.location}</p>
                <p>🚗 {car.category} • {car.seats} seats • {car.transmission}</p>
                {car.featured && <span className="badge badge-featured">Featured</span>}
                {car.bestSeller && <span className="badge badge-bestseller">Best Seller</span>}
                <div className="price">₹{car.pricePerDay}/day</div>
                <Link to={`/cars/${car._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No {categoryTitle.toLowerCase()} cars found matching your criteria.</p>
      )}
    </div>
  );
};

export default CategoryCars;
