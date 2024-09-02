import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />          {/* Default Route for Login Page */}
          <Route path="/dashboard" element={<DashboardPage />} />  {/* Route for Dashboard */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
