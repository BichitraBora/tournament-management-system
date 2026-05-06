import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditTournament = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    const [basicDetails, setBasicDetails] = useState({
        title: '', description: '', category: 'Digital', startDate: '', joiningFee: 0, prizeAmount: 0, bannerImage: '',
    });

    const [customFields, setCustomFields] = useState([]);

    // Fetch existing data when the page loads
    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const { data } = await api.get('/tournaments');
                const tournament = data.find(t => t._id === id);
                
                if (tournament) {
                    // Format the date for the HTML datetime-local input
                    const formattedDate = new Date(tournament.startDate).toISOString().slice(0, 16);
                    
                    setBasicDetails({
                        title: tournament.title,
                        description: tournament.description,
                        category: tournament.category,
                        startDate: formattedDate,
                        joiningFee: tournament.joiningFee,
                        prizeAmount: tournament.prizeAmount || 0,
                        bannerImage: tournament.bannerImage || '',
                    });

                    // Format custom fields back into the local state structure
                    const loadedFields = tournament.registrationFormSchema.map(field => ({
                        ...field,
                        optionsString: field.options ? field.options.join(', ') : ''
                    }));
                    setCustomFields(loadedFields.length > 0 ? loadedFields : [{ label: '', fieldType: 'text', isRequired: true, optionsString: '' }]);
                }
            } catch (err) {
                setError('Failed to load tournament data.');
            } finally {
                setIsFetching(false);
            }
        };
        fetchTournament();
    }, [id]);

    const handleBasicChange = (e) => setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { setError("Image must be less than 2MB"); return; }
            const reader = new FileReader();
            reader.onloadend = () => setBasicDetails(prev => ({ ...prev, bannerImage: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const addField = () => setCustomFields([...customFields, { label: '', fieldType: 'text', isRequired: false, optionsString: '' }]);
    const removeField = (indexToRemove) => setCustomFields(customFields.filter((_, index) => index !== indexToRemove));
    const handleFieldChange = (index, fieldKey, value) => {
        const updatedFields = [...customFields];
        updatedFields[index][fieldKey] = value;
        setCustomFields(updatedFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formattedCustomFields = customFields.map(field => ({
                label: field.label, fieldType: field.fieldType, isRequired: field.isRequired,
                options: field.optionsString ? field.optionsString.split(',').map(s => s.trim()) : []
            }));

            const payload = { ...basicDetails, registrationFormSchema: formattedCustomFields };

            // Notice we use PUT here instead of POST!
            await api.put(`/tournaments/${id}`, payload);
            navigate('/tournaments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update tournament.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="py-12 text-center text-gray-500 animate-pulse">Loading tournament data...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">Edit Tournament</h1>
            </div>

            {error && <div className="p-4 text-sm text-white bg-red-900 rounded-md">{error}</div>}

            {/* Same exact form structure as CreateTournament */}
            <form onSubmit={handleSubmit} className="space-y-10">
                <section className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">1. Basic Details</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Tournament Title</label>
                            <input type="text" name="title" required value={basicDetails.title} onChange={handleBasicChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" required value={basicDetails.description} onChange={handleBasicChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900" />
                        </div>
                        <div className="md:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg border-dashed">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Update Banner Image</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-900 file:text-white" />
                            {basicDetails.bannerImage && (
                                <div className="mt-4 overflow-hidden border border-gray-200 rounded-lg h-48 w-full">
                                    <img src={basicDetails.bannerImage} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                            <select name="category" value={basicDetails.category} onChange={handleBasicChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                <option value="Digital">Digital (Esports)</option>
                                <option value="Physical">Physical (Sports)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                            <input type="datetime-local" name="startDate" required value={basicDetails.startDate} onChange={handleBasicChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Joining Fee (₹)</label>
                            <input type="number" min="0" name="joiningFee" value={basicDetails.joiningFee} onChange={handleBasicChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Prize Pool (₹)</label>
                            <input type="number" min="0" name="prizeAmount" value={basicDetails.prizeAmount} onChange={handleBasicChange} className="w-full px-4 py-2 border border-gray-300 rounded-md text-green-700 font-bold" />
                        </div>
                    </div>
                </section>

                <section className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">2. Registration Form Builder</h2>
                        <button type="button" onClick={addField} className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                            + Add Question
                        </button>
                    </div>
                    <div className="space-y-4">
                        {customFields.map((field, index) => (
                            <div key={index} className="relative p-5 bg-white border border-gray-200 rounded-md shadow-sm">
                                {customFields.length > 1 && (
                                    <button type="button" onClick={() => removeField(index)} className="absolute text-gray-400 top-3 right-3 hover:text-red-600">✕</button>
                                )}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                                    <div className="md:col-span-6">
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Question / Label</label>
                                        <input type="text" required value={field.label} onChange={(e) => handleFieldChange(index, 'label', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded" />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Answer Type</label>
                                        <select value={field.fieldType} onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded">
                                            <option value="text">Short Text</option>
                                            <option value="number">Number</option>
                                            <option value="dropdown">Dropdown Options</option>
                                            <option value="checkbox">Yes/No Checkbox</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end md:col-span-2 pb-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                                            <input type="checkbox" checked={field.isRequired} onChange={(e) => handleFieldChange(index, 'isRequired', e.target.checked)} className="w-4 h-4 mr-2 border-gray-300 rounded" />
                                            Required
                                        </label>
                                    </div>
                                </div>
                                {field.fieldType === 'dropdown' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Dropdown Options (Comma separated)</label>
                                        <input type="text" required value={field.optionsString} onChange={(e) => handleFieldChange(index, 'optionsString', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-md disabled:opacity-50">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTournament;