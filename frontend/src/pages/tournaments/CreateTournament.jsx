import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateTournament = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 1. State for standard tournament details (Now includes bannerImage)
    const [basicDetails, setBasicDetails] = useState({
        title: '',
        description: '',
        category: 'Digital',
        startDate: '',
        joiningFee: 0,
        prizeAmount: 0,
        bannerImage: '', 
    });

    // 2. State for the Dynamic Form Builder
    const [customFields, setCustomFields] = useState([
        { label: '', fieldType: 'text', isRequired: true, optionsString: '' }
    ]);

    // --- Handlers for Basic Details ---
    const handleBasicChange = (e) => {
        setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
    };

    // --- Handler for Image Upload (Base64 Conversion) ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError("Image must be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setBasicDetails(prev => ({ ...prev, bannerImage: reader.result }));
            };
            reader.readAsDataURL(file); // Converts image to Base64 text string
        }
    };

    // --- Handlers for Dynamic Form Builder ---
    const addField = () => {
        setCustomFields([
            ...customFields, 
            { label: '', fieldType: 'text', isRequired: false, optionsString: '' }
        ]);
    };

    const removeField = (indexToRemove) => {
        setCustomFields(customFields.filter((_, index) => index !== indexToRemove));
    };

    const handleFieldChange = (index, fieldKey, value) => {
        const updatedFields = [...customFields];
        updatedFields[index][fieldKey] = value;
        setCustomFields(updatedFields);
    };

    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Clean up the custom fields before sending
            const formattedCustomFields = customFields.map(field => ({
                label: field.label,
                fieldType: field.fieldType,
                isRequired: field.isRequired,
                options: field.optionsString ? field.optionsString.split(',').map(s => s.trim()) : []
            }));

            // Combine both states into one payload
            const payload = {
                ...basicDetails,
                registrationFormSchema: formattedCustomFields
            };

            await api.post('/tournaments', payload);
            navigate('/tournaments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create tournament.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">Create Tournament</h1>
                <p className="mt-2 text-sm text-gray-500">Define the rules, upload a banner, and build your custom registration form.</p>
            </div>

            {error && <div className="p-4 text-sm text-white bg-red-900 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* --- SECTION 1: BASIC DETAILS --- */}
                <section className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">1. Basic Details</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Tournament Title</label>
                            <input type="text" name="title" required value={basicDetails.title} onChange={handleBasicChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="e.g., Valorant Winter Cup" />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" required value={basicDetails.description} onChange={handleBasicChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none" placeholder="Rules, prize pool, etc." />
                        </div>

                        {/* NEW: Banner Upload */}
                        <div className="md:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg border-dashed">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Tournament Banner Image (Max 2MB)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800 transition-colors" 
                            />
                            {/* Image Preview */}
                            {basicDetails.bannerImage && (
                                <div className="mt-4 overflow-hidden border border-gray-200 rounded-lg h-48 w-full">
                                    <img src={basicDetails.bannerImage} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                            <select name="category" value={basicDetails.category} onChange={handleBasicChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none">
                                <option value="Digital">Digital (Esports)</option>
                                <option value="Physical">Physical (Sports)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                            <input type="datetime-local" name="startDate" required value={basicDetails.startDate} onChange={handleBasicChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Joining Fee (₹)</label>
                            <input type="number" min="0" name="joiningFee" value={basicDetails.joiningFee} onChange={handleBasicChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Prize Pool (₹)</label>
                            <input type="number" min="0" name="prizeAmount" value={basicDetails.prizeAmount} onChange={handleBasicChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none text-green-700 font-bold" />
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: DYNAMIC FORM BUILDER --- */}
                <section className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">2. Registration Form Builder</h2>
                        <button type="button" onClick={addField} className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                            + Add Question
                        </button>
                    </div>
                    <p className="mb-6 text-sm text-gray-500">Define the questions participants must answer to join.</p>

                    <div className="space-y-4">
                        {customFields.map((field, index) => (
                            <div key={index} className="relative p-5 bg-white border border-gray-200 rounded-md shadow-sm group">
                                
                                {customFields.length > 1 && (
                                    <button type="button" onClick={() => removeField(index)} className="absolute text-gray-400 top-3 right-3 hover:text-red-600 transition-colors">
                                        ✕
                                    </button>
                                )}

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                                    <div className="md:col-span-6">
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Question / Label</label>
                                        <input type="text" required value={field.label} onChange={(e) => handleFieldChange(index, 'label', e.target.value)} placeholder="e.g., In-Game ID" className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                                    </div>
                                    
                                    <div className="md:col-span-4">
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Answer Type</label>
                                        <select value={field.fieldType} onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none">
                                            <option value="text">Short Text</option>
                                            <option value="number">Number</option>
                                            <option value="dropdown">Dropdown Options</option>
                                            <option value="checkbox">Yes/No Checkbox</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end md:col-span-2 pb-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                                            <input type="checkbox" checked={field.isRequired} onChange={(e) => handleFieldChange(index, 'isRequired', e.target.checked)} className="w-4 h-4 mr-2 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900" />
                                            Required
                                        </label>
                                    </div>
                                </div>

                                {field.fieldType === 'dropdown' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <label className="block mb-1 text-xs font-medium text-gray-700">Dropdown Options (Comma separated)</label>
                                        <input type="text" required value={field.optionsString} onChange={(e) => handleFieldChange(index, 'optionsString', e.target.value)} placeholder="e.g., Duelist, Initiator, Controller, Sentinel" className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- SUBMIT BUTTON --- */}
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50">
                        {isLoading ? 'Publishing...' : 'Publish Tournament'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTournament;