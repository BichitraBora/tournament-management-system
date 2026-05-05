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

    const handleDelete = async (tournamentId) => {
        // Built-in browser confirmation dialog
        if (window.confirm('Are you sure you want to delete this tournament? This cannot be undone.')) {
            try {
                await api.delete(`/tournaments/${tournamentId}`);
                // Remove the deleted tournament from the React state instantly
                setTournaments(tournaments.filter(t => t._id !== tournamentId));
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete tournament');
            }
        }
    };

    // Show nothing while the auth state is figuring itself out
    if (loading || !user) return null;

    return (
        <div className="space-y-6">
           
            {/* --- DASHBOARD HEADER --- */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                    {user.role === 'Organizer' ? 'My Tournaments' : 'Available Tournaments'}
                </h1>
               
                {user.role === 'Organizer' && (
                    <button
                        onClick={() => navigate('/create-tournament')}
                        className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 shadow-sm"
                    >
                        + Create Tournament
                    </button>
                )}
            </div>

            {/* --- TOURNAMENTS LIST --- */}
            {isLoadingData ? (
                <div className="text-gray-500 animate-pulse">Loading data...</div>
            ) : tournaments.length === 0 ? (
                <div className="py-12 text-center bg-white border border-gray-200 rounded-lg border-dashed">
                    <p className="text-gray-500">No tournaments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {tournaments.map((tournament) => (
                        <div key={tournament._id} className="flex flex-col overflow-hidden transition-all bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:shadow-md group">
                           
                            {/* Left Side: The Banner Image */}
                            <div className="relative overflow-hidden bg-gray-100 shrink-0 md:w-1/3 h-48 md:h-auto">
                                <img
                                    src={tournament.bannerImage || 'https://placehold.co/600x400/111827/ffffff?text=Play.Champ'}
                                    alt={tournament.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay Category Badge on the image */}
                                <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white bg-gray-900/80 backdrop-blur-sm rounded-md uppercase tracking-wider">
                                    {tournament.category}
                                </div>
                            </div>

                            {/* Right Side: Tournament Details */}
                            <div className="flex flex-col justify-between flex-grow p-6">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                                        <div className="text-right shrink-0 ml-4">
                                            {/* Entry Fee */}
                                            <div className="mb-1">
                                                <span className="block text-xs text-gray-500 uppercase tracking-wider">Entry Fee</span>
                                                <span className="font-bold text-gray-900">{tournament.joiningFee === 0 ? 'Free' : `₹${tournament.joiningFee}`}</span>
                                            </div>
                                            {/* Prize Pool */}
                                            <div>
                                                <span className="block text-xs text-gray-500 uppercase tracking-wider">Prize Pool</span>
                                                <span className="font-bold text-green-600">{tournament.prizeAmount === 0 ? 'TBD' : `₹${tournament.prizeAmount}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                   
                                    <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
                                        {tournament.description}
                                    </p>
                                   
                                    <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(tournament.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 border-t border-gray-100 flex gap-2">
                                    {user.role === 'Organizer' ? (
                                        <>
                                            <button onClick={() => navigate(`/tournaments/${tournament._id}/registrations`)}
                                                className="flex-grow px-4 py-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300  rounded-md hover:bg-gray-50"> Registrations
                                            </button>
                                            <button onClick={() => navigate(`/edit-tournament/${tournament._id}`)}
                                                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"> Edit
                                            </button>
                                            <button onClick={() => handleDelete(tournament._id)}
                                                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"> Delete
                                            </button>
                                        </>
                                    ) : (
                                            <button onClick={() => navigate(`/tournaments/${tournament._id}`)}
                                                className="w-full px-6 py-2.5 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 md:w-auto"> View & Apply →
                                            </button>
                                        )}
                                </div>
                            </div>
                           
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
