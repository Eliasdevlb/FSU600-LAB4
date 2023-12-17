import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
import LoginPage from '../routes/LoginPage';
import AdminPage from '../routes/AdminPage';
import CheckoutPage from '../routes/CheckoutPage';
import SignupPage from '../routes/Signup';

const RoutesComponent = ({ cartItems }) => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default RoutesComponent;
