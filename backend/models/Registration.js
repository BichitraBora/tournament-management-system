// backend/models/Registration.js
import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Using a Map or Mixed type to store the unpredictable form answers
    // Example: { "In-Game ID": "KillerX", "T-Shirt Size": "M" }
    dynamicResponses: {
        type: mongoose.Schema.Types.Mixed, // Tells Mongoose to accept any valid JSON object
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Failed'],
        default: 'Unpaid'
    }
}, { timestamps: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;