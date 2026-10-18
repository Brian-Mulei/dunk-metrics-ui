import { lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const StandingsTable = lazy(() => import('./pages/StandingsTable'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const AwardsPage = lazy(() => import('./pages/AwardsPage'));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="team/:id" element={<TeamPage />} />
          <Route path="standings" element={<StandingsTable />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="awards" element={<AwardsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
