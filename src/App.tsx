import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;