import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Get booking details from location state
  const bookingData = location.state?.bookingData || {
    _id: 'BOOK123',
    totalPrice: 5000,
    car: { name: 'Sample Car' },
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
  };

  const displayData = {
    bookingId: bookingData._id || 'BOOK123',
    totalPrice: bookingData.totalPrice || 5000,
    carName: bookingData.car?.name || 'Sample Car',
    startDate: new Date(bookingData.startDateTime).toLocaleDateString() + ' ' + new Date(bookingData.startDateTime).toLocaleTimeString(),
    endDate: new Date(bookingData.endDateTime).toLocaleDateString() + ' ' + new Date(bookingData.endDateTime).toLocaleTimeString(),
  };

  const upiId = '7207096263@ybl';
  const upiLink = `upi://pay?pa=${upiId}&pn=CarRental&am=${displayData.totalPrice}&tn=Booking%20Payment`;

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      navigate('/bookings', { 
        state: { message: 'Payment completed successfully!' } 
      });
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <h1>Payment Gateway</h1>
        
        <div className="payment-details-card">
          <h2>Booking Summary</h2>
          <div className="booking-info">
            <div className="info-row">
              <span className="label">Booking ID:</span>
              <span className="value">{displayData.bookingId}</span>
            </div>
            <div className="info-row">
              <span className="label">Car:</span>
              <span className="value">{displayData.carName}</span>
            </div>
            <div className="info-row">
              <span className="label">Start Date:</span>
              <span className="value">{displayData.startDate}</span>
            </div>
            <div className="info-row">
              <span className="label">End Date:</span>
              <span className="value">{displayData.endDate}</span>
            </div>
            <div className="info-row total">
              <span className="label">Total Amount:</span>
              <span className="value">₹{displayData.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <h2>Select Payment Method</h2>
          
          <div className="method-tabs">
            <button 
              className={`tab-button ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              UPI Payment
            </button>
          </div>

          {paymentStatus === 'success' && (
            <div className="success-message">
              ✓ Payment Successful! Redirecting...
            </div>
          )}

          {paymentMethod === 'upi' && paymentStatus !== 'success' && (
            <div className="upi-payment">
              <h3>Pay via UPI</h3>
              <p className="upi-instruction">Scan the QR code below with your UPI app or enter UPI ID manually</p>
              
              <div className="qr-container">
                <QRCodeSVG 
                  value={upiLink} 
                  size={250}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              <div className="upi-id-section">
                <p className="upi-label">UPI ID:</p>
                <div className="upi-id-display">
                  <span>{upiId}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(upiId);
                      alert('UPI ID copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="payment-instructions">
                <h4>Payment Instructions:</h4>
                <ol>
                  <li>Open your UPI app (Google Pay, PhonePe, BHIM, etc.)</li>
                  <li>Scan the QR code or enter the UPI ID</li>
                  <li>Enter amount: ₹{displayData.totalPrice}</li>
                  <li>Complete the payment with your PIN</li>
                  <li>Confirmation will appear here automatically</li>
                </ol>
              </div>

              <button 
                className="btn btn-success"
                onClick={handlePaymentSuccess}
              >
                ✓ Payment Completed
              </button>
            </div>
          )}

        </div>

        <button 
          className="btn btn-secondary cancel-btn"
          onClick={handleCancel}
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
