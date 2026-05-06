import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import Navbar from './components/layout/Navbar';
import Home from './pages/home/Home';
import TournamentsList from './pages/tournaments/TournamentsList';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import CreateTournament from './pages/tournaments/CreateTournament';
import EditTournament from './pages/tournaments/EditTournament';
import TournamentApply from './pages/tournaments/TournamentApply';
import RegistrationsTable from './pages/registrations/RegistrationsTable';


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
              <Route path="/home" element={<Home />} />
              <Route path="/tournaments" element={<TournamentsList />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/create-tournament" element={<CreateTournament />} />
              <Route path="/edit-tournament/:id" element={<EditTournament />} />
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