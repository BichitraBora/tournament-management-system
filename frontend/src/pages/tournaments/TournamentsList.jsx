import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const TournamentsList = () => {
    const [tournaments, setTournaments] = useState([]);
    const [myApplications, setMyApplications] = useState([]); // NEW: State for participant apps
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Default to management/tracking tabs instead of explore
    const [activeTab, setActiveTab] = useState('explore');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch all live tournaments for the Explore tab
                const tourneyRes = await api.get('/tournaments');
                setTournaments(tourneyRes.data);

                // 2. If user is a Participant, fetch their specific applications
                if (user?.role === 'Participant') {
                    const appsRes = await api.get('/tournaments/my/registrations');
                    setMyApplications(appsRes.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

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

    // --- Helper for Status Badge Colors ---
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pending
        }
    };

    if (loading) return <div className="py-12 text-center text-gray-500 animate-pulse">Loading hub...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            
            {/* --- PAGE HEADER & TABS --- */}
            <div className="flex flex-col gap-6 pb-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black text-gray-900">Tournaments Hub</h1>
                    {user?.role === 'Organizer' && activeTab === 'my-tournaments' && (
                        <button 
                            onClick={() => navigate('/create-tournament')}
                            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 shadow-sm"
                        >
                            + Create Tournament
                        </button>
                    )}
                </div>
                
                {/* Dynamic Tabs based on Role */}
                <div className="flex space-x-8">
                    {user?.role === 'Organizer' ? (
                        <button 
                            onClick={() => setActiveTab('my-tournaments')}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'my-tournaments' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                        >
                            My Tournaments
                        </button>
                    ) : (
                        <button 
                            onClick={() => setActiveTab('my-applications')}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'my-applications' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                        >
                            My Applications
                        </button>
                    )}
                    
                    <button 
                        onClick={() => setActiveTab('explore')}
                        className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'explore' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                    >
                        Explore All
                    </button>
                </div>
            </div>

            {/* =========================================
                TAB 1: MY TOURNAMENTS (ORGANIZER VIEW) 
            ========================================= */}
            {activeTab === 'my-tournaments' && user?.role === 'Organizer' && (
                <div className="grid grid-cols-1 gap-6">
                    {myTournaments.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                            <p className="mb-4 text-gray-500">You haven't created any tournaments yet.</p>
                            <button onClick={() => navigate('/create-tournament')} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Create Your First Tournament</button>
                        </div>
                    ) : (
                        myTournaments.map(tournament => (
                            <div key={tournament._id} className="flex flex-col overflow-hidden transition-all bg-white border border-gray-200 rounded-xl shadow-sm md:flex-row hover:shadow-md">
                                <div className="relative overflow-hidden bg-gray-100 shrink-0 md:w-64 h-48 md:h-auto">
                                    <img src={tournament.bannerImage || 'https://placehold.co/600x400/111827/ffffff'} alt={tournament.title} className="object-cover w-full h-full" />
                                    <div className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white bg-gray-900/80 backdrop-blur-sm rounded uppercase tracking-wider">{tournament.category}</div>
                                </div>
                                <div className="flex flex-col justify-between flex-grow p-6">
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                                            <div className="text-right shrink-0 ml-4">
                                                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Prize Pool</span>
                                                <span className="font-bold text-green-600">{tournament.prizeAmount === 0 ? 'TBD' : `₹${tournament.prizeAmount}`}</span>
                                            </div>
                                        </div>
                                        <p className="mb-4 text-sm text-gray-500 line-clamp-2">{tournament.description}</p>
                                    </div>
                                    <div className="flex gap-2 pt-4 mt-auto border-t border-gray-100">
                                        <button onClick={() => navigate(`/tournaments/${tournament._id}/registrations`)} className="flex-grow px-4 py-2 text-sm font-medium text-gray-900 transition-colors bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                                            Manage Registrations
                                        </button>
                                        <button onClick={() => navigate(`/edit-tournament/${tournament._id}`)} className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded hover:bg-gray-50">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(tournament._id)} className="px-4 py-2 text-sm font-medium text-red-600 transition-colors bg-red-50 border border-red-100 rounded hover:bg-red-100">
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
                TAB 2: MY APPLICATIONS (PARTICIPANT VIEW) 
            ========================================= */}
            {activeTab === 'my-applications' && user?.role === 'Participant' && (
                <div className="grid grid-cols-1 gap-4">
                    {myApplications.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                            <p className="mb-4 text-gray-500">You haven't applied to any tournaments yet.</p>
                            <button onClick={() => setActiveTab('explore')} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Find a Tournament</button>
                        </div>
                    ) : (
                        myApplications.map(app => (
                            <div key={app._id} className="flex items-center justify-between p-5 transition-all bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 overflow-hidden bg-gray-100 rounded-lg shadow-inner shrink-0 hidden sm:block">
                                        <img 
                                            src={app.tournamentId?.bannerImage || 'https://placehold.co/100x100/111827/ffffff'} 
                                            alt="Banner" 
                                            className="object-cover w-full h-full" 
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {app.tournamentId?.title || 'Tournament Deleted/Ended'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border rounded-full ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                    <button 
                                        onClick={() => navigate(`/tournaments/${app.tournamentId?._id}`)}
                                        className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                    >
                                        View Event
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* =========================================
                TAB 3: EXPLORE ALL (PUBLIC VIEW) 
            ========================================= */}
            {activeTab === 'explore' && (
                <div className="space-y-6">
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
                            <p className="text-gray-500">No active tournaments match your search.</p>
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
                                            {user?.role === 'Organizer' ? 'View Details' : 'View & Apply'}
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