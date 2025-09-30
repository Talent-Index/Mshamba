import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FarmListPage from './pages/FarmListPage';
import FarmDetailsPage from './pages/FarmDetailsPage';
import CreateFarmPage from './pages/CreateFarmPage';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/farms" element={<FarmListPage />} />
          <Route path="/farms/:id" element={<FarmDetailsPage />} />
          <Route path="/create-farm" element={<CreateFarmPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;