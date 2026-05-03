// backend/controllers/tournamentController.js
import Tournament from '../models/Tournament.js';

// @desc    Create a new tournament (with dynamic form schema)
// @route   POST /api/tournaments
// @access  Private / Organizer Only
export const createTournament = async (req, res) => {
    try {
        const { title, description, category, startDate, joiningFee, registrationFormSchema } = req.body;

        const tournament = await Tournament.create({
            organizerId: req.user._id, // We get this from the 'protect' middleware!
            title,
            description,
            category,
            startDate,
            joiningFee,
            registrationFormSchema // The custom questions array
        });

        res.status(201).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all active tournaments
// @route   GET /api/tournaments
// @access  Public (Anyone can browse tournaments)
export const getTournaments = async (req, res) => {
    try {
        // Find tournaments where isActive is true
        // populate() replaces the organizerId string with the actual Organizer's name and email
        const tournaments = await Tournament.find({ isActive: true })
            .populate('organizerId', 'name email'); 
            
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};