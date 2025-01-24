import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Experience from "../pages/Experience";
import Users from "../pages/Users";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiences" element={<Experience />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
