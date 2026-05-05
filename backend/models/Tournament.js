import mongoose from 'mongoose';

// Schema defining what a custom form field looks like
const formFieldSchema = new mongoose.Schema({
    label: { type: String, required: true }, // e.g., "In-Game ID" or "T-Shirt Size"
    fieldType: { 
        type: String, 
        enum: ['text', 'number', 'email', 'dropdown', 'checkbox'], 
        required: true 
    },
    isRequired: { type: Boolean, default: false },
    options: [{ type: String }] // Used only if fieldType is 'dropdown' or 'checkbox'
});

const tournamentSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the User model
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Physical', 'Digital'],
        required: true
    },
    startDate: { type: Date, required: true },
    joiningFee: { type: Number, default: 0 },
    prizeAmount: { type: Number, default: 0 },
    registrationFormSchema: [formFieldSchema],

    bannerImage: { 
        type: String, 
        default: 'https://placehold.co/600x400/111827/ffffff?text=Tournament+Banner' // A default placeholder image if they don't upload one
    },

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);
export default Tournament;