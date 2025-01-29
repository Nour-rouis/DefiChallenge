import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Users from '../pages/Users';
import ConfigTache from '../pages/ConfigTache';
import KpiPage from '../pages/KpiPage'; import RaquetteListe from '../components/RaquetteListe';

import Home from '../pages/Home';
import GestionExperience from '../pages/GestionExperience';
import ErreurListe from '../components/ErreurListe';
const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/kpi" element={<KpiPage />} /> {/* A supprimer */}
        <Route path="/experience/:idexp">
          <Route index element={<GestionExperience />} />
          <Route path="raquettes" element={<RaquetteListe />} />
          <Route path="raquettes/erreurs" element={<ErreurListe />} />
          <Route path="operateur/:idop">
            <Route path="tache/:idtac">
              <Route path="config" element={<ConfigTache />} />
              <Route path="analyse" element={<KpiPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
