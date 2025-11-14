import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Cars from './components/Cars';
import EVCars from './components/EVCars';
import PetrolCars from './components/PetrolCars';
import DieselCars from './components/DieselCars';
import CarDetails from './components/CarDetails';
import Payment from './components/Payment';
import Login from './components/Login';
import Register from './components/Register';
import Bookings from './components/Bookings';
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/ev" element={<EVCars />} />
            <Route path="/petrol" element={<PetrolCars />} />
            <Route path="/diesel" element={<DieselCars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/bookings" 
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </PrivateRoute>
              } 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

