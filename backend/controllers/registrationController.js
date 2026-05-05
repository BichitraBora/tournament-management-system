// backend/controllers/registrationController.js
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';

// @desc    Register a participant for a tournament
// @route   POST /api/tournaments/:tournamentId/register
// @access  Private (Logged in users only)
export const registerForTournament = async (req, res) => {
    try {
        const { tournamentId } = req.params;
        const { dynamicResponses } = req.body; 

        // 1. Verify the tournament actually exists
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // 2. Prevent duplicate registrations
        const alreadyRegistered = await Registration.findOne({
            tournamentId: tournamentId,
            participantId: req.user._id // Provided by the protect middleware
        });

        if (alreadyRegistered) {
            return res.status(400).json({ message: 'You have already registered for this tournament' });
        }

        // 3. Save the custom responses
        // Notice we don't strictly validate the fields against the schema here on the backend yet.
        // For a V1, we trust the React frontend to enforce "required" fields before sending.
        const registration = await Registration.create({
            tournamentId: tournamentId,
            participantId: req.user._id,
            dynamicResponses: dynamicResponses
        });

        res.status(201).json({
            message: 'Successfully registered!',
            registration
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all registrations for a specific tournament (Organizer Dashboard)
// @route   GET /api/tournaments/:tournamentId/registrations
// @access  Private / Organizer Only
export const getTournamentRegistrations = async (req, res) => {
    try {
        const { tournamentId } = req.params;

        // Verify the user requesting this data is the organizer of THIS tournament
        const tournament = await Tournament.findById(tournamentId);
        
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // req.user._id is an object, tournament.organizerId is an object. 
        // We convert them to strings to compare them safely.
        if (tournament.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not the organizer of this tournament' });
        }

        // Fetch all registrations and populate the participant's name and email
        const registrations = await Registration.find({ tournamentId })
            .populate('participantId', 'name email');

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a participant's registration status (Approve/Reject)
// @route   PATCH /api/tournaments/:tournamentId/registrations/:registrationId
// @access  Private / Organizer Only
export const updateRegistrationStatus = async (req, res) => {
    try {
        const { tournamentId, registrationId } = req.params;
        const { status } = req.body;

        // 1. Validate the incoming status so no one sends weird data
        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        // 2. Verify the tournament exists and the user is the actual organizer
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        
        if (tournament.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to manage this tournament' });
        }

        // 3. Find the specific registration document
        const registration = await Registration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // 4. Update and save
        registration.status = status;
        await registration.save();

        res.status(200).json({
            message: `Registration successfully marked as ${status}`,
            registration
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

