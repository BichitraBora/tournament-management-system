import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const RegistrationsTable = () => {
    const { id } = useParams(); // This is the tournamentId from the URL
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all registrations for this specific tournament
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const { data } = await api.get(`/tournaments/${id}/registrations`);
                setRegistrations(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load registrations.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'Organizer') {
            fetchRegistrations();
        } else {
            // Kick out participants trying to snoop!
            navigate('/dashboard'); 
        }
    }, [id, user, navigate]);

    // Handle Approve/Reject status updates
    const handleStatusUpdate = async (registrationId, newStatus) => {
        try {
            await api.patch(`/tournaments/${id}/registrations/${registrationId}`, {
                status: newStatus
            });
            
            // Update the UI locally without needing to refresh the page
            setRegistrations(prev => 
                prev.map(reg => reg._id === registrationId ? { ...reg, status: newStatus } : reg)
            );
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    // Extract dynamic headers from the first registration document (if it exists)
    // We get the keys from the dynamicResponses object
    const dynamicHeaders = registrations.length > 0 
        ? Object.keys(registrations[0].dynamicResponses || {}) 
        : [];

    if (loading) return <div className="py-12 text-center text-gray-500 animate-pulse">Loading data...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <button 
                        onClick={() => navigate('/tournaments')}
                        className="mb-2 text-sm text-gray-500 hover:text-gray-900 hover:underline"
                    >
                        ← Back to Tournaments
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Registrations</h1>
                </div>
            </div>

            {error && <div className="p-4 text-white bg-red-900 rounded-md">{error}</div>}

            {registrations.length === 0 ? (
                <div className="py-12 text-center bg-white border border-gray-200 rounded-lg border-dashed shadow-sm">
                    <p className="text-gray-500">No one has registered for this tournament yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">Participant Info</th>
                                
                                {/* Dynamically render headers based on the Organizer's custom form */}
                                {dynamicHeaders.map(header => (
                                    <th key={header} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                                
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4 font-medium text-right text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {registrations.map((reg) => (
                                <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
                                    
                                    {/* Participant Name & Email (Populated by Mongoose) */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{reg.participantId?.name}</div>
                                        <div className="text-xs text-gray-500">{reg.participantId?.email}</div>
                                    </td>

                                    {/* Dynamic Form Answers */}
                                    {dynamicHeaders.map(header => (
                                        <td key={header} className="px-6 py-4">
                                            {/* Convert boolean checkboxes to Yes/No for readability */}
                                            {typeof reg.dynamicResponses[header] === 'boolean' 
                                                ? (reg.dynamicResponses[header] ? 'Yes' : 'No') 
                                                : reg.dynamicResponses[header] || '-'}
                                        </td>
                                    ))}

                                    {/* Status Badge */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                            reg.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            reg.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {reg.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => handleStatusUpdate(reg._id, 'Approved')}
                                                disabled={reg.status === 'Approved'}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded hover:bg-gray-800 disabled:opacity-30 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(reg._id, 'Rejected')}
                                                disabled={reg.status === 'Rejected'}
                                                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RegistrationsTable;