import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Protect the route: if not logged in, boot them to the login page
    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // Fetch the tournaments
    useEffect(() => {
        const fetchTournaments = async () => {
            if (!user) return;
            try {
                const { data } = await api.get('/tournaments');
                
                if (user.role === 'Organizer') {
                    // Organizers only see their own tournaments
                    const myTournaments = data.filter(t => t.organizerId._id === user._id);
                    setTournaments(myTournaments);
                } else {
                    // Participants see all active tournaments
                    setTournaments(data);
                }
            } catch (error) {
                console.error("Failed to fetch tournaments:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchTournaments();
    }, [user]);

    // Show nothing while the auth state is figuring itself out
    if (loading || !user) return null; 

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                    {user.role === 'Organizer' ? 'My Tournaments' : 'Available Tournaments'}
                </h1>
                
                {user.role === 'Organizer' && (
                    <button
                    onClick={() => navigate('/create-tournament')}
                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800">
                        + Create Tournament
                    </button>
                )}
            </div>

            {isLoadingData ? (
                <div className="text-gray-500 animate-pulse">Loading data...</div>
            ) : tournaments.length === 0 ? (
                <div className="py-12 text-center bg-white border border-gray-200 rounded-lg border-dashed">
                    <p className="text-gray-500">No tournaments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tournaments.map((tournament) => (
                        <div key={tournament._id} className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">{tournament.title}</h3>
                                <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                                    {tournament.category}
                                </span>
                            </div>
                            <p className="flex-grow mb-4 text-sm text-gray-600 line-clamp-2">
                                {tournament.description}
                            </p>
                            <div className="pt-4 mt-auto border-t border-gray-100">
                                {user.role === 'Organizer' ? (
                                    <button 
                                        onClick={() => navigate(`/tournaments/${tournament._id}/registrations`)}
                                        className="w-full px-4 py-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                        Manage Registrations
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => navigate(`/tournaments/${tournament._id}`)}
                                        className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800">
                                     View & Apply
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;