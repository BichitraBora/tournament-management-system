import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import Dashboard from './pages/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import CreateTournament from './pages/tournaments/CreateTournament';
import TournamentApply from './pages/tournaments/TournamentApply';
import RegistrationsTable from './pages/dashboard/RegistrationsTable';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
          
          {/* Navbar sits outside the Routes so it renders everywhere */}
          <Navbar /> 
          
          <main className="container px-4 py-8 mx-auto">
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tournaments" element={<div className="py-12 text-center"><h1 className="text-3xl font-bold">All Tournaments</h1><p className="text-gray-500">Coming soon...</p></div>} />
              <Route path="/about" element={<div className="py-12 text-center"><h1 className="text-3xl font-bold">About Us</h1></div>} />
              <Route path="/contact" element={<div className="py-12 text-center"><h1 className="text-3xl font-bold">Contact</h1></div>} />
              <Route path="/create-tournament" element={<CreateTournament />} />
              <Route path="/tournaments/:id" element={<TournamentApply />} />
              <Route path="/tournaments/:id/registrations" element={<RegistrationsTable />} />
            </Routes>
          </main>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;