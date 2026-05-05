import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const TournamentsList = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // If the user is an Organizer, default to their management tab. Otherwise, explore.
    const [activeTab, setActiveTab] = useState(user?.role === 'Organizer' ? 'my-tournaments' : 'explore');

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const { data } = await api.get('/tournaments');
                setTournaments(data);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    // --- Delete Handler for Organizers ---
    const handleDelete = async (tournamentId) => {
        if (window.confirm('Are you sure you want to delete this tournament? This cannot be undone.')) {
            try {
                await api.delete(`/tournaments/${tournamentId}`);
                setTournaments(tournaments.filter(t => t._id !== tournamentId));
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete tournament');
            }
        }
    };

    // --- Filters ---
    const myTournaments = tournaments.filter(t => t.organizerId?._id === user?._id || t.organizerId === user?._id);
    
    const filteredExploreTournaments = tournaments.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="py-12 text-center text-gray-500 animate-pulse">Loading tournaments...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            
            {/* Page Header & Tabs */}
            <div className="flex flex-col gap-6 pb-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black text-gray-900">Tournaments Hub</h1>
                    {user?.role === 'Organizer' && activeTab === 'my-tournaments' && (
                        <button 
                            onClick={() => navigate('/create-tournament')}
                            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
                        >
                            + Create Tournament
                        </button>
                    )}
                </div>
                
                {/* Tabs for Organizers */}
                {user?.role === 'Organizer' && (
                    <div className="flex space-x-8">
                        <button 
                            onClick={() => setActiveTab('my-tournaments')}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'my-tournaments' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            My Tournaments
                        </button>
                        <button 
                            onClick={() => setActiveTab('explore')}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'explore' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Explore All
                        </button>
                    </div>
                )}
            </div>

            {/* =========================================
                TAB 1: MY TOURNAMENTS (MANAGEMENT VIEW) 
            ========================================= */}
            {activeTab === 'my-tournaments' && user?.role === 'Organizer' && (
                <div className="grid grid-cols-1 gap-6">
                    {myTournaments.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                            <p className="text-gray-500 mb-4">You haven't created any tournaments yet.</p>
                            <button onClick={() => navigate('/create-tournament')} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Create Your First Tournament</button>
                        </div>
                    ) : (
                        myTournaments.map(tournament => (
                            <div key={tournament._id} className="flex flex-col overflow-hidden transition-all bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:shadow-md">
                                {/* Left Side: Banner */}
                                <div className="relative overflow-hidden bg-gray-100 shrink-0 md:w-64 h-48 md:h-auto">
                                    <img src={tournament.bannerImage || 'https://placehold.co/600x400/111827/ffffff'} alt={tournament.title} className="object-cover w-full h-full" />
                                    <div className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white bg-gray-900/80 backdrop-blur-sm rounded uppercase tracking-wider">{tournament.category}</div>
                                </div>

                                {/* Right Side: Details & Actions */}
                                <div className="flex flex-col justify-between flex-grow p-6">
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                                            <div className="text-right shrink-0 ml-4">
                                                <span className="block text-xs text-gray-500 uppercase tracking-wider">Prize Pool</span>
                                                <span className="font-bold text-green-600">{tournament.prizeAmount === 0 ? 'TBD' : `₹${tournament.prizeAmount}`}</span>
                                            </div>
                                        </div>
                                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{tournament.description}</p>
                                    </div>

                                    {/* Organizer Action Buttons */}
                                    <div className="pt-4 mt-auto border-t border-gray-100 flex gap-2">
                                        <button onClick={() => navigate(`/tournaments/${tournament._id}/registrations`)} className="flex-grow px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                                            Manage Registrations
                                        </button>
                                        <button onClick={() => navigate(`/edit-tournament/${tournament._id}`)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(tournament._id)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* =========================================
                TAB 2: EXPLORE (PUBLIC VIEW) 
            ========================================= */}
            {(activeTab === 'explore' || user?.role !== 'Organizer') && (
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <input 
                            type="text" 
                            placeholder="Filter by name or game..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none shadow-sm"
                        />
                    </div>

                    {filteredExploreTournaments.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                            <p className="text-gray-500">No tournaments match your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredExploreTournaments.map((tournament) => (
                                <div key={tournament._id} className="flex flex-col overflow-hidden transition-all bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md group">
                                    <div className="relative h-44 overflow-hidden bg-gray-100">
                                        <img src={tournament.bannerImage || 'https://placehold.co/600x400/111827/ffffff'} alt={tournament.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold text-white bg-gray-900/90 backdrop-blur-sm rounded uppercase tracking-widest">{tournament.category}</div>
                                    </div>
                                    <div className="flex flex-col flex-grow p-5">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{tournament.title}</h3>
                                        <div className="flex justify-between mt-3 mb-5">
                                            <div>
                                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Entry</span>
                                                <span className="text-sm font-bold text-gray-900">{tournament.joiningFee === 0 ? 'Free' : `₹${tournament.joiningFee}`}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Prize</span>
                                                <span className="text-sm font-bold text-green-600">{tournament.prizeAmount === 0 ? 'TBD' : `₹${tournament.prizeAmount}`}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate(`/tournaments/${tournament._id}`)} className="w-full py-2.5 mt-auto text-xs font-bold text-white uppercase tracking-widest transition-colors bg-gray-900 rounded hover:bg-gray-800">
                                            {user?.role === 'Organizer' ? 'View Tournament' : 'View & Apply'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default TournamentsList;