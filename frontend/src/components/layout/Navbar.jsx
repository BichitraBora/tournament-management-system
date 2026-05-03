import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Send them back to the login page
    };

    if (!user) return null; // Don't show the navbar if nobody is logged in

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <Link to="/dashboard" className="text-xl font-bold tracking-tight text-gray-900">
                        Play<span className="text-gray-400">.Champ</span>
                    </Link>

                    {/* Right side - User Info & Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="text-sm">
                            <span className="text-gray-500">Signed in as </span>
                            <span className="font-medium text-gray-900">{user.name}</span>
                            <span className="px-2 py-0.5 ml-2 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full">
                                {user.role}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
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