import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-nav">
            <a href="#contact">CONTACT US</a>
            <span className="divider">|</span>
            <a href="#search">SEARCH</a>
            <span className="divider">|</span>
            <a href="#announcement">ANNOUNCEMENT</a>
            <span className="divider">|</span>
            <a href="#legal">LEGAL NOTICE</a>
            <span className="divider">|</span>
            <a href="#help">HELP</a>
            <span className="divider">|</span>
            <a href="#sitemap">SITE MAP</a>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Top Sections */}
            <div className="footer-column">
              <h3 className="footer-heading">TOP SECTIONS</h3>
              <ul className="footer-links">
                <li><a href="#pricing">PRICE LIST</a></li>
                <li><a href="#ebook">E-BOOK</a></li>
                <li><a href="#dealer">FIND A DEALER</a></li>
                <li><a href="#testdrive">TEST DRIVE</a></li>
                <li><a href="#brochure">BROCHURE</a></li>
                <li><a href="#exchange">EXCHANGE</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3 className="footer-heading">QUICK LINKS</h3>
              <ul className="footer-links">
                <li><a href="#about">ABOUT US</a></li>
                <li><a href="#feedback">FEEDBACK/QUERIES</a></li>
              </ul>
              <h3 className="footer-heading more-heading">MORE</h3>
              <ul className="footer-links">
                <li><a href="#health">HEALTH & SAFETY POLICY</a></li>
                <li><a href="#impossible">START YOUR IMPOSSIBLE</a></li>
              </ul>
            </div>

            {/* Media */}
            <div className="footer-column">
              <h3 className="footer-heading">MEDIA</h3>
              <ul className="footer-links">
                <li><a href="#press">PRESS RELEASE</a></li>
                <li><a href="#articles">ARTICLES/REVIEWS</a></li>
                <li><a href="#spokespersons">SPOKESPERSONS IMAGES</a></li>
                <li><a href="#stories">CUSTOMER STORIES</a></li>
                <li><a href="#awards">AWARDS</a></li>
                <li><a href="#contest">DREAM CAR CONTEST</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="footer-column social-column">
              <h3 className="footer-heading">FOLLOW CAR RENTAL</h3>
              <div className="social-links">
                <a href="#twitter" className="social-icon" title="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#facebook" className="social-icon" title="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#youtube" className="social-icon" title="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#instagram" className="social-icon" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2025 Car Rental. All rights reserved. | Privacy Policy | Terms & Conditions</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
