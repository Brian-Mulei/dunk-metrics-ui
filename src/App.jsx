import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import StandingsTable from './pages/StandingsTable';
import { Hero } from './components/Hero'
import { useState } from 'react';
import Layout from './components/Layout';
import { Import } from 'lucide-react';
import NewsPage from './pages/NewsPage';
const App = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="team/:id" element={<TeamPage />} />
      <Route path="standings" element={<StandingsTable />} />
      <Route path="news" element={<NewsPage />} />
      { /*
        <Route path="teams/:id" element={<TeamDetails />} /> */}
      </Route>
    </Routes>
  </Router>
  )
}

export default App