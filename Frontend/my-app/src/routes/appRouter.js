import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Users from '../pages/Users';
import ConfigTache from '../pages/ConfigTache';
import RaquetteListe from '../components/RaquetteListe';

import Home from '../pages/Home';
import GestionExperience from '../pages/GestionExperience';
const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/experience/:id" >
        <Route index element={<GestionExperience />} />
        <Route path='raquettes' element={<RaquetteListe/>} />
        </Route>
        <Route path="/config" element={<ConfigTache />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
