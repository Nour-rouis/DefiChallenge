import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Experience from '../pages/Experience';
import Users from '../pages/Users';
import ConfigTache from '../pages/ConfigTache';


import Home from '../pages/Home';
const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/users" element={<Users />} />
        <Route path="/config" element={<ConfigTache />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
