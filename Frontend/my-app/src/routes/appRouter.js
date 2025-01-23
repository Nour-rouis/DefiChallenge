import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Experience from '../pages/Experience';
import Users from '../pages/Users';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/experience" element={<Experience />} />
        <Route path="/users" element={<Users />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
