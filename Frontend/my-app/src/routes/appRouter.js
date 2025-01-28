import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Users from '../pages/Users';
import ConfigTache from '../pages/ConfigTache';
import KpiPage from '../pages/KpiPage';import RaquetteListe from '../components/RaquetteListe';

import Home from '../pages/Home';
import GestionExperience from '../pages/GestionExperience';
const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/kpi" element={<KpiPage />} /> {/* /experience/:id/gerer/kpi */}
        <Route path="/experience/:id">
          <Route index element={<GestionExperience />} />
          {/* Corrected the nested route path */}
          
          <Route path="raquettes" element={<RaquetteListe />} /> {/* Removed the leading slash */}
        </Route>
        <Route path="/config" element={<ConfigTache />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
