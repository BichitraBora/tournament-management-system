import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const TournamentApply = () => {
    const { id } = useParams(); // Gets the tournament ID from the URL
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [tournament, setTournament] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch the tournament data on load
    useEffect(() => {
        const fetchTournament = async () => {
            try {
                // We use our existing GET route. In a massive app, you'd have a specific GET /:id route,
                // but since we already fetch all active tournaments, we can just filter it here for now.
                const { data } = await api.get('/tournaments');
                const foundTournament = data.find(t => t._id === id);
                
                if (!foundTournament) {
                    setMessage({ type: 'error', text: 'Tournament not found.' });
                    setLoading(false);
                    return;
                }

                setTournament(foundTournament);

                // Initialize the responses state object with empty/default values 
                // based on the Organizer's custom schema
                const initialResponses = {};
                foundTournament.registrationFormSchema.forEach(field => {
                    if (field.fieldType === 'checkbox') {
                        initialResponses[field.label] = false;
                    } else if (field.fieldType === 'dropdown' && field.options.length > 0) {
                        initialResponses[field.label] = field.options[0]; // Default to first option
                    } else {
                        initialResponses[field.label] = '';
                    }
                });
                setResponses(initialResponses);

            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load tournament details.' });
            } finally {
                setLoading(false);
            }
        };

        fetchTournament();
    }, [id]);

    // Handle typing/selecting in the dynamic form
    const handleResponseChange = (label, value) => {
        setResponses(prev => ({
            ...prev,
            [label]: value
        }));
    };

    // Submit the dynamic answers to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post(`/tournaments/${id}/register`, {
                dynamicResponses: responses
            });
            
            setMessage({ type: 'success', text: 'Successfully applied for the tournament!' });
            setTimeout(() => navigate('/tournaments'), 2000);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Failed to submit application.' 
            });
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-12 text-center text-gray-500 animate-pulse">Loading application...</div>;
    if (!tournament) return <div className="p-4 text-white bg-red-900 rounded-md">{message.text}</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            
            {/* --- TOURNAMENT DETAILS HEADER --- */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{tournament.title}</h1>
                    <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                        {tournament.category}
                    </span>
                </div>
                <p className="mb-6 text-gray-600">{tournament.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 md:grid-cols-4 text-sm">
                    <div>
                        <span className="block text-gray-500">Start Date</span>
                        <span className="font-medium text-gray-900">{new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500">Entry Fee</span>
                        <span className="font-medium text-gray-900">
                            {tournament.joiningFee === 0 ? 'Free' : `₹${tournament.joiningFee}`}
                        </span>
                    </div>
                    <div className="md:col-span-2">
                        <span className="block text-gray-500">Organizer</span>
                        <span className="font-medium text-gray-900">{tournament.organizerId?.name || 'Admin'}</span>
                    </div>
                </div>
            </div>

            {/* --- DYNAMIC APPLICATION FORM --- */}
            <form onSubmit={handleSubmit} className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Registration Form</h2>

                {message.text && (
                    <div className={`p-4 mb-6 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-900 text-white'}`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Map through the custom schema array saved in the DB */}
                    {tournament.registrationFormSchema.map((field, index) => (
                        <div key={index}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                            </label>

                            {/* TEXT INPUT */}
                            {field.fieldType === 'text' && (
                                <input
                                    type="text"
                                    required={field.isRequired}
                                    value={responses[field.label]}
                                    onChange={(e) => handleResponseChange(field.label, e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                                />
                            )}

                            {/* NUMBER INPUT */}
                            {field.fieldType === 'number' && (
                                <input
                                    type="number"
                                    required={field.isRequired}
                                    value={responses[field.label]}
                                    onChange={(e) => handleResponseChange(field.label, e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                                />
                            )}

                            {/* DROPDOWN INPUT */}
                            {field.fieldType === 'dropdown' && (
                                <select
                                    required={field.isRequired}
                                    value={responses[field.label]}
                                    onChange={(e) => handleResponseChange(field.label, e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                                >
                                    {field.options.map((opt, i) => (
                                        <option key={i} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}

                            {/* CHECKBOX INPUT */}
                            {field.fieldType === 'checkbox' && (
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        required={field.isRequired}
                                        checked={responses[field.label]}
                                        onChange={(e) => handleResponseChange(field.label, e.target.checked)}
                                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                    />
                                    <span className="text-sm text-gray-700">Yes, I confirm.</span>
                                </label>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-8 mt-8 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={submitting || user?.role === 'Organizer'}
                        className="w-full px-6 py-3 font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {user?.role === 'Organizer' 
                            ? 'Organizers Cannot Apply' 
                            : submitting 
                                ? 'Submitting...' 
                                : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TournamentApply;