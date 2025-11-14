import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const images = [
    'https://static3.toyotabharat.com/images/homepage/banners/vellfire-homepage-banner-1920x807.jpg',
    'https://static3.toyotabharat.com/images/homepage/banners/drumtao-1920x807.jpg',
    'https://static3.toyotabharat.com/images/homepage/banners/lc-300-gr-sport-1920x807.webp',
    'https://static3.toyotabharat.com/images/homepage/banners/hilux-black-edition-1920x807.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const categories = [
    {
      id: 1,
      name: 'EV',
      image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/196279/harrier-ev-right-front-three-quarter.jpeg?isig=0&wm=4',
      description: 'Electric Vehicles',
      path: '/ev'
    },
    {
      id: 2,
      name: 'Petrol',
      image: 'https://www.mylescars.com/blog/wp-content/uploads/2024/03/Toyota-Camry-1-1024x576.jpg',
      description: 'Petrol Cars',
      path: '/petrol'
    },
    {
      id: 3,
      name: 'Diesel',
      image: 'https://imgcdn.oto.com/large/gallery/exterior/38/894/toyota-fortuner-front-angle-low-view-580768.jpg',
      description: 'Diesel Vehicles',
      path: '/diesel'
    }
  ];

  return (
    <div className="home">
      <section className="image-carousel-section">
        <div className="image-carousel-container">
          <div className="image-carousel">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Car ${index + 1}`}
                className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-container">
          <h2 className="categories-title">Browse by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} className="category-image" />
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <Link to={category.path} className="category-btn">Explore</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

