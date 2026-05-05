import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Gets the current URL path
    const [searchQuery, setSearchQuery] = useState('');

    // TASK 1: Hide Navbar if we are on the Auth/Login page (or if not logged in)
    if (location.pathname === '/' || !user) {
        return null; 
    }

    const handleLogout = async () => {
        await logout();
        navigate('/'); 
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // For now, this just logs. We will wire it up to a search page later if needed!
        console.log("Searching for:", searchQuery);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container px-4 mx-auto max-w-7xl">
                <div className="flex items-center justify-between h-16 gap-4">
                    
                    {/* Left Section: Logo & Main Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="text-2xl font-black tracking-tighter text-gray-900">
                            Play<span className="text-gray-400">.Champ</span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden space-x-6 md:flex">
                            <Link to="/dashboard" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Home</Link>
                            <Link to="/tournaments" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Tournaments</Link>
                            <Link to="/about" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">About</Link>
                            <Link to="/contact" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">Contact Us</Link>
                        </div>
                    </div>

                    {/* Middle Section: Search Bar */}
                    <div className="flex-1 max-w-md hidden lg:block">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                {/* Simple SVG Search Icon */}
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tournaments, players..." 
                                className="w-full py-1.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
                            />
                        </form>
                    </div>

                    {/* Right Section: User Profile & Actions */}
                    <div className="flex items-center space-x-4 shrink-0">
                        <div className="hidden text-sm text-right md:block">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                            {/* Shows the first letter of the user's name as an avatar */}
                            {user.name.charAt(0).toUpperCase()}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                            Log out
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;